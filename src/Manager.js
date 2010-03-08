// UmlCanvas implements the Canvas2D.Book concept as a Model
UmlCanvas.Manager = Canvas2D.Manager.extend( {
  setupModel : function setupModel(modelId) {
    return this.addBook(new UmlCanvas.Model(modelId));
  },

  getModel : function getModel(id) {
    return this.getBook( id || "" );
  }
} );
