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

UmlCanvas.Parameter.from = function(construct, operation) {
    return operation.addParameter( 
	new UmlCanvas.Parameter( { name: construct.name, 
				   type: construct.supers[0] } ) );
};

UmlCanvas.Parameter.MANIFEST = {
    name : "parameter",
    aliasses : [ "argument" ]
}

Canvas2D.registerShape(UmlCanvas.Parameter);
