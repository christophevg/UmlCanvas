// a book is called a Model, which contains diagrams in stead of sheets
// TODO plugins should be merges with Canvas2D plugins on Book
UmlCanvas.Model = Canvas2D.Book.extend( {
  init: function(UmlCanvasId) {
    this._super(UmlCanvasId);
    this.uc_plugins = {};
  },

  // TODO: move to Canvas2D::Book
  getName: function getName() {
    return this.name;
  },
  
  addPlugin: function addPlugin(plugin) {
    this.uc_plugins[plugin.getName()] = plugin;
  },

  getPlugin: function getPlugin(name) {
    return this.uc_plugins[name];
  },
  
  activatePlugins: function activatePlugins() {
    $H(this.uc_plugins).iterate( function(name, plugin) {
      plugin.activate();
    }.scope(this) );
  },
  
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

  setSize: function setSize(width, height) {
    this.canvas.canvas.width  = width;
    this.canvas.canvas.height = height;
    this.rePublish();
  }
} );
