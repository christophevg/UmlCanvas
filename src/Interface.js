UmlCanvas.Interface = Class.create( UmlCanvas.Class, {
    initialize: function( $super, props ) {
	props['stereotype'] = 
	    props['stereotype'] ? "interface " + props['stereotype'] 
	    : "interface";
	$super( props );
    },

    getProperties: function($super) {
	var props = $super();
	props.type = "Interface";
	return props;
    }

} );

UmlCanvas.Interface.getNames = function() {
    return [ "interface" ];
}

UmlCanvas.Interface.from = function( construct, diagram ) {
    var props = {};
    
    // NAME
    props.name = construct.name;

    // STEREOTYPE
    var stereotype = construct.modifiers.get("stereotype" );
    if( stereotype ) {
	props.stereotype = stereotype.value.value;
    }

    var elem = new UmlCanvas.Interface( props );

    // SUPERCLASS
    if( construct.zuper ) {
	var zuper = diagram.getClass(construct.zuper.constructName);
	var relation;
	if( zuper instanceof UmlCanvas.Interface ) {
	    relation = new UmlCanvas.Realization( zuper, elem );
	} else {
	    relation = new UmlCanvas.Inheritance( zuper, elem );
	}
	diagram.addRelation(relation);
    }

    var left, top;
    if( construct.annotation ) {    
	var pos = construct.annotation.data.split(",");
	left = parseInt(pos[0]);
	top  = parseInt(pos[1]);
    } else {
	left = this.offset * ( this.unknownIndex++ );
	top = left;
    }
    diagram.at(left,top).put(elem);
    return elem;
};

Canvas2D.ADLVisitor.registerConstruct(UmlCanvas.Interface);
