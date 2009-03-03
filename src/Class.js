UmlCanvas.Class = Class.create( Canvas2D.Rectangle, {
    config:     { font:               "7pt Sans black",
		  fontAbstract:       "italic 7pt Sans black",
		  lineColor:          "rgba(255,0,0,1)",
		  lineWidth:          1,
		  backgroundColor:    "rgba(255,255,200,1)",
		  lineSpacing:        5,
		  compartmentSpacing: 3,
		  padding:            5 },

    getType: function() { return "Class"; },

    myProperties: function() {
	return [ "stereotype", "abstract", "supers" ];
    },

    getStereotype: function() { return this.stereotype; },
    isAbstract   : function() { return this['abstract'];},
    getSupers    : function() { return this.supers;     },

    addSuper: function(zuper) {
	if( ! this.supers ) { this.supers = [] }
	this.supers.push(zuper);
    },

    setup: function(props) {
	this.attributes  = new Array();
	this.operations  = new Array();
	this.markUnprepared();
    },

    prepare: function(sheet) {
	if( this.prepared    ) { return; }

	// className and stereotype
	var strings = [ this.getName(), "<<" + this.getStereotype() + ">>" ];
	// attributes
	this.attributes.each(function(attribute) {
	    strings.push(attribute.toString());
	});
	// operations
	this.operations.each(function(operation) {
	    strings.push(operation.toString());
	});

	var maxWidth = 0;
	sheet.font = this.config.font;
	strings.each(function(string) {
	    var width = sheet.measureText(string);
	    maxWidth = width >= maxWidth ? width : maxWidth;
	}.bind(this) );

	// calculate width ...
	this.width = ( 2 * this.config.padding ) + maxWidth;

	var lineSize = parseInt(this.config.font) + this.config.lineSpacing;
	var attributesHeight = this.attributes.length > 0 ?
	    ( this.attributes.length * lineSize )
	    + ( 2 * this.config.compartmentSpacing )
	    : 0;
	var operationsHeight = this.operations.length > 0 ?
	    ( this.operations.length * lineSize )
	    + ( 2 * this.config.compartmentSpacing )
	    : 0;
	// ... and height
	this.height = attributesHeight + operationsHeight
	    + ( ( this.getStereotype() ? 2 : 1 ) * lineSize )
	    + ( 2 * this.config.padding );
	
	this.prepared = true;
    },

    markUnprepared: function() {
	this.prepared = false;	
	this.fireEvent("changed");
    },

    addAttribute: function(attribute) {
	// allowing shorthand hash notation, objectifying on the fly
	if( !(attribute instanceof UmlCanvas.Attribute) ) {
	    attribute = new UmlCanvas.Attribute( attribute );
	}
	this.attributes.push( attribute );
	this.markUnprepared();
	return attribute;
    },

    addOperation: function(operation) {
	// allowing shorthand hash notation, objectifying on the fly
	if( !(operation instanceof UmlCanvas.Operation) ) {
	    operation = new UmlCanvas.Operation( operation );
	}
	this.operations.push(operation);
	this.markUnprepared();
	return operation;
    },

    draw: function(sheet, left, top) {
	this.prepare(sheet);
	sheet.fillStyle   = this.config.backgroundColor;
	sheet.strokeStyle = this.config.lineColor;
	sheet.lineWidth   = this.config.lineWidth;

	var lineSize = parseInt(this.config.font) + this.config.lineSpacing

	// className compartment
	var classCompHeight = ( this.config.padding 
				+ (lineSize * (this.getStereotype() ? 2 : 1)) 
				+ this.config.compartmentSpacing );
	sheet.fillStrokeRect( left, top, this.getWidth(), classCompHeight );
	
	// attribute compartment
	var attrCompHeight = 0;
	if( this.attributes.length > 0 ) {
	    attrCompHeight =  ( this.config.compartmentSpacing
				+ ( lineSize * this.attributes.length )
				+ this.config.compartmentSpacing );
	    sheet.fillStrokeRect( left, top + classCompHeight, 
				  this.getWidth(), attrCompHeight );
	}

	// operation compartment
	var methCompHeight = 0;
	if( this.operations.length > 0 ) {
	    methCompHeight = ( this.config.compartmentSpacing
			       + ( lineSize * this.operations.length ) 
			       + this.config.padding );
	    sheet.fillStrokeRect( left, top + classCompHeight + attrCompHeight, 
				  this.getWidth(), methCompHeight );
	}
	// TEXT
	sheet.strokeStyle = this.config.fontColor;

	// stereotype
	sheet.font = this.isAbstract() ? 
	    this.config.fontAbstract : this.config.font;

	sheet.textAlign = "center";

	if( this.getStereotype() ) {
	    sheet.fillText( "<<" + this.getStereotype() + ">>",
			    left + ( this.getWidth()/2),
			    top  + ( this.config.padding + 
				     parseInt(this.config.font) ));
	}
	// className
	sheet.fillText( this.getName(),
			left + ( this.getWidth()/2 ), 
			top  + ( this.config.padding + 
				 parseInt(this.config.font)
				 + ( this.getStereotype() ? lineSize : 0 ) ) );
	
	// attributes
	sheet.textAlign = "left";
	sheet.font = this.config.font;
	for( var i=0; i<this.attributes.length; i++ ) {
	    sheet.fillText( this.attributes[i].toString(),
			    left + this.config.padding,
			    top + classCompHeight + ( lineSize * (i+1) ) );
	}

	// operations
	for( var i=0; i<this.operations.length; i++ ) {
	    sheet.fillText( this.operations[i].toString(),
			   left + this.config.padding,
			   top + classCompHeight 
			   + attrCompHeight + (lineSize*(i+1)) );
	}
    },

    asConstruct: function($super) {
	var construct = $super();
	delete construct.modifiers.geo;
	delete construct.modifiers[this.getColor()];

	if( this.getSupers() ) {
	    construct.supers = this.getSupers();
	}
	if( this.getStereotype() ) {
	    construct.modifiers.stereotype = this.getStereotype();
	}
	if( this.isAbstract() ) {
	    construct.modifiers['isAbstract'] = null;
	}
	this.attributes.each(function(attribute) {
	    construct.children.push(attribute.asConstruct());
	});
	this.operations.each(function(operation) {
	    construct.children.push(operation.asConstruct());
	});
	
	return construct;
    }
} );
    
UmlCanvas.Class.getNames = function() {
    return [ "class" ];
}

UmlCanvas.Class.from = function( construct, diagram ) {
    var props = {};
    
    // NAME
    props.name = construct.name;

    // STEREOTYPE
    var stereotype = construct.modifiers.get("stereotype" );
    if( stereotype ) {
	props.stereotype = stereotype.value.value;
    }

    // ABSTRACT
    props['abstract'] = construct.modifiers.get( "abstract" ) != null;

    var elem = new UmlCanvas.Class( props );

    // SUPERCLASS
    if( construct.supers.length > 0 ) {
	construct.supers.each(function(superName) {
	    var zuper = diagram.getClass(superName);
	    elem.addSuper(zuper);
	    var relation;
	    if( zuper instanceof UmlCanvas.Interface ) {
		relation = new UmlCanvas.Realization( zuper, elem );
	    } else {
		relation = new UmlCanvas.Inheritance( zuper, elem );
	    }
	    diagram.addRelation(relation);
	});
    }

    var left, top;
    if( construct.annotation ) {    
	var pos = construct.annotation.data.split(",");
	left = parseInt(pos[0]);
	top  = parseInt(pos[1]);
    } else {
	left = this.offset * ( this.unknownIndex++ );
	top = left;
    }
    diagram.at(left,top).put(elem);
    return elem;
};
    
Canvas2D.ADLVisitor.registerConstruct(UmlCanvas.Class);
