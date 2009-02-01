UmlCanvas.KickStart = {};

UmlCanvas.KickStart.Starter = Class.create( Canvas2D.KickStart.Starter, {
    getTag: function() {
	return "UmlCanvas";
    },

    makeInstance: function( name ) {
	return new UmlCanvas.Model(name);
    },

    start: function($super) {
	$super();
	UmlCanvas.fireEvent( "ready" );
    }
} );

UmlCanvas.KickStarter = new UmlCanvas.KickStart.Starter();
Event.observe(window, 'load', function() { UmlCanvas.KickStarter.start(); } );
