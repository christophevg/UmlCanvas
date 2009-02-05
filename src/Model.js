var UmlCanvas = {};

UmlCanvas.diagrams = {};

UmlCanvas.getModel = function(id) {
    return Canvas2D.getCanvas(id);
};

UmlCanvas.getDiagram = function(diagram) {
    return UmlCanvas.diagrams[diagram];
};

UmlCanvas.eventHandlers = {};

UmlCanvas.on = function( event, handler ) {
    UmlCanvas.eventHandlers[event] = handler;
};

UmlCanvas.fireEvent = function( event, data ) {
    if( UmlCanvas.eventHandlers[event] ) {
	UmlCanvas.eventHandlers[event](data);
    }
};

UmlCanvas.Model = Class.create( Canvas2D.Canvas, {
    initialize: function($super, props) {
	$super(props);
	this.registerPlugin
	( { name: "UmlCanvas",
	    author: "<a href=\"http://christophe.vg\">Christophe VG</a>",
	    info: "Visit <a href=\"http://thesoftwarefactory.be/wiki/UmlCanvas\">http://thesoftwarefactory.be/wiki/UmlCanvas</a> for more info." } );
    },
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
