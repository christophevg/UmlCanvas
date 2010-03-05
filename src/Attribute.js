UmlCanvas.Attribute = Class.extend( {
  init: function( attribute ) {
    this.visibility = attribute.visibility;
    this.ztatic     = attribute.isStatic;
    this.name       = attribute.name;
    this.type       = attribute.type;
    this.stereotype = attribute.stereotype;
    this.derived    = attribute.derived;
  },

  setParent: function setParent() {},

  getName:       function() { return this.name;       },
  getType:       function() { return this.type;       },
  getVisibility: function() { return this.visibility; },
  getStereotype: function() { return this.stereotype; },
  isStatic:      function() { return this.ztatic;     },
  isDerived:     function() { return this.derived;    },

  toString: function() {
    return ( this.getStereotype() ? "<<" + this.getStereotype() + ">> " : "" ) 
      + UmlCanvas.Common.determineVisibility(this.visibility)
      + ( this.isDerived() ? "/" : "" ) + this.name 
      + (this.type ? " : " + this.type.toString() : "");
  },

  asConstruct: function() {
    var modifiers = {};
    if( this.getVisibility() ) {
      modifiers[this.getVisibility()] = null;
    };

    if( this.isStatic() ) { modifiers["static"] = null; }

    if( this.getStereotype() ) {
      modifiers["stereotype"] = '"' + this.getStereotype() + '"';
    }

    if( this.isDerived() ) {
      modifiers["derived"] = null; // shorthand prefered
    }

    return {
      type        : "Attribute",
      name        : this.getName(),
      supers      : this.getType() ? [ this.getType() ] : [],
      modifiers   : modifiers,
      children    : []
    };
  }
} );

UmlCanvas.Attribute.from = function(construct, clazz) {
  var props =  { 
    name: construct.name, 
    type: construct.supers[0] ? construct.supers[0].toString() : null 
  };

  var visibility = UmlCanvas.Common.extractVisibility(construct);
  if( visibility ) {
    props['visibility'] = visibility;
  }

  props['isStatic'] = UmlCanvas.Common.extractStatic(construct);

  // STEREOTYPE
  var stereotype = construct.modifiers.get("stereotype" );
  if( stereotype && stereotype.value ) {
    props.stereotype = stereotype.value.value;
  }
  
  // DERIVED
  var derived = construct.modifiers.get("derived");
  if( derived && derived.value ) {
    props.derived = derived.value.value;
  } else if( derived ) {
    props.derived = true;
  }

  return clazz.addAttribute(props);
};

UmlCanvas.Attribute.MANIFEST = {
  name: "attribute",
  aliasses: [ "property", "literal" ]
}

Canvas2D.registerShape(UmlCanvas.Attribute);
