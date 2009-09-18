var scripts = [ 
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
    "../src/KickStart.js",
    "../src/Enumeration.js",
    "../src/Defaults.js"
];

function addScript(url, callback) {
    var e = document.createElement("script");
    e.src = url;
    e.type="text/javascript";
    // schedule next script
    // most browsers
    e.onload = callback;
    // IE 6 & 7
    e.onreadystatechange = function() {
	if (this.readyState == 'complete') {
	    callback();
	}
    }	
    document.getElementsByTagName("head")[0].appendChild(e); 
}

var count = 0;

function loadScripts() {
    if( count < scripts.length ) {
	addScript( scripts[count], loadScripts );
	count++;
    } else {
	if( typeof startIt == "function" ) { startIt(); }
	else if( typeof drawIt == "function" ) { drawIt(); }
//	else { window.onload(); }
    }
}

function addScript(url) {
    document.writeln( "<script type=\"text/javascript\" src=\"" + url + "\"></script>" );
}

function loadScripts() {
    for( var i=0; i<scripts.length; i++ ) {
	addScript(scripts[i]);
    }
}

loadScripts();
