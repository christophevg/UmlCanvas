UmlCanvas.Dependency = Class.create( Canvas2D.Connector, {
    client : null,
    supplier : null,
    initialize: function( $super, client, supplier, props ) {
	props = props || {};
	props.end = UmlCanvas.ConnectorHeads.Arrow;
	props.lineStyle = "dashed";
	props['style'] = props['style'] || "horizontal";
	this.client = client;
	this.supplier = supplier;
	$super( client.element, supplier.element, props );
    },
    toADL: function(prefix) {
	var s = prefix + "[@" + this.props.style + "]\n";
	s += prefix + "dependency " + this.props.name + " {\n";
	s += prefix + "  client " + this.client.name + 
	    " : " + this.client.element.props.name + ";\n";
	s += prefix + "  supplier " + this.supplier.name + 
	    " : " + this.supplier.element.props.name + ";\n";
	s += prefix + "}";
	return s;
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
    props = { name: construct.name, style: treeStyle }
    
    var src = diagram.getClass(client.zuper.constructName);
    var dst = diagram.getClass(supplier.zuper.constructName);

    elem = new UmlCanvas.Dependency( { name: client.name, element: src }, 
				     { name: supplier.name, element: dst }, 
				     props );
    return diagram.addRelation(elem);
};
    
Canvas2D.ADLVisitor.registerConstruct(UmlCanvas.Dependency);
