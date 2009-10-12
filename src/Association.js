UmlCanvas.Association = Canvas2D.Connector.extend( {
  preprocess: function(props) {
    props = this._super(props);

    this.srcName = props.sname;
    this.dstName = props.dname;

    if( props.kind && props.kind == "aggregation" ) {
      props.begin = UmlCanvas.ConnectorHeads.Diamond;	    
    } else if( props.kind && props.kind == "composition" ) {
      props.begin = UmlCanvas.ConnectorHeads.FullDiamond;	    
    } else if( props.navigability && ( props.navigability == "bi" || 
                                       props.navigability == "source" ) )
    {
      props.begin = UmlCanvas.ConnectorHeads.Arrow;
    }

    if( props.navigability && ( props.navigability == "bi" || 
                                props.navigability == "destination" ) )
    {
      props.end = UmlCanvas.ConnectorHeads.Arrow;
    }
    props['routing'] = props['routing'] || "horizontal";
    return props;
  },    

  _determineChildModifiers: function _determineChildModifiers(end) {
    var modifiers = [];
    var head = end ? this.end : this.begin;
    if( head == UmlCanvas.ConnectorHeads.Diamond ) {
      modifiers['shared'] = null;
    } else if( head == UmlCanvas.ConnectorHeads.FullDiamond ) {
      modifiers['composite'] = null;
    } else if( head == UmlCanvas.ConnectorHeads.Arrow ) {
      modifiers['navigable'] = null;
    }
    return modifiers;
  },

  asConstruct: function() {
    var construct = this._super();
    construct.modifiers = null;

    construct.children.push( 
      { annotations: [], 
        modifiers: this._determineChildModifiers(),
        supers: [ this.from.getName() ], children: [], 
        type: "role", name: this.srcName 
      }
    );
    construct.children.push( 
      { annotations: [], 
        modifiers: this._determineChildModifiers(true),
        supers: [ this.to.getName() ], children: [], 
        type: "role", name: this.dstName 
      } 
    );
    return construct;
  }
});

UmlCanvas.Association.getNames = function() {
  return ["association", "relation"];
}

UmlCanvas.Association.from = function(construct, diagram) {
  var props = { name: construct.name };

  var child0 = construct.children[0];
  var child1 = construct.children[1];

  props["kind"]   = "association";

  var from, to;

  if( child1.modifiers.get( "composition" ) || 
      child1.modifiers.get( "composite" ) ||
      child1.modifiers.get( "aggregation" ) || 
      child1.modifiers.get( "shared" ) ) 
  {
    from = child1;    to   = child0;
  } else {
    from = child0;    to   = child1;
  }
  
  if( from.modifiers.get( "composition" ) || 
      from.modifiers.get( "composite" ) ) 
  {
    props["kind"] = "composition";
  }

  if( from.modifiers.get( "aggregation" ) ||
      from.modifiers.get( "shared" ) ) 
  {
    props["kind"] = "aggregation";
  }

  if( from.modifiers.get( "navigable" ) && to.modifiers.get( "navigable" )) {
    props["navigability"] = "bi";
  } else if( from.modifiers.get( "navigable" ) ) {
    props["navigability"] = "source";
  } else if( to.modifiers.get( "navigable" ) ) {
    props["navigability"] = "destination";
  }

  props["style"] = "vertical";
  if( construct.annotation ) {
    if( construct.annotation.data == "horizontal" ) {
      props["style"] = "horizontal";
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

  props["sname"] = from.name;
  props["dname"] = to.name;

  props["from"] = diagram.getDiagramClass(from.supers[0].constructName);
  props["to"]   = diagram.getDiagramClass(to.supers[0].constructName);

  return new UmlCanvas.Association( props );
};

UmlCanvas.Association.MANIFEST = {
  name         : "association",
  properties   : [ "kind", "navigability" ],
  propertyPath : [ Canvas2D.Connector ],
  libraries    : [ "UmlCanvas" ]
}

Canvas2D.registerShape(UmlCanvas.Association);
