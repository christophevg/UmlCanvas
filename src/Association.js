UmlCanvas.Association = Canvas2D.Connector.extend( {
    preprocess: function(props) {
	if( props.kind && props.kind == "aggregation" ) {
	    props.begin = UmlCanvas.ConnectorHeads.Diamond;	    
	} else if( props.kind && props.kind == "composition" ) {
	    props.begin = UmlCanvas.ConnectorHeads.FullDiamond;	    
	} else if( props.navigability && 
		   ( props.navigability == "bi" || 
		     props.navigability == "source" ) )
	{
	    props.begin = UmlCanvas.ConnectorHeads.Arrow;
	}
	
	if( props.navigability &&
	    ( props.navigability == "bi" || 
	      props.navigability == "destination" ) )
	{
	    props.end = UmlCanvas.ConnectorHeads.Arrow;
	}
	props['routing'] = props['routing'] || "horizontal";
	return props;
    },

    asConstruct: function() {
	var construct = this._super();
	// TODO
	return construct;
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
    
    var src = diagram.getDiagramClass(from.supers[0].constructName);
    var dst = diagram.getDiagramClass(to.supers[0].constructName);

    props = { name: construct.name, 
	      style: treeStyle, navigability: navigability,
	      from: src, to: dst, kind: kind };
    
    elem = new UmlCanvas.Association( props );

    return diagram.addRelation(elem);
};

UmlCanvas.Association.MANIFEST = {
    name         : "association",
    properties   : [ "kind", "navigability" ],
    propertyPath : [ Canvas2D.Connector ],
    libraries    : [ "UmlCanvas" ]
}
    
Canvas2D.registerShape(UmlCanvas.Association);
