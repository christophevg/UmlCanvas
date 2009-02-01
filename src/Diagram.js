UmlCanvas.Diagram = Class.create( Canvas2D.Sheet, {
    addClass: function(clazz) {
	return this.add(clazz);
    },

    getClass: function(name) {
	return this.shapesMap[name];
    },

    addRelation: function(relation) {
	return this.add(relation);
    },

    toADL: function() {
	var s = "";
	s += "Diagram "  + this.name;
	s += " +" + this.style + " {\n";
	this.shapes.each(function(shape) { 
	    var t = shape.toADL("  ");
	    if( t ) { s +=  t + "\n"; }
	} );
	s += "}";
	return s;
    }
} );


UmlCanvas.Diagram.getNames = function() {
    return [ "diagram" ];
}

UmlCanvas.Diagram.from = function(construct, model) {
    var style = "static";
    var styleModifier = construct.modifiers.get( "style" );
    if( styleModifier ) {
	style = styleModifier.value.value.toLowerCase();
    }
    
    construct.modifiers.each(function(pair) {
	if( pair.key.toLowerCase() == "static" 
	    || pair.key.toLowerCase() == "dynamic" ) {
	    style = pair.key.toLowerCase();
	}
    });

    var diagram = new UmlCanvas.Diagram({ name: construct.name, style: style });
    model.addDiagram(diagram);
    return diagram;
};

Canvas2D.ADLVisitor.registerConstruct(UmlCanvas.Diagram);
