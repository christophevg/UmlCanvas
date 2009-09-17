UmlCanvas.Realization = Canvas2D.Connector.extend( {
    preprocess: function( props ) {
	props.begin = UmlCanvas.ConnectorHeads.Triangle;
	props.lineStyle = "dashed";
	props.routing = props.routing || "vertical";
	return props;
    },
    initialBranchLength: function(top, bottom) {
	return 25;
    }
});

UmlCanvas.Realization.MANIFEST = {
    name         : "realization",
    propertyPath : [ Canvas2D.Connector ],
    libraries    : [ "UmlCanvas" ]
}

Canvas2D.registerShape( UmlCanvas.Realization );
