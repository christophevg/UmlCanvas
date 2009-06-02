UmlCanvas.Diagram = Class.create( Canvas2D.Sheet, {
    initialize: function($super, props) {
	$super(props);
	this.on( "shapeSelected", this.handleElementSelected.bind(this) );
	this.on( "shapeChanged",  this.handleElementChanged.bind(this) );
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

    getClass: function(name) {
	return this.shapesMap[name];
    },

    addRelation: function(relation) {
	return this.add(relation);
    },

    asConstruct: function($super) {
	var construct = $super();

	this.shapes.each(function(shape) { 
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
    
    construct.modifiers.each(function(pair) {
	if( pair.key.toLowerCase() == "static" 
	    || pair.key.toLowerCase() == "dynamic" ) {
	    style = pair.key.toLowerCase();
	}
    });

    var diagram = new UmlCanvas.Diagram({ name: construct.name, style: style });
    model.addDiagram(diagram);
    return diagram;
};

UmlCanvas.Diagram.MANIFEST = {
    name         : "diagram",
    propertyPath : [ Canvas2D.Sheet ],
    libraries    : [ "UmlCanvas" ]
}

Canvas2D.registerShape(UmlCanvas.Diagram);
