UmlCanvas.Operation = Class.create( {
    visibility : null,
    name       : null,
    parameters : [],
    returnType : null,

    initialize: function( operation ) {
	this.visibility = operation.visibility;
	this.name       = operation.name;
	this.returnType = operation.returnType;
	this.parameters = new Array();
	if( operation.parameters ) {
	    for(var p=0; p<operation.parameters.length; p++ ) {
		this.addParameter(operation.parameters[p]);
	    }
	}
    },

    addParameter: function(parameter) {
	this.parameters.push( parameter.type.toString() );
    },

    toString: function() {
	return UmlCanvas.determineVisibility(this.visibility)
	    + this.name + "(" + this.parameters.join( ", " ) + ")"
	    + (this.returnType ? " : " + this.returnType.toString() : "");
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
    return clazz.addOperation( props );
};

Canvas2D.ADLVisitor.registerConstruct(UmlCanvas.Operation);
