UmlCanvas.Note = Canvas2D.Rectangle.extend( {
    
    prepare: function(sheet) {
    	if( this.prepared ) { return; }
    	this.width = this.getBoxWidth(sheet);
    	this.height = this.getBoxHeight(sheet);
    	this.prepared = true;
    },
    
    getText: function getText() {
    	if (!this.text) {
    	    return this.config.text;
    	}
    	return this.text;
    },
    
    getWidth: function getWidth() {
	if (!this.width) {
    	    return this.config.width;
    	}
    	return this.width;
    },
    
    getHeight: function getHeight() {
	if (!this.height) {
    	    return this.config.height;
    	}
    	return this.height;
    },

    postInitialize: function(props) {
	// keep short-hand local reference
	this.config = UmlCanvas.Note.Defaults;
    },

    draw: function(sheet, left, top) {
	this.prepare(sheet);
	this.renderTextBox(sheet, left, top);
	this.renderText(sheet, left, top);
    },
    
    renderTextBox: function renderTextBox(sheet, left, top) {
	sheet.fillStyle     = this.config.backgroundColor;
	sheet.strokeStyle   = this.config.lineColor;
	sheet.lineWidth     = this.config.lineWidth;
	sheet.useCrispLines  = this.config.useCrispLines;
	
	sheet.fillStrokeRect( left, top, 
		this.getWidth(), this.getHeight() );
    },
    
    renderText: function renderText(sheet, left, top) {
	sheet.useCrispLines  = false;
	sheet.font           = this.config.font;
	sheet.fillStyle      = this.config.fontColor;
	sheet.textAlign      = "left";
	sheet.lineStyle      = "solid";

	var lines = this.getLines();
	for ( var i=1, len=lines.length; i<=len; ++i ){
	    top += this.config.padding;
	    sheet.fillText( lines[i-1],
		    	    left + this.config.padding,
		            top  + ( parseInt(this.config.font) * i )
			  );
	}
    },
    
    getBoxWidth: function getBoxWidth(sheet) {
	var boxWidth = this.getWidth() + (this.config.padding * 2);
	this.getLines().iterate(function(line) {
	    var width = sheet.measureText(line) + (this.config.padding * 2);
	    if (width > boxWidth) {
		boxWidth = width;
	    }
	}.scope(this) );
	return boxWidth;
    },
    
    getBoxHeight: function getBoxHeight(sheet) {
	var boxHeight = this.getHeight() + (this.config.padding * 2);
	var textHeight = this.getLines().length * 
		(parseInt(this.config.font) + this.config.padding)
		+ this.config.padding;
	return (boxHeight > textHeight) ? boxHeight : textHeight;
    },
    
    getLines: function getLines() {
	return this.getText().split("\\n");
    },
    
    asConstruct: function() {
	var construct = this._super();

	if( this.getText() ) {
	    construct.modifiers['text'] = this.getText();
	}
	if( this.getWidth() ) {
	    construct.modifiers['width'] = this.getWidth();
	}
	if( this.getHeight() ) {
	    construct.modifiers['height'] = this.getHeight();
	}
	
	return construct;
    }
} );
    
UmlCanvas.Note.from = function( construct, diagram ) {
    var props = {};

    props.name = construct.name;
    
    props.text = construct.modifiers.get("text").value.value;
    
    var width = construct.modifiers.get( "width" );
    if( width ) {
        props.width = parseInt(width.value.value);
    }

    var height = construct.modifiers.get("height" );
    if( height ) {
	props.height= height.value.value;
    }
    
    var elem = new UmlCanvas.Note( props );

    var linkedTo = construct.modifiers.get("linkedTo");
    if (linkedTo) {
	linkedTo.value.value.split(",").iterate(function(elementName) {
	    var element = diagram.getDiagramClass(elementName);
	    diagram.addRelation(new Canvas2D.Connector( {
		from      : elem,
		to        : element,
		routing   : "horizontal",
		lineStyle : "dashed"
	    } ));
	} );
    }

    return elem;
};
    
UmlCanvas.Note.MANIFEST = {
    name         : "note",
    properties   : [ "text", "width", "height", "linkedTo" ],
    propertyPath : [ Canvas2D.CompositeShape, Canvas2D.Rectangle ],
    libraries    : [ "UmlCanvas" ]
}

Canvas2D.registerShape(UmlCanvas.Note);