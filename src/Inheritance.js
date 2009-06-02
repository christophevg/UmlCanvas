UmlCanvas.Inheritance = Class.create( Canvas2D.Connector, {
    preprocess: function( props ) {
	props.begin = UmlCanvas.ConnectorHeads.Triangle;
	props.routing = props.routing || "vertical";
	return props;
    },
    initialBranchLength: function(top, bottom) {
	return 25;
    }
});

UmlCanvas.Inheritance.MANIFEST = {
    name         : "inheritance",
    propertyPath : [ Canvas2D.Connector ],
    libraries    : [ "UmlCanvas" ]
}

Canvas2D.registerShape( UmlCanvas.Inheritance );
