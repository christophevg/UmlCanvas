UmlCanvas.Interface = UmlCanvas.Class.extend( {
    preprocess: function( props ) {
	props = this._super(props);

	if( props['stereotype'] ) {
	    props['stereotype'] = "interface " + props['stereotype'];
	} else {
	    props['stereotype'] = "interface";
	}
	props.isAbstract = true;
	return props;
    },
    
    getFontForClassName : function() {
        return this.getFont();
    },
    
    getFontForOperationName : function(operation) {
        return this.getFont();
    },
    
    asConstruct: function() {
	var construct = this._super();
	delete construct.modifiers["abstract"];
	delete construct.modifiers.stereotype;
	return construct;
    }
} );

UmlCanvas.Interface.from = function( construct, diagram ) {
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
    if( stereotype ) {
	props.stereotype = stereotype.value.value;
    }

    var elem = new UmlCanvas.Interface( props );

    // SUPERCLASS
    if( construct.supers && construct.supers.length > 0 ) {
	construct.supers.iterate(function(superConstruct) {
	    var zuper = diagram.getDiagramClass(superConstruct.constructName);
	    elem.addSuper(zuper);
	    diagram.addRelation(new UmlCanvas.Inheritance({from:zuper, to: elem}));
	});
    }

    return elem;
};

UmlCanvas.Interface.MANIFEST = {
    name         : "interface",
    propertyPath : [ Canvas2D.CompositeShape, Canvas2D.Rectangle, UmlCanvas.Class ],
    libraries    : [ "UmlCanvas", "Class Diagram", "Element" ]
}

Canvas2D.registerShape(UmlCanvas.Interface);
