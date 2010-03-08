var UmlCanvasBase = Class.extend( {
  init : function init() {
    this.plugins = {};
  },

  getModel : function getModel(name) {
    return UmlCanvas.KickStarter.manager.getModel(name);
  }
} );

// mix-in event handling
ProtoJS.mix( Canvas2D.Factory.extensions.all.EventHandling, UmlCanvasBase );

var UmlCanvas = new UmlCanvasBase();
UmlCanvas.version = UMLCANVAS_VERSION;

UmlCanvas.activate = function activate(canvasId) {
  var canvas = document.getElementById(canvasId);
  if(canvas) {
    var manager = new UmlCanvas.Manager();
    var model   = manager.setupModel(canvasId);
    var diagram = model.addDiagram();
    manager.startAll();
    return diagram;
  }
  throw( canvasId + " does not reference a known id on the document." );
};

// mix-in event handling to UmlCanvas
ProtoJS.mix( Canvas2D.Factory.extensions.all.EventHandling, UmlCanvas );

// register this extension with Canvas2D
Canvas2D.extensions.push(
  { name: "UmlCanvas",
  version: UMLCANVAS_VERSION,
  author: "<a href=\"http://christophe.vg\">Christophe VG</a>",
  info: "Visit <a href=\"http://thesoftwarefactory.be/wiki/UmlCanvas\">" +
        "http://thesoftwarefactory.be/wiki/UmlCanvas</a> for more info." }
);
