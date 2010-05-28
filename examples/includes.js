var UMLCANVAS_VERSION = "development";

var scripts = [ 
    "../lib/Canvas2D/build/Canvas2D.standalone.js",
    "../src/DepCheck.js",

    "../src/UmlCanvas.js",
    "../src/Common.js",
    "../src/Manager.js",
    "../src/Model.js",
    "../src/Diagram.js",
    "../src/Class.js",
    "../src/Attribute.js",
    "../src/Operation.js",
    "../src/Parameter.js",
    "../src/ConnectorHeads.js",
    "../src/Association.js",
    "../src/Role.js",
    "../src/Dependency.js",
    "../src/ClientSupplier.js",
    "../src/Interface.js",
    "../src/Inheritance.js",
    "../src/Realization.js",
    "../src/Enumeration.js",
    "../src/Note.js",
    "../src/NoteLink.js",
    "../src/StateDiagrams.js",

    "../src/Widget.js",
    "../src/KickStart.js",
    "../src/PluginManagerRepository",

    "../src/plugins/Plugin.js",
    "../src/plugins/Inspector.js",
    "../src/plugins/Sheet.js",
    "../src/plugins/HuC.js",

    "../src/Defaults.js",
    "../src/Config.js",
    "../src/plugins/inspector.css.js"
];

var count = 0;

function addScript(url) {
  document.writeln( "<script type=\"text/javascript\" src=\"" + url + "\"></script>" );
}

function loadScripts() {
  for( var i=0; i<scripts.length; i++ ) {
	  addScript(scripts[i]);
  }
}

loadScripts();
