UmlCanvas.Attribute = Class.create( {
    visibility : null,
    name : null,
    type : null,
    initialize: function( attribute ) {
	this.visibility = attribute.visibility;
	this.name       = attribute.name;
	this.type       = attribute.type;
    },
    toString: function() {
	return UmlCanvas.determineVisibility(this.visibility)
	    + this.name + (this.type ? " : " + this.type.toString() : "");
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

