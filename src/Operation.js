UmlCanvas.Operation = Class.create( {
    initialize: function( operation ) {
	this.visibility = operation.visibility;
	this.ztatic     = operation.isStatic;
	this.name       = operation.name;
	this.returnType = operation.returnType;
	this.parameters = [];
	if( operation.arguments ) {
	    for(var p=0; p<operation.arguments.length; p++ ) {
		this.addParameter(operation.arguments[p]);
	    }
	}
	this.abztract   = operation.isAbstract;
    },

    getName:       function() { return this.name;       },
    getReturnType: function() { return this.returnType; },
    getVisibility: function() { return this.visibility; },
    isStatic:      function() { return this.ztatic;     },
    isAbstract:    function() { return this.abztract;   },

    addParameter: function(parameter) {
	this.parameters.push( new UmlCanvas.Parameter(parameter) );
    },

    toString: function() {
	var params = [];
	this.parameters.each(function(param) {
	    params.push( param.type.toString() );
	});
	return UmlCanvas.Common.determineVisibility(this.visibility)
	    + this.name + "(" + params.join( ", " ) + ")"
	    + (this.returnType ? " : " + this.returnType.toString() : "");
    },

    asConstruct: function() {
	var parameters = [];
	this.parameters.each(function(parameter) {
	    parameters.push(parameter.asConstruct());
	});
	var modifiers = { visibility: this.getVisibility() };
	if( this.isStatic() ) { modifiers.isStatic = true; }
	return { annotations : [],
		 type        : "Operation",
		 name        : this.getName(),
		 supers      : [ this.getReturnType() ],
		 modifiers   : modifiers,
		 children    : parameters
	       };
    }
} );

UmlCanvas.Operation.getNames = function() {
    return ["operation", "method"];
}

UmlCanvas.Operation.from = function(construct, clazz) {
    var props =  { name: construct.name }; 
    if( construct.zuper ) { 
	props.returnType = construct.zuper.toString(); 
    }
    var visibility = UmlCanvas.Common.extractVisibility(construct);
    if( visibility ) {
	props['visibility'] = visibility;
    }
    props['isStatic'] = UmlCanvas.Common.extractStatic(construct);
    props['isAbstract'] = UmlCanvas.Common.extractAbstract(construct);

    return clazz.addOperation( props );
};

Canvas2D.ADLVisitor.registerConstruct(UmlCanvas.Operation);
