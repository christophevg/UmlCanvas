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
    
    props['beginLabel'] = props.sname == props.from.name ? "" 
      : UmlCanvas.Common.determineVisibility(props['srcVisibility']) 
        + props.sname;
    if( props['srcMultiplicity'] ) { 
      props['beginLabel'] += " [" + props['srcMultiplicity'] + "]";
    }
    props['endLabel']   = props.dname == props.to.name ? "" 
      : UmlCanvas.Common.determineVisibility(props['dstVisibility']) 
        + props.dname;
    if( props['dstMultiplicity'] ) {
      props['endLabel'] += " [" + props['dstMultiplicity'] + "]";
    }
    
    props['centerLabel'] = props.name.substring(0,1) == "_" ? "" : props.name;

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

    var multi = end ? this.dstMultiplicity : this.srcMultiplicity;
    if( multi ) {
      modifiers['multiplicity'] = '"' + multi + '"';
    }

    var visi = end ? this.dstVisibility : this.srcVisibility;
    if( visi ) {
      modifiers['visibility'] = '"' + visi + '"';
    }

    return modifiers;
  },

  asConstruct: function() {
    var construct = this._super();
    construct.modifiers = null;

    construct.children.push( 
      { modifiers: this._determineChildModifiers(),
        supers: [ this.from.getName() ], children: [], 
        type: "role", name: this.srcName
      }
    );
    construct.children.push( 
      { modifiers: this._determineChildModifiers(true),
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
  var child1, child2;
  
  var errors = [];
  if( construct.children && construct.children.length > 1 ) {
    child0 = construct.children[0];
    child1 = construct.children[1];
  } else {
    errors.push( "association " + construct.name + " needs two roles");
    return { errors: errors };
  }

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
    } else if( parts = 
        construct.annotation.data.match("([a-zA-Z]+):([nesw]+)-([nesw]+)" ) )
    {
      props["routing"] = "custom";
      props["routeStyle"] = parts[1];
      props["routeBegin"] = parts[2];
      props["routeEnd"]   = parts[3];
    }
  }

  props["sname"] = from.name;
  props["dname"] = to.name;

  if( from.modifiers.get('multiplicity') && 
      from.modifiers.get('multiplicity').value ) 
  {
    props['srcMultiplicity'] = from.modifiers.get('multiplicity').value.value;
  }
  if( to.modifiers.get('multiplicity' ) &&
      to.modifiers.get('multiplicity').value ) 
  {
    props['dstMultiplicity'] = to.modifiers.get('multiplicity').value.value;
  }
  
  var visibility = UmlCanvas.Common.extractVisibility(from);
  if( visibility ) { props['srcVisibility'] = visibility; }
  
  visibility = UmlCanvas.Common.extractVisibility(to);
  if( visibility ) { props['dstVisibility'] = visibility; }
  
  props["from"] = diagram.getDiagramClass(from.supers[0].constructName);
  props["to"]   = diagram.getDiagramClass(to.supers[0].constructName);

  if( !props['from'] ) {
    errors.push( "Unknown FROM property " + from.supers[0].constructName + 
                 "  on " + construct.name );
  }

  if( !props['to'] ) {
    errors.push( "Unknown TO property " + to.supers[0].constructName + 
                 "  on " + construct.name );    
  }
  
  if( errors.length > 0 ) {
    return { errors: errors };
  } else {
    return new UmlCanvas.Association( props );
  }
};

UmlCanvas.Association.MANIFEST = {
  name         : "association",
  properties   : [ "kind", "navigability", 
                   "srcMultiplicity", "dstMultiplicity",
                   "srcVisibility", "dstVisibility" ],
  propertyPath : [ Canvas2D.Connector ],
  libraries    : [ "UmlCanvas" ]
}

Canvas2D.registerShape(UmlCanvas.Association);
