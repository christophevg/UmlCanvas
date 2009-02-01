UmlCanvas.Association = Class.create( Canvas2D.Connector, {
    fromElement : null,
    toElement   : null,
    kind        : null,
    navigability: null,

    initialize: function( $super, from, to, kind, props ) {
	this.fromElement  = from;
	this.toElement    = to;
	this.kind         = kind;
	this.navigability = props.navigability;

	if( kind == "aggregation" ) {
	    props.begin = UmlCanvas.ConnectorHeads.Diamond;	    
	} else if( kind == "composition" ) {
	    props.begin = UmlCanvas.ConnectorHeads.FullDiamond;	    
	} else if( props.navigability == "bi" || 
		   props.navigability == "source" ) 
	{
	    props.begin = UmlCanvas.ConnectorHeads.Arrow;
	}
	if( props.navigability == "bi" || props.navigability=="destination") {
	    props.end = UmlCanvas.ConnectorHeads.Arrow;
	}
	props['style'] = props['style'] || "horizontal";
	$super( from.element, to.element, props );
    },

    toADL: function(prefix) {
	var s = prefix + "[@" + this.props.style + "]\n";
	s += prefix + "association " + this.props.name + " {\n";
	s += prefix + "  role " + this.fromElement.name + 
	    " : " + this.fromElement.element.props.name + 
	    ( this.kind != "association" ? 
	      ( this.kind == "aggregation" ? 
		" +shared" : " +composite" ) : "" ) +
	    ( this.navigability == "bi" || this.navigablity == "source" ?
	      " +navigable" : "" ) 
	    + ";\n";
	s += prefix + "  role " + this.toElement.name + 
	    " : " + this.toElement.element.props.name + 
	    ( this.navigability == "bi" || this.navigability == "destination" ?
	      " +navigable" : "" ) 
	+ ";\n";
	s += prefix + "}";
	return s;
    }
});

UmlCanvas.Association.getNames = function() {
    return ["association", "relation"];
}

UmlCanvas.Association.from = function(construct, diagram) {
    var from = construct.children[0];
    var to   = construct.children[1];
    var kind = "association";

    if( to.modifiers.get( "composition" ) || 
	to.modifiers.get( "composite"   ) ) 
    {
	from = construct.children[1];
	to   = construct.children[0];
    }
    if( from.modifiers.get( "composition" ) || 
	from.modifiers.get( "composite" ) ) 
    {
	kind = "composition";
    }
    
    if( to.modifiers.get( "aggregation" ) ||
        to.modifiers.get( "shared" ) ) 
    {
	from = construct.children[1];
	to   = construct.children[0];
    }
    if( from.modifiers.get( "aggregation" ) ||
	from.modifiers.get( "shared" ) ) 
    {
	kind = "aggregation";
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
    
    props = { name: construct.name, 
	      style: treeStyle, navigability: navigability };
    
    var src = { name   : from.name, 
	        element: diagram.getClass(from.zuper.constructName) };
    var dst = { name   : to.name,
	        element: diagram.getClass(to.zuper.constructName) };
    
    elem = new UmlCanvas.Association( src, dst, kind, props );

    return diagram.addRelation(elem);
};
    
Canvas2D.ADLVisitor.registerConstruct(UmlCanvas.Association);
