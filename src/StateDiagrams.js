UmlCanvas.State = Canvas2D.Rectangle.extend( {
  preprocess: function preprocess(props) {
    props.label = props.name;
    return props;
  },

  // UGLY HACK 
  // to override CompositeShape implementation and have more or less default 
  // Shape behavior again
  getHeight: function() { return this.getProperty("height") },
  getWidth : function() { return this.getProperty("width") }
} );

UmlCanvas.State.from = function( construct, diagram ) {
  var props = {};

  // name
  props.name = construct.name;

  // width
  var width = construct.modifiers.get("width");
  if( width && width.value ) {
    props["width"]   = width.value.value;
  }

  // height
  var height = construct.modifiers.get("height");
  if( height && height.value ) {
    props["height"]   = height.value.value;
  }

  // geo
  var geo = construct.modifiers.get("geo");
  if( geo && geo.value ) {
    props["width"]   = parseInt(geo.value.value.split("x")[0]);
    props["height"]  = parseInt(geo.value.value.split("x")[1]);
  }

  return new UmlCanvas.State( props );
}

UmlCanvas.State.MANIFEST = {
  name         : "state",
  propertyPath : [ Canvas2D.CompositeShape, Canvas2D.Rectangle ],
  libraries    : [ "UmlCanvas", "State Diagram", "Element" ]
}

Canvas2D.registerShape(UmlCanvas.State);

/////////////////////////////////////////////////////////////////////////////

UmlCanvas.Transition = Canvas2D.Connector.extend( {
  preprocess: function(props) {
    props.end = UmlCanvas.ConnectorHeads.Arrow;
    props['routing'] = props['routing'] || "horizontal";
    return props;
  }
} );

UmlCanvas.Transition.from = function(construct, diagram) {
  var props = [];

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

  props['from'] = diagram.getDiagramClass(construct.name.split("-")[0]);
  props['to']   = diagram.getDiagramClass(construct.name.split("-")[1]);

  var errors = [];
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
    return new UmlCanvas.Transition( props );
  }
}

UmlCanvas.Transition.MANIFEST = {
  name         : "transition",
  propertyPath : [ Canvas2D.Connector ],
  libraries    : [ "UmlCanvas", "Class Diagram", "Relationship" ]
}

Canvas2D.registerShape(UmlCanvas.Transition);
