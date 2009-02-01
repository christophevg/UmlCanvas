UmlCanvas.Class = Class.create( Canvas2D.Rectangle, {
    prepared   : true,
    attributes : [],
    operations    : [],

    config:     { font:               "Sans",
		  fontSize:           10,
		  fontColor:          "black",
		  lineColor:          "rgba(255,0,0,1)",
		  lineWidth:          1,
		  backgroundColor:    "rgba(255,255,200,1)",
		  lineSpacing:        5,
		  compartmentSpacing: 3,
		  padding:            5 },

    initialize: function($super, props) {
	$super(props || {});
	this.attributes = new Array();
	this.operations    = new Array();
	this.markUnprepared();
    },

    getProperties: function($super) {
	var props = $super();
	props.type = "Class";
	return props;
    },
    
    measureText: function(text) {
	if( this.canvas ) { 
	    return this.canvas.measureText( this.config.font, 
	                                    this.config.fontSize, 
	                                    text );
	} else {
	    alert( "UmlCanvas.Class::measureText: need canvas" );
	}
    },

    drawText: function(top, text, font) {
	font = font || this.config.font;
	if( this.canvas ){
	    this.canvas.drawText( font, this.config.fontSize, 
				  this.props.left + this.config.padding, 
				  this.props.top  + top, 
				  text );
	} else {
	    alert( "UmlCanvas.Class::drawText: need canvas" );
	}
    },

    drawTextCenter: function(top, text, font) {
	font = font || this.config.font;
	if( this.canvas ) {
	    this.canvas.drawTextCenter( font, this.config.fontSize, 
					this.props.left + (this.props.width/2), 
					this.props.top  + top, 
					text );
	} else {
	    alert( "UmlCanvas.Class::drawTextCenter: need canvas" );
	}
    },

    fillStrokeRect: function(top, height) {
	if( this.canvas ) {
	    if( this.props.left ) {
		this.canvas.fillRect  (this.props.left, this.props.top + top, 
				       this.props.width, height);
		this.canvas.strokeRect(this.props.left, this.props.top + top, 
				       this.props.width, height);
	    } else {
		alert( "UmlCanvas.Class::fillStrokeRect: need position" );
	    }
	} else {
	    alert( "UmlCanvas.Class::fillStrokeRect: need canvas" );
	}
    },

    prepare: function() {
	if( !this.canvas     ) { return; }
	if( this.canvas.wait ) { return; }
	if( this.prepared    ) { return; }

	// find widest text amongst
	// ... className
	var maxWidth = this.measureText(this.props.name);

	// ... stereotype
	var width = this.measureText("<<" + this.props.stereotype + ">>" );
	maxWidth = width >= maxWidth ? width : maxWidth;

	// ... attributes
	for( var i=0; i<this.attributes.length; i++ ) {
	    var width = this.measureText(this.attributes[i].toString());
	    maxWidth = width >= maxWidth ? width : maxWidth;
	}
	// ... operations
	for( var i=0; i<this.operations.length; i++ ) {
	    var width = this.measureText( this.operations[i].toString() );
	    maxWidth = width >= maxWidth ? width : maxWidth;
	}

	// calculate width and height
	this.props.width = ( 2 * this.config.padding ) + maxWidth;

	var lineSize = this.config.fontSize + this.config.lineSpacing;
	var attributesHeight = this.attributes.length > 0 ?
	    ( this.attributes.length * lineSize )
	    + ( 2 * this.config.compartmentSpacing )
	    : 0;
	var operationsHeight = this.operations.length > 0 ?
	    ( this.operations.length * lineSize )
	    + ( 2 * this.config.compartmentSpacing )
	    : 0;
	
	this.props.height = attributesHeight + operationsHeight
	    + ( ( this.props.stereotype ? 2 : 1 ) * lineSize )
	    + ( 2 * this.config.padding );
	
	this.prepared = true;
    },

    markUnprepared: function() {
	this.prepared = false;	
	this.forceRedraw();
    },

    forceRedraw: function($super) {
	this.prepare();
	$super();
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

    render: function() {
	this.prepare();
	this.canvas.fillStyle   = this.config.backgroundColor;
	this.canvas.strokeStyle = this.config.lineColor;
	this.canvas.lineWidth   = this.config.lineWidth;

	var lineSize = this.config.fontSize + this.config.lineSpacing

	// className compartment
	var classCompHeight = ( this.config.padding 
				+ (lineSize * (this.props.stereotype ? 2 : 1)) 
				+ this.config.compartmentSpacing );
	this.fillStrokeRect( 0, classCompHeight );
	
	// attribute compartment
	var attrCompHeight = 0;
	if( this.attributes.length > 0 ) {
	    attrCompHeight =  ( this.config.compartmentSpacing
				+ ( lineSize * this.attributes.length )
				+ this.config.compartmentSpacing );
	    this.fillStrokeRect( classCompHeight, attrCompHeight );
	}

	// operation compartment
	var methCompHeight = 0;
	if( this.operations.length > 0 ) {
	    methCompHeight = ( this.config.compartmentSpacing
				   + ( lineSize * this.operations.length ) 
				   + this.config.padding );
	    this.fillStrokeRect( classCompHeight + attrCompHeight, 
				 methCompHeight );
	}
	// TEXT
	this.canvas.strokeStyle = this.config.fontColor;

	// stereotype
	if( this.props.stereotype ) {
	    this.drawTextCenter( this.config.padding + this.config.fontSize,
				 "<<" + this.props.stereotype + ">>" );
	}
	// className
	this.drawTextCenter( this.config.padding     + this.config.fontSize
			     + ( this.props.stereotype ? lineSize : 0 ), 
			     this.props.name, 
			     this.props.isAbstract ? "italic" : "sans" );

	// attributes
	for( var i=0; i<this.attributes.length; i++ ) {
	    this.drawText( classCompHeight + ( lineSize * (i+1) ), 
			   this.attributes[i].toString() );
	}

	// operations
	for( var i=0; i<this.operations.length; i++ ) {
	    this.drawText( classCompHeight + attrCompHeight + (lineSize*(i+1)),
			   this.operations[i].toString() );
	}
    },
    toADL: function(prefix) {
	var s = this.positionToString(prefix);
	s += prefix + "class "  + this.props.name;
	if( this.props.zuper ) {
	    s += " : " + this.props.zuper.props.name;
	}
	if( this.props.stereotype ) {
	    s += " +stereotype=\"" + this.props.stereotype + "\"";
	}
	if( this.props.isAbstract ) {
	    s += " +abstract";
	}
	s += " {\n";
	this.attributes.each(function(attribute) { 
	    s += attribute.toADL(prefix + "  ") + "\n";
	});
	this.operations.each(function(operation) { 
	    s += operation.toADL(prefix + "  ") + "\n";
	});
	s += prefix + "}";
	return s;

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
    props.isAbstract = construct.modifiers.get( "abstract" ) != null;

    var elem = new UmlCanvas.Class( props );

    // SUPERCLASS
    if( construct.zuper ) {
	var zuper = diagram.getClass(construct.zuper.constructName);
	elem.props.zuper = zuper;
	var relation;
	if( zuper instanceof UmlCanvas.Interface ) {
	    relation = new UmlCanvas.Realization( zuper, elem );
	} else {
	    relation = new UmlCanvas.Inheritance( zuper, elem );
	}
	diagram.addRelation(relation);
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
