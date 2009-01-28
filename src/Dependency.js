UmlCanvas.Dependency = Class.create( Canvas2D.Connector, {
    initialize: function( $super, from, to, props ) {
	props = props || {};
	props.end = UmlCanvas.ConnectorHeads.Arrow;
	props.lineStyle = "dashed";
	props['style'] = props['style'] || "horizontal";
	$super( from, to, props );
    }
});

UmlCanvas.Dependency.getNames = function() {
    return ["dependency"];
}

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
    props = { style: treeStyle }
    
    var src = diagram.getClass(client.zuper.constructName);
    var dst = diagram.getClass(supplier.zuper.constructName);

    elem = new UmlCanvas.Dependency( src, dst, props );
    return diagram.addRelation(elem);
};
    
Canvas2D.ADLVisitor.registerConstruct(UmlCanvas.Dependency);
