var UmlCanvas = {};

UmlCanvas.Model = Class.create( Canvas2D.Canvas, {
    addDiagram: function(diagram) {
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
