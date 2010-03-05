UmlCanvas.Operation = Class.extend( {
  init: function( operation ) {
    this.visibility = operation.visibility;
    this.ztatic     = operation.isStatic;
    this.name       = operation.name;
    this.returnType = operation.returnType;
    this.stereotype = operation.stereotype;
    this.parameters = [];
    if( operation.arguments ) {
      for(var p=0; p<operation.arguments.length; p++ ) {
        this.addParameter(operation.arguments[p]);
      }
    }
    this.abztract   = operation.isAbstract;
  },

  setParent: function setParent() {},

  getName:       function() { return this.name;       },
  getReturnType: function() { return this.returnType; },
  getVisibility: function() { return this.visibility; },
  isStatic:      function() { return this.ztatic;     },
  isAbstract:    function() { return this.abztract;   },
  getStereotype: function() { return this.stereotype; },

  addParameter: function(parameter) {
    this.parameters.push( new UmlCanvas.Parameter(parameter) );
  },

  toString: function() {
    var params = [];
    this.parameters.iterate(function(param) {
      if( param.type ) {
        params.push( param.type.toString() );
      }
    });
    return ( this.getStereotype() ? "<<" + this.getStereotype() + ">> " : "" ) 
      + UmlCanvas.Common.determineVisibility(this.visibility)
      + this.name + "(" + params.join( ", " ) + ")"
      + (this.returnType ? " : " + this.returnType.toString() : "");
  },

  asConstruct: function() {
    var parameters = [];
    this.parameters.iterate(function(parameter) {
      parameters.push(parameter.asConstruct());
    });
    var modifiers = {};
    if( this.getVisibility() ) {
      modifiers[this.getVisibility()] = null;
    };
    if( this.isAbstract() ) {
      modifiers['abstract'] = null;
    }
    if( this.isStatic() ) { modifiers["static"] = null; }

    if( this.getStereotype() ) {
      modifiers["stereotype"] = '"' + this.getStereotype() + '"';
    }    
    
    return {
      type        : "Operation",
      name        : this.getName(),
      supers      : this.getReturnType() ? [ this.getReturnType() ] : [],
      modifiers   : modifiers,
      children    : parameters
    };
  }
} );

UmlCanvas.Operation.from = function(construct, clazz) {
  var props =  { name: construct.name }; 
  if( construct.supers[0] ) {
    props.returnType = construct.supers[0].toString();
  }
  var visibility = UmlCanvas.Common.extractVisibility(construct);
  if( visibility ) {
    props['visibility'] = visibility;
  }
  props['isStatic'] = UmlCanvas.Common.extractStatic(construct);
  props['isAbstract'] = UmlCanvas.Common.extractAbstract(construct);

  // STEREOTYPE
  var stereotype = construct.modifiers.get("stereotype" );
  if( stereotype && stereotype.value ) {
    props.stereotype = stereotype.value.value;
  }

  return clazz.addOperation( props );
};

UmlCanvas.Operation.MANIFEST = {
  name     : "operation",
  aliasses : [ "method" ]
}

Canvas2D.registerShape(UmlCanvas.Operation);
