UmlCanvas.Dependency = Canvas2D.Connector.extend( {
  preprocess: function(props) {
    props.end = UmlCanvas.ConnectorHeads.Arrow;
    props.lineStyle = "dashed";
    props['routing'] = props['routing'] || "horizontal";

    this.srcName = props.sname;
    this.dstName = props.dname;

    if( props.name ) {
      props['centerLabel'] = 
        ( props.stereotype ? "<<" + props.stereotype + ">> " : "" ) 
        + ( props.name.substring(0,1) == "_" ? "" : props.name );
    }

    return props;
  },

  asConstruct: function() {
    var construct = this._super();
    construct.modifiers = [];
    
    // add simple routing annotation if not default and not custom
    if( this.getRouting() != "horizontal" && this.getRouting() != "custom" ) {
      construct.annotation.data = this.getRouting();
    }
    
    if( this.getStereotype() ) {
      construct.modifiers["stereotype"] = '"' + this.getStereotype() + '"';
    }
    
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

  props['routing'] = "horizontal";
  if( construct.annotation ) {
    if( construct.annotation.data.contains(":") &&
        construct.annotation.data.contains("-") ) 
    {
      var parts = construct.annotation.data.split(":");
      props["routing"] = "custom";
      props["routeStyle"] = parts[0];
      var ends = parts[1].split("-");
      props["routeBegin"] = ends[0];
      props["routeEnd"]   = ends[1];
    } else {
      props['routing'] = construct.annotation.data;
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
  
  // STEREOTYPE
  var stereotype = construct.modifiers.get("stereotype" );
  if( stereotype && stereotype.value ) {
    props.stereotype = stereotype.value.value;
  }
  
  if( errors.length > 0 ) {
    return { errors: errors };
  } else {
    return new UmlCanvas.Dependency( props );
  }
};

UmlCanvas.Dependency.MANIFEST = {
  name : "dependency",
  properties : [ "client", "supplier", "stereotype" ],
  propertyPath : [ Canvas2D.Connector ],
  libraries : [ "UmlCanvas", "Class Diagram", "Relationship" ]
}

Canvas2D.registerShape(UmlCanvas.Dependency);
