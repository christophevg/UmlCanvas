// namespace for holding all UmlCanvas related classes, functions and extensions
var UmlCanvasBase = Class.create( {
    getModel : function(id) {
	return UmlCanvas.KickStarter.manager.getModel(id);
    }
} );

// mix-in event handling
UmlCanvasBase = Class.create( UmlCanvasBase,
			      Canvas2D.Factory.extensions.all.EventHandling );

var UmlCanvas = new UmlCanvasBase();
UmlCanvas.version = UMLCANVAS_VERSION;

// register this extension with Canvas2D
Canvas2D.extensions.push(
    { name: "UmlCanvas " + UMLCANVAS_VERSION,
      author: "<a href=\"http://christophe.vg\">Christophe VG</a>",
      info: "Visit <a href=\"http://thesoftwarefactory.be/wiki/UmlCanvas\">http://thesoftwarefactory.be/wiki/UmlCanvas</a> for more info." } );
