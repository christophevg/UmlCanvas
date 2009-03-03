UmlCanvas.Parameter = Class.create( {
    name: null,
    type: null,

    initialize: function( props ) {
	this.name = props.name;
	this.type = props.type;
    },

    getName: function() { return this.name; },
    getType: function() { return this.type; },

    toString: function() {
	return this.name + " : " + this.type;
    },

    asConstruct: function() {
	return { annotations : [],
		 type        : "Argument",
		 name        : this.getName(),
		 supers      : [ this.getType() ],
		 modifiers   : {},
		 children    : []
	       };
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
