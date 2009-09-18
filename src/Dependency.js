UmlCanvas.Dependency = Canvas2D.Connector.extend( {
    preprocess: function(props) {
	props.end = UmlCanvas.ConnectorHeads.Arrow;
	props.lineStyle = "dashed";
	props['routing'] = props['routing'] || "horizontal";

	this.srcName = props.sname;
	this.dstName = props.dname;

	return props;
    },

    asConstruct: function() {
	var construct = this._super();
	construct.modifiers = null;
	construct.children.push( { annotations: [], 
				   supers: [ this.from.getName() ], children: [], 
				   type: "client", name: this.srcName } );
	construct.children.push( { annotations: [], 
				   supers: [ this.to.getName() ], children: [], 
				   type: "supplier", name: this.dstName } );
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
   
    var srcName = client.name;
    var dstName = supplier.name;

    var src = diagram.getDiagramClass(client.supers[0].constructName);
    var dst = diagram.getDiagramClass(supplier.supers[0].constructName);

    props = { name: construct.name, style: treeStyle, from: src, to: dst, 
	      sname: srcName, dname: dstName };

    return new UmlCanvas.Dependency( props );
};

UmlCanvas.Dependency.MANIFEST = {
    name : "dependency",
    properties : [ "client", "supplier" ],
    propertyPath : [ Canvas2D.Connector ],
    libraries : [ "UmlCanvas" ]
}
    
Canvas2D.registerShape(UmlCanvas.Dependency);
