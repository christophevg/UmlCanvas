UmlCanvas.Class = Canvas2D.Rectangle.extend( {
    addSuper: function(zuper) {
	if( ! this.supers ) { this.supers = [] }
	this.supers.push(zuper);
    },

    postInitialize: function(props) {
	this.attributes  = new Array();
	this.operations  = new Array();
	this.markUnprepared();
	// keep short-hand local reference
	this.config = UmlCanvas.Class.Defaults;
    },

    prepare: function(sheet) {
	if( this.prepared ) { return; }

	// className and stereotype
	var strings = [ this.getName(), "<<" + this.getStereotype() + ">>" ];
	// attributes
	this.attributes.iterate(function(attribute) {
	    strings.push(attribute.toString());
	});
	// operations
	this.operations.iterate(function(operation) {
	    strings.push(operation.toString());
	});

	var maxWidth = 0;
	sheet.font = this.getFont();
	strings.iterate(function(string) {
	    var width = sheet.measureText(string);
	    maxWidth = width >= maxWidth ? width : maxWidth;
	}.scope(this) );

	// calculate width ...
	this.width = ( 2 * this.config.padding ) + maxWidth;
	this.width = this.width < this.getMinimumWidth() 
	    ? this.getMinimumWidth() : this.width;

	var lineSize = parseInt(this.getFont()) + this.config.lineSpacing;
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
	    + 2 * lineSize
	    + ( 2 * this.config.padding );
	
	this.prepared = true;
    },

    markUnprepared: function() {
	this.prepared = false;	
	this.fireEvent("changed");
    },

    add: function add(child) {}, // FIXME: short-circuit CompositeShape


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
	sheet.useCrispLines = this.config.useCrispLines;
	sheet.fillStyle     = this.config.backgroundColor;
	sheet.strokeStyle   = this.config.lineColor;
	sheet.lineWidth     = this.config.lineWidth;

	var lineSize = parseInt(this.getFont()) + this.config.lineSpacing

	// className compartment
	var classCompHeight = ( this.config.padding
	                        + lineSize * 2
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
	sheet.useCrispLines  = this.getUseCrispLines();
	sheet.fillStyle      = this.getFontColor();

	// stereotype
	sheet.font = this.getFontForClassName();

	sheet.textAlign = "center";

	if( this.getStereotype() ) {
	    sheet.fillText( "<<" + this.getStereotype() + ">>",
			    left + ( this.getWidth()/2),
			    top  + ( this.config.padding + 
				     parseInt(this.getFont()) ));
	}
	// className
	sheet.fillText( this.getName(),
			left + ( this.getWidth()/2 ), 
			top  + ( this.config.padding + 
				 parseInt(this.getFont())
				 + ( this.getStereotype() ? lineSize : 0 ) ) );
	
	// attributes
	sheet.textAlign = "left";
	sheet.font = this.getFont();
	for( var i=0; i<this.attributes.length; i++ ) {
	    sheet.strokeStyle    = this.getFontColor();
	    sheet.textDecoration = this.attributes[i].isStatic() ?
		this.config.decorationStatic : this.config.decoration;
	    sheet.fillText( this.attributes[i].toString(),
			    left + this.config.padding,
			    top + classCompHeight + ( lineSize * (i+1) ) );
	}

	// operations
	for( var i=0; i<this.operations.length; i++ ) {
	    sheet.font = this.getFontForOperationName( this.operations[i] );
	    sheet.strokeStyle    = this.getFontColor();
	    sheet.textDecoration = this.operations[i].isStatic() ?
		this.config.decorationStatic : this.config.decoration;
	    sheet.fillText( this.operations[i].toString(),
			   left + this.config.padding,
			   top + classCompHeight 
			   + attrCompHeight + (lineSize*(i+1)) );
	}
    },
    
    getFontForClassName : function() {
        return this.getIsAbstract() 
            ? this.config.fontAbstract
            : this.getFont();
    },
    
    getFontForOperationName : function(operation) {
        return operation.isAbstract() 
            ? this.config.fontAbstract
            : this.getFont();
    },

    asConstruct: function asConstruct () {
	var construct = this._super();
	delete construct.modifiers.geo;
	delete construct.modifiers[this.getFontColor()];

	if( this.getMinimumWidth() ) {
	    construct.modifiers['minimumSize'] = this.getMinimumWidth();
	}
	if( this.getSupers() ) {
	    var supers = [];
	    this.getSupers().iterate(function(zuper) {
		supers.push(zuper.getName());
	    });
	    construct.supers = supers;
	}
	if( this.getStereotype() ) {
	    construct.modifiers.stereotype = '"' + this.getStereotype() + '"';
	}
	if( this.getIsAbstract() ) {
	    construct.modifiers['abstract'] = null;
	}
	this.attributes.iterate(function(attribute) {
	    construct.children.push(attribute.asConstruct());
	});
	this.operations.iterate(function(operation) {
	    construct.children.push(operation.asConstruct());
	});
	
	return construct;
    }
} );
    
UmlCanvas.Class.from = function( construct, diagram ) {
  var props = {};

  // NAME
  props.name = construct.name;

  // MINIMUM WIDTH
  var minimumWidth = construct.modifiers.get( "minimumWidth" );
  if( minimumWidth ) {
    props.minimumWidth = parseInt(minimumWidth.value.value);
  }

  // STEREOTYPE
  var stereotype = construct.modifiers.get("stereotype" );
  if( stereotype && stereotype.value ) {
    props.stereotype = stereotype.value.value;
  }

  props['isAbstract'] = UmlCanvas.Common.extractAbstract(construct);

  var elem = new UmlCanvas.Class( props );

  var errors = [];
  var warnings = [];

  // SUPERCLASS
  if( construct.supers && construct.supers.length > 0 ) {
    construct.supers.iterate(function(superConstruct) {
      var zuper = diagram.getDiagramClass(superConstruct.constructName);
      if( zuper ) {
        elem.addSuper(zuper);
        var relation;
        if( zuper instanceof UmlCanvas.Interface ) {
          relation = new UmlCanvas.Realization( {from: zuper, to: elem} );
        } else {
          relation = new UmlCanvas.Inheritance( {from: zuper, to: elem} );
        }
        diagram.addRelation(relation);
      } else {
        warnings.push( "unknown superclass: " + superConstruct.constructName +
          ", referenced by " + construct.name );
      }
    });
  }

  if( errors.length > 0 ) {
    return { errors: errors, warnings: warnings };
  } else {
    elem.warnings = warnings.length > 0 ? warnings : null;
    return elem;
  }
};

UmlCanvas.Class.MANIFEST = {
  name         : "class",
  properties   : [ "stereotype", "isAbstract", "supers",
  "font", "fontColor", "minimumWidth" ],
  propertyPath : [ Canvas2D.CompositeShape, Canvas2D.Rectangle ],
  libraries    : [ "UmlCanvas", "Class Diagram", "Element" ]
}

Canvas2D.registerShape(UmlCanvas.Class);
