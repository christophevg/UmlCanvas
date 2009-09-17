UmlCanvas.Dependency = Canvas2D.Connector.extend( {
    preprocess: function(props) {
	props.end = UmlCanvas.ConnectorHeads.Arrow;
	props.lineStyle = "dashed";
	props['routing'] = props['routing'] || "horizontal";
	return props;
    },

    asConstruct: function() {
	var construct = this._super();
	// TODO
	return construct;
    }
});

UmlCanvas.Dependency.from = function(construct, diagram) {
    var client, supplier, props;
    if( construct.children[0].type == "client" ) {
	client   = construct.children[0];
	supplier = construct.children[1];
    } else {
	client   = construct.children[1];
	supplier = construct.children[0];
    }
    var treeStyle = "horizontal";
    if( construct.annotation ) {
	if( construct.annotation.data == "vertical" ) {
	    treeStyle = "vertical";
	}
    }
   
    var src = diagram.getDiagramClass(client.supers[0].constructName);
    var dst = diagram.getDiagramClass(supplier.supers[0].constructName);

    props = { name: construct.name, style: treeStyle, from: src, to: dst };

    elem = new UmlCanvas.Dependency( props );
    return diagram.addRelation(elem);
};

UmlCanvas.Dependency.MANIFEST = {
    name : "dependency",
    properties : [ "client", "supplier" ],
    propertyPath : [ Canvas2D.Connector ],
    libraries : [ "UmlCanvas" ]
}
    
Canvas2D.registerShape(UmlCanvas.Dependency);
