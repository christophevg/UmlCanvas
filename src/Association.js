UmlCanvas.Composition = Class.create( Canvas2D.Connector, {
    initialize: function( $super, from, to, props ) {
	props = props || {};
	props.begin = UmlCanvas.ConnectorHeads.FullDiamond;
	if( props.navigability == "bi" || props.navigability == "destination" ){
	    props.end = UmlCanvas.ConnectorHeads.Arrow;
	}
	props['style'] = props['style'] || "horizontal";
	$super( from, to, props );
    }
});

UmlCanvas.Aggregation = Class.create( Canvas2D.Connector, {
    initialize: function( $super, from, to, props ) {
	props = props || {};
	props.begin = UmlCanvas.ConnectorHeads.Diamond;
	if( props.navigability == "bi" || props.navigability == "destination" ){
	    props.end = UmlCanvas.ConnectorHeads.Arrow;
	}
	props['style'] = props['style'] || "horizontal";
	$super( from, to, props );
    }
});

UmlCanvas.Association = Class.create( Canvas2D.Connector, {
    initialize: function( $super, from, to, props ) {
	if( props.navigability == "bi" || props.navigability == "source" ){
	    props.begin = UmlCanvas.ConnectorHeads.Arrow;
	}
	if( props.navigability == "bi" || props.navigability == "destination" ){
	    props.end = UmlCanvas.ConnectorHeads.Arrow;
	}
	props['style'] = props['style'] || "horizontal";
	$super( from, to, props );
    }
});

UmlCanvas.Association.getNames = function() {
    return ["association", "relation"];
}

UmlCanvas.Association.from = function(construct, diagram) {
    var from = construct.children[0];
    var to   = construct.children[1];
    var style = "association";

    if( to.modifiers.get( "composition" ) || 
	to.modifiers.get( "composite"   ) ) 
    {
	from = construct.children[1];
	to   = construct.children[0];
    }
    if( from.modifiers.get( "composition" ) || 
	from.modifiers.get( "composite" ) ) 
    {
	style = "composition";
    }
    
    if( to.modifiers.get( "aggregation" ) ||
	to.modifiers.get( "aggregate" ) ) 
    {
	from = construct.children[1];
	to   = construct.children[0];
    }
    if( from.modifiers.get( "aggregation" ) ||
	from.modifiers.get( "shared" ) ) 
    {
	style = "aggregation";
    }
    
    var navigability = null;
    if( from.modifiers.get( "navigable" ) 
	&& to.modifiers.get( "navigable" ) ) 
    {
	navigability = "bi";
    } else if( from.modifiers.get( "navigable" ) ) {
	navigability = "source";
    } else if( to.modifiers.get( "navigable" ) ) {
	navigability = "destination";
    }
    
    var treeStyle = "vertical";
    if( construct.annotation ) {
	if( construct.annotation.data == "horizontal" ) {
	    treeStyle = "horizontal";
	}
    }
    
    props = { style: treeStyle, navigability: navigability };
    
    var src = diagram.getClass(from.zuper.constructName);
    var dst = diagram.getClass(to.zuper.constructName);
    
    switch(style) {
    case "composition":
	elem = new UmlCanvas.Composition( src, dst, props );
	break;
    case "aggregation":
	elem = new UmlCanvas.Aggregation( src, dst, props );
	break;
    default:
	elem = new UmlCanvas.Association( src, dst, props );
    }
    return diagram.addRelation(elem);
};
    
Canvas2D.ADLVisitor.registerConstruct(UmlCanvas.Association);
