// a book is called a Model, which contains diagram in stead of sheets
UmlCanvas.Model = Canvas2D.Book.extend( {
    addDiagram: function(diagram) {
	unless( diagram instanceof UmlCanvas.Diagram, function() {
	    diagram = new UmlCanvas.Diagram();
	} );
	return this.addSheet(diagram);
    }
} );
