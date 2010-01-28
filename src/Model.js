// a book is called a Model, which contains diagram in stead of sheets
UmlCanvas.Model = Canvas2D.Book.extend( {
    addDiagram: function(diagram) {
	    unless( diagram instanceof UmlCanvas.Diagram, function() {
	      diagram = new UmlCanvas.Diagram();
	    } );
	    return this.addSheet(diagram);
    },
        
    // TODO: move these to Canvas2D::Book
    getWidth: function getWidth() {
      return parseInt(this.canvas.canvas.width);
    },
    
    getHeight: function getHeight() {
      return parseInt(this.canvas.canvas.height);
    },
    
    getLeft: function getLeft() {
      return this.canvas.getLeft();
    },
    
    getTop: function getTop() {
      return this.canvas.getTop();
    },
    
    getPlugin: function getPlugin(name) {
      return UmlCanvas.getPlugin(name).getInspector(this.name);
    },
    
    setSize: function setSize(width, height) {
      this.canvas.canvas.width = width;
      this.canvas.canvas.height = height;
      this.rePublish();
    }
} );
