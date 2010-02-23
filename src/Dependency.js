UmlCanvas.Dependency = Canvas2D.Connector.extend( {
  preprocess: function(props) {
    props.end = UmlCanvas.ConnectorHeads.Arrow;
    props.lineStyle = "dashed";
    props['routing'] = props['routing'] || "horizontal";

    this.srcName = props.sname;
    this.dstName = props.dname;

    props['centerLabel'] = props.name.substring(0,1) == "_" ? "" : props.name;

    return props;
  },

  asConstruct: function() {
    var construct = this._super();
    construct.modifiers = null;
    construct.children.push( {
      supers: [ this.from.getName() ], children: [], 
      type: "client", name: this.srcName } );
    construct.children.push( {
      supers: [ this.to.getName() ], children: [], 
      type: "supplier", name: this.dstName } );
    return construct;
  }
});

UmlCanvas.Dependency.from = function(construct, diagram) {
  var props = { name: construct.name };
  var client, supplier;
  
  if( construct.children && construct.children.length > 0 &&
      construct.children[0].type == "client" ) 
  {
    client   = construct.children[0];
    supplier = construct.children[1];
  } else {
    client   = construct.children[1];
    supplier = construct.children[0];
  }
  
  errors = [];
  
  if( !client ) {
    errors.push( "missing dependency client" );
  }

  if( !supplier ) {
    errors.push( "missing dependency supplier" );
  }
  
  if( errors.length > 0 ) {
    return { errors: errors };
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

  if( !props['from'] ) {
    errors.push( "Unknown FROM property " + client.supers[0].constructName + 
                 "  on " + construct.name );
  }

  if( !props['to'] ) {
    errors.push( "Unknown TO property " + supplier.supers[0].constructName + 
                 "  on " + construct.name );    
  }
  
  if( errors.length > 0 ) {
    return { errors: errors };
  } else {
    return new UmlCanvas.Dependency( props );
  }
};

UmlCanvas.Dependency.MANIFEST = {
  name : "dependency",
  properties : [ "client", "supplier" ],
  propertyPath : [ Canvas2D.Connector ],
  libraries : [ "UmlCanvas" ]
}

Canvas2D.registerShape(UmlCanvas.Dependency);
