UmlCanvas.Attribute = Class.create( {
    initialize: function( attribute ) {
	this.visibility = attribute.visibility;
	this.name       = attribute.name;
	this.type       = attribute.type;
    },

    getName:       function() { return this.name;       },
    getType:       function() { return this.type;       },
    getVisibility: function() { return this.visibility; },

    toString: function() {
	return UmlCanvas.Common.determineVisibility(this.visibility)
	    + this.name + (this.type ? " : " + this.type.toString() : "");
    },

    asConstruct: function() {
	return { annotations : [],
		 type        : "Attribute",
		 name        : this.getName(),
		 supers      : [ this.getType() ],
		 modifiers   : { visibility: this.getVisibility() },
		 children    : []
	       };
    }
} );


UmlCanvas.Attribute.getNames = function() {
    return ["attribute", "property"];
}

UmlCanvas.Attribute.from = function(construct, clazz) {
    var props =  { name: construct.name, 
	           type: construct.zuper.toString() };
    var visibility = UmlCanvas.Common.extractVisibility(construct);
    if( visibility ) {
	props['visibility'] = visibility;
    }
    return clazz.addAttribute(props);
};

Canvas2D.ADLVisitor.registerConstruct(UmlCanvas.Attribute);

