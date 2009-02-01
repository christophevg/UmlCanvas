UmlCanvas.Parameter = Class.create( {
    name: null,
    type: null,

    initialize: function( name, type ) {
	this.name = name;
	this.type = type;
    },

    toString: function() {
	return this.name + " : " + this.type;
    },

    toADL: function(prefix) {
	return prefix + "parameter " + this.name + " : " + this.type + ";";
    }
} );

UmlCanvas.Parameter.getNames = function() {
    return ["parameter", "argument"];
}

UmlCanvas.Parameter.from = function(construct, operation) {
    return operation.addParameter( new UmlCanvas.Parameter( construct.name, 
							    construct.zuper ) );

};

Canvas2D.ADLVisitor.registerConstruct(UmlCanvas.Parameter);
