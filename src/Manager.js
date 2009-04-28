// we also provide a manager, but with a context-specific signature
UmlCanvas.Manager = Class.create( Canvas2D.Manager, {
    setupModel : function(model) {
	return this.addBook(new UmlCanvas.Model(model));
    },

    getModel : function(id) {
	return this.getBook(id);
    }
} );
