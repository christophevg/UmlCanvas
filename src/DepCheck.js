if( typeof decomposeVersion != "function" ) {
    function decomposeVersion( version ) {
	var result = version.match(/([0-9]+)\.([0-9]+)(-([0-9]+))?/);
	return { major: parseInt(result[1]),
		 minor: parseInt(result[2]),
		 build: parseInt(result[4]) || 0 };
    }
}

if( typeof iRequire != "function" ) {
    function iRequire( lib, low, high ) {
	var version = decomposeVersion( lib.version );
	low = decomposeVersion( low );
	if( ( version.major < low.major )
	    ||
	    ( version.major == low.major 
	      && version.minor < low.minor ) 
	    ||
	    ( version.major == low.major 
	      && version.minor == low.minor 
	      && version.build < low.build ) )
	{
	    return false;
	}
	if( high ) {
            high = decomposeVersion( high );
            if( ( version.major > high.major )
		||
		( version.major == high.major 
		  && version.minor > high.minor ) 
		||
		( version.major == high.major 
		  && version.minor == high.minor 
		  && version.build > high.build ) )
	    {
		return false;
	    }
	}
	
	return true;
    }
}
    
if( ! iRequire( Canvas2D, "0.2-5" ) ) {
    alert( "UmlCanvas requires at least Canvas2D version 0.2-5. " +
	   "Current Canvas2D is " + Canvas2D.version );
}
