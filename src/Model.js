var UmlCanvas = {};

UmlCanvas.diagrams = {};

UmlCanvas.getModel = function(id) {
    return Canvas2D.getCanvas(id);
};

UmlCanvas.getDiagram = function(diagram) {
    return UmlCanvas.diagrams[diagram];
};

UmlCanvas.Model = Class.create( Canvas2D.Canvas, {
    addDiagram: function(diagram) {
	UmlCanvas.diagrams[diagram.name] = diagram;
	return this.addSheet(diagram);
    }
} );

UmlCanvas.determineVisibility = function(visibility) {
    switch(visibility) {
    case "protected": return "#";
    case "private":   return "-";
    case "package":   return "~";
    }
    return "+";
}
