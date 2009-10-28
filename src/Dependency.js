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
  var props = { name: construct.name };
  var client, supplier;
  
  if( construct.children[0].type == "client" ) {
    client   = construct.children[0];
    supplier = construct.children[1];
  } else {
    client   = construct.children[1];
    supplier = construct.children[0];
  }

  props['style'] = "horizontal";
  if( construct.annotation ) {
    if( construct.annotation.data == "vertical" ) {
      props['style'] = "vertical";
    } else if( construct.annotation.data.contains(":") &&
               construct.annotation.data.contains("-") ) 
    {
      var parts = construct.annotation.data.split(":");
      props["routing"] = "custom";
      props["routeStyle"] = parts[0];
      var ends = parts[1].split("-");
      props["routeBegin"] = ends[0];
      props["routeEnd"]   = ends[1];
    }
  }

  props['sname'] = client.name;
  props['dname'] = supplier.name;

  props['from'] = diagram.getDiagramClass(client.supers[0].constructName);
  props['to'] = diagram.getDiagramClass(supplier.supers[0].constructName);

  return new UmlCanvas.Dependency( props );
};

  UmlCanvas.Dependency.MANIFEST = {
    name : "dependency",
    properties : [ "client", "supplier" ],
    propertyPath : [ Canvas2D.Connector ],
    libraries : [ "UmlCanvas" ]
  }

  Canvas2D.registerShape(UmlCanvas.Dependency);
