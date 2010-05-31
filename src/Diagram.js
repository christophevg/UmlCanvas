UmlCanvas.Diagram = Canvas2D.Sheet.extend( {
    init: function(props) {
	this._super(props);
	this.on( "shapeSelected", this.handleElementSelected.scope(this) );
	this.on( "shapeChanged",  this.handleElementChanged.scope(this) );
    },

    handleElementSelected: function(element) {
	if( element instanceof UmlCanvas.Interface ) {
	    this.canvas.fireEvent( "interfaceSelected", element.props );
	} else if( element instanceof UmlCanvas.Class ) {
	    this.canvas.fireEvent( "classSelected", element.props );
	}
    },

    handleElementChanged: function(element) {
	if( element instanceof UmlCanvas.Interface ) {
	    this.canvas.fireEvent( "interfaceChanged", element.props );
	} else if( element instanceof UmlCanvas.Class ) {
	    this.canvas.fireEvent( "classChanged", element.props );
	}
    },
    
    addClass: function(clazz) {
	return this.add(clazz);
    },

    getDiagramClass: function(name) {
	return this.shapesMap[name.replace(/<.*$/,'')];
    },

    addRelation: function(relation) {
	return this.add(relation);
    },

    toADL: function() {
	var s = "";
	s += "Diagram "  + this.name;
	s += " +" + this.style + " {\n";
	this.positions.iterate(function(shape) {
	    var t = shape.toADL("  ");
	    if( t ) { s += t + "\n"; }
	} );
	s += "}";
	return s;
    },

    asConstruct: function() {
	var construct = this._super();

	this.shapes.iterate(function(shape) { 
	    construct.push(shape.asConstruct());
	} );

	return construct;
    }
} );

UmlCanvas.Diagram.from = function(construct, model) {
    var style = "static";
    var styleModifier = construct.modifiers.get( "style" );
    if( styleModifier ) {
	style = styleModifier.value.value.toLowerCase();
    }
    
    construct.modifiers.iterate(function(key, value) {
	if( key.toLowerCase() == "static" || key.toLowerCase() == "dynamic" ) {
	    style = key.toLowerCase();
	}
    });

    var diagram = new UmlCanvas.Diagram({ book: model, name: construct.name, style: style });
    model.addDiagram(diagram);
    return diagram;
};

UmlCanvas.Diagram.MANIFEST = {
    name         : "diagram",
    propertyPath : [ Canvas2D.Sheet ],
    libraries    : [ "UmlCanvas", "Diagram" ]
}

Canvas2D.registerShape(UmlCanvas.Diagram);
