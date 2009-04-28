UmlCanvas.KickStart = {};

UmlCanvas.KickStart.Starter = Class.create( Canvas2D.KickStart.Starter, {
    initialize: function() {
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

Event.observe(window, 'load', function() { UmlCanvas.KickStarter.start(); } );
