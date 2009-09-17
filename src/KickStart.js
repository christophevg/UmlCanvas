UmlCanvas.KickStart = {};

UmlCanvas.KickStart.Starter = Canvas2D.KickStart.Starter.extend( {
    init: function() {
	this.manager = new UmlCanvas.Manager();
    },
    
    getTag: function() {
	return "UmlCanvas";
    },

    makeInstance: function( name ) {
	return this.manager.setupModel(name);
    }

} );

UmlCanvas.KickStarter = new UmlCanvas.KickStart.Starter();

UmlCanvas.KickStarter.on( "ready",
			  function() { UmlCanvas.fireEvent( "ready" );} );

ProtoJS.Event.observe(window, 'load', 
		      function() { UmlCanvas.KickStarter.start(); } );
