UmlCanvas.Inheritance = Class.create( Canvas2D.Connector, {
    initialize: function( $super, from, to, props ) {
	props = props || {};
	props.begin = UmlCanvas.ConnectorHeads.Triangle;
	props.style = props.style || "vertical";
	$super( from, to, props );
    },
    initialBranchLength: function(top, bottom) {
	return 25;
    }
});
