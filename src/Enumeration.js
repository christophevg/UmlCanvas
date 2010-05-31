UmlCanvas.Enumeration = UmlCanvas.Class.extend( {
  preprocess: function( props ) {
    props = this._super(props);

    if( props['stereotype'] ) {
      props['stereotype'] = "enumeration " + props['stereotype'];
    } else {
      props['stereotype'] = "enumeration";
    }
    props.isAbstract = true;
    return props;
  },

  addOperation: function(operation) {
    return null;
  },

  getFontForClassName : function() {
    return this.getFont();
  },

  asConstruct: function() {
    var construct = this._super();
    delete construct.modifiers.isAbstract;
    delete construct.modifiers.stereotype;
    return construct;
  }
} );

// TODO: collapse with Class.from
UmlCanvas.Enumeration.from = function( construct, diagram ) {
  var props = {};

  // NAME
  props.name = construct.name;

  // MINIMUM WIDTH
  var minimumWidth = construct.modifiers.get( "minimumWidth" );
  if( minimumWidth ) {
    props.minimumWidth = parseInt(minimumWidth.value.value);
  }

  // STEREOTYPE
  var stereotype = construct.modifiers.get("stereotype" );
  if( stereotype ) {
    props.stereotype = stereotype.value.value;
  }

  var elem = new UmlCanvas.Enumeration( props );

  // SUPERCLASS
  if( construct.supers && construct.supers.length > 0 ) {
    construct.supers.iterate(function(superConstruct) {
      var zuper = diagram.getDiagramClass(superConstruct.constructName);
      if( zuper ) {
        elem.addSuper(zuper);
        var relation;
        if( zuper instanceof UmlCanvas.Interface ) {
          relation = new UmlCanvas.Realization( {from: zuper, to: elem} );
        } else {
          relation = new UmlCanvas.Inheritance( {from: zuper, to: elem} );
        }
        diagram.addRelation(relation);
      } else {
        warnings.push( "unknown superclass: " + superConstruct.constructName +
        ", referenced by " + construct.name );
      }
    });
  }

  return elem;
};

UmlCanvas.Enumeration.MANIFEST = {
  name         : "enumeration",
  propertyPath : [ Canvas2D.CompositeShape, Canvas2D.Rectangle, UmlCanvas.Class ],
  libraries    : [ "UmlCanvas", "Class Diagram", "Element" ]
}

Canvas2D.registerShape(UmlCanvas.Enumeration);
