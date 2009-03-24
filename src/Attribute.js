UmlCanvas.Attribute = Class.create( {
    initialize: function( attribute ) {
	this.visibility = attribute.visibility;
	this.ztatic     = attribute.isStatic;
	this.name       = attribute.name;
	this.type       = attribute.type;
    },

    getName:       function() { return this.name;       },
    getType:       function() { return this.type;       },
    getVisibility: function() { return this.visibility; },
    isStatic:      function() { return this.ztatic;     },

    toString: function() {
	return UmlCanvas.Common.determineVisibility(this.visibility)
	    + this.name + (this.type ? " : " + this.type.toString() : "");
    },

    asConstruct: function() {
	var modifiers = { visibility: this.getVisibility() };
	if( this.isStatic() ) { modifiers.isStatic = true; }
	return { annotations : [],
		 type        : "Attribute",
		 name        : this.getName(),
		 supers      : [ this.getType() ],
		 modifiers   : modifiers,
		 children    : []
	       };
    }
} );

UmlCanvas.Attribute.getNames = function() {
    return ["attribute", "property"];
}

UmlCanvas.Attribute.from = function(construct, clazz) {
    var props =  { name: construct.name, 
	           type: construct.supers[0].toString() };
    var visibility = UmlCanvas.Common.extractVisibility(construct);
    if( visibility ) {
	props['visibility'] = visibility;
    }
    props['isStatic'] = UmlCanvas.Common.extractStatic(construct);

    return clazz.addAttribute(props);
};

Canvas2D.ADLVisitor.registerConstruct(UmlCanvas.Attribute);

