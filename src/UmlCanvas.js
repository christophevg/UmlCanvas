if( typeof Canvas2D == "undefined" ) {
    alert( "UmlCanvas requires Canvas2D." );
} else {

var UmlCanvas = {};

UmlCanvas.diagrams = new Array();
UmlCanvas.registerDiagram = function( name ) {
    UmlCanvas.diagrams.push( name );
}
UmlCanvas.getDiagram = function( name ) {
    return UmlCanvas.diagrams.get( name );
}

UmlCanvas.onReady = null;

Event.observe(window, 'load', function() {
    var diagrams = new Hash();
    UmlCanvas.diagrams.each( function(item) {
	diagrams.set( item, new UmlCanvas.Diagram(item) );
    });
    UmlCanvas.diagrams = diagrams;
    if( UmlCanvas.onReady ) { UmlCanvas.onReady(); }
});

UmlCanvas.ConnectorHeads = {
    Triangle : {n:{lines:[[ -5, -10],[ +5,-10],[  0,  0]],end:[ 0,-10]},
		e:{lines:[[+10,  +5],[+10, -5],[  0,  0]],end:[10,  0]},
		s:{lines:[[ +5, +10],[ -5,+10],[  0,  0]],end:[ 0, 10]},
		w:{lines:[[-10,  -5],[-10, +5],[  0,  0]],end:[-10, 0]}},
    Arrow    : {n:{lines:[[ -5, -10],[  0,  0],[ +5,-10]],end:[0, 0]},
		e:{lines:[[+10,  +5],[  0,  0],[+10, -5]],end:[0, 0]},
		s:{lines:[[ +5, +10],[  0,  0],[ -5,+10]],end:[0, 0]},
		w:{lines:[[-10,  -5],[  0,  0],[-10, +5]],end:[0, 0]}},
    Diamond  : {n:{lines:[[ -5,  -5],[  0,-10],[ +5, -5],[0, 0]],end:[ 0,-10]},
		e:{lines:[[ +5,  +5],[+10,  0],[ +5, -5],[0, 0]],end:[10,  0]},
		s:{lines:[[ +5,  +5],[  0,+10],[ -5, +5],[0, 0]],end:[ 0, 10]},
		w:{lines:[[ -5,  -5],[-10,  0],[ -5, +5],[0, 0]],end:[-10, 0]}},
    FullDiamond:{n:{lines:[[-5,-5],[0,-10],[+5,-5],[0, 0],"fill"],end:[ 0,-10]},
		 e:{lines:[[+5,+5],[+10,0],[+5,-5],[0, 0],"fill"],end:[10,  0]},
		 s:{lines:[[+5,+5],[0,+10],[-5,+5],[0, 0],"fill"],end:[ 0, 10]},
		 w:{lines:[[-5,-5],[-10,0],[-5,+5],[0, 0],"fill"],end:[-10, 0]}}
};

UmlCanvas.Inheritance = Class.create( Canvas2D.Connector, {
    initialize: function( $super, from, to, props ) {
	props.begin = UmlCanvas.ConnectorHeads.Triangle;
	$super( from, to, props );
    },
    initialBranchLength: function(top, bottom) {
	return 25;
    }
});

UmlCanvas.Realization = Class.create( Canvas2D.Connector, {
    initialize: function( $super, from, to, props ) {
	props.begin = UmlCanvas.ConnectorHeads.Triangle;
	props.lineStyle = "dashed";
	$super( from, to, props );
    },
    initialBranchLength: function(top, bottom) {
	return 25;
    }
});

UmlCanvas.Dependency = Class.create( Canvas2D.Connector, {
    initialize: function( $super, from, to, props ) {
	props.end = UmlCanvas.ConnectorHeads.Arrow;
	props.lineStyle = "dashed";
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
	$super( from, to, props );
    }
});

UmlCanvas.Aggregation = Class.create( Canvas2D.Connector, {
    initialize: function( $super, from, to, props ) {
	props.begin = UmlCanvas.ConnectorHeads.Diamond;
	if( props.navigability == "bi" || props.navigability == "destination" ){
	    props.end = UmlCanvas.ConnectorHeads.Arrow;
	}
	$super( from, to, props );
    }
});

UmlCanvas.Composition = Class.create( Canvas2D.Connector, {
    initialize: function( $super, from, to, props ) {
	props.begin = UmlCanvas.ConnectorHeads.FullDiamond;
	if( props.navigability == "bi" || props.navigability == "destination" ){
	    props.end = UmlCanvas.ConnectorHeads.Arrow;
	}
	$super( from, to, props );
    }
});

UmlCanvas.ADLVisitor = Class.create( {
    extractVisibility: function(construct) {
	var visibility = construct.modifiers.get("visibility" );
	if( visibility ) { return visibility.value.value; }
	// short hand
	if( construct.modifiers.get( "public"    ) ) { return "public"; }
	if( construct.modifiers.get( "private"   ) ) { return "private"; }
	if( construct.modifiers.get( "protected" ) ) { return "protected"; }

	return null;
    },
    visit: function( construct, parent ) {
	var elem = parent;
	switch( construct.type ) {
	case "interface":
	case "class":
	    var props = { name: construct.name  };
	    var stereotype = construct.modifiers.get("stereotype" );
	    if( stereotype ) {
		props['stereotype'] = stereotype.value.value;
	    }
	    elem =  construct.type == "interface" ?
		new UmlCanvas.Interface( props )
		: new UmlCanvas.Class( props );
	    if( construct.zuper ) {
		var zuper = parent.getClass(construct.zuper.constructName);
		var relation;
		if( zuper instanceof UmlCanvas.Interface ) {
		     relation = 
			new UmlCanvas.Realization( zuper, elem, 
						   { style: "vertical" } );
		} else {
		    relation = 
			new UmlCanvas.Inheritance( zuper, elem, 
						   { style: "vertical" } );
		}
		parent.addRelation(relation);
	    }
	    if( construct.annotation ) {
		var pos = construct.annotation.data.split(",");
		elem.props.left = pos[0];
		elem.props.top = pos[1];
	    }
	    parent.addClass(elem);
	    break;

	case "attribute":
	    var props =  { name: construct.name, 
		           type: construct.zuper.toString() };
	    var visibility = this.extractVisibility(construct);
	    if( visibility ) {
		props['visibility'] = visibility;
	    }
	    elem = parent.addAttribute(props);
	    break;

	case "method":
	    var props =  { name: construct.name }; 
	    if( construct.zuper ) { 
		props.returnType = construct.zuper.toString(); 
	    }
	    var visibility = this.extractVisibility(construct);
	    if( visibility ) {
		props['visibility'] = visibility;
	    }
	    elem = parent.addMethod( props );
	    break;

	case "argument":
	    elem = parent.addParameter( { name: construct.name, 
					  type: construct.zuper.toString() } );
	    break;

	case "dependency":
	    var client, supplier, props;
	    if( construct.children[0].type == "client" ) {
		client   = construct.children[0];
		supplier = construct.children[1];
	    } else {
		client   = construct.children[1];
		supplier = construct.children[0];
	    }
	    var treeStyle = "horizontal";
	    if( construct.annotation ) {
		if( construct.annotation.data == "vertical" ) {
		    treeStyle = "vertical";
		}
	    }
	    props = { style: treeStyle }

	    var src = parent.getClass(client.zuper.constructName);
	    var dst = parent.getClass(supplier.zuper.constructName);

	    elem = new UmlCanvas.Dependency( src, dst, props );
	    parent.addRelation(elem);
	    break;
	case "client":
	    // dealt with when dealing with dependencies
	    break;
	case "supplier":
	    // dealt with when dealing with dependencies
	    break;
	case "association":
	    var from = construct.children[0];
	    var to   = construct.children[1];
	    var style = "association";

	    if( to.modifiers.get( "composition" ) ) {
		from = construct.children[1];
		to   = construct.children[0];
	    }
	    if( from.modifiers.get( "composition" ) ) {
		style = "composition";
	    }

	    if( to.modifiers.get( "aggregation" ) ) {
		from = construct.children[1];
		to   = construct.children[0];
	    }
	    if( from.modifiers.get( "aggregation" ) ) {
		style = "aggregation";
	    }
	    
	    var navigability = null;
	    if( from.modifiers.get( "navigable" ) 
		&& to.modifiers.get( "navigable" ) ) {
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

	    props = { style: treeStyle, navigability: navigability }

	    var src = parent.getClass(from.zuper.constructName);
	    var dst = parent.getClass(to.zuper.constructName);

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
	    parent.addRelation(elem);
	    break;
	case "role":
	    // dealt with roles when dealing with association
	    break;
	case "root":
	    break;
	default:
	    alert( "unknown type " + construct.type );
	}
	construct.childrenAccept(this, elem);
	return elem;
    }
} );

UmlCanvas.Diagram = Class.create( {
    name      : null,
    canvas    : null,
    source    : null,
    classes   : new Array(),
    relations : new Array(),
    classMap  : new Hash(),
    eventHandlers : new Hash(),

    initialize: function( item ) {
	this.name = item;
	this.canvas = new UmlCanvas.Canvas(this.name);
	this.display( document.getElementById(this.name+"Source")
	              .firstChild.nodeValue );
	this.eventHandlers = new Hash();

	var me = this;
	this.canvas.on( "selectShape", function(shape) { 
	    var shapeType = shape.type;
	    if( me.eventHandlers["select"+shapeType] ) {
		me.eventHandlers["select"+shapeType](shape);
	    }
	} );
    },

    on: function( event, handler ) {
	this.eventHandlers[event] = handler;
    },

    display: function(source) {    
	this.canvas.clear();
	this.classes   = new Array();
	this.relations = new Array();
	this.classMap  = new Hash();

	var parser = new ADL.Parser();
	var tree = null;
	if( ( tree = parser.parse( source ) ) ) {
	    this.canvas.freeze();
	    tree.getRoot().accept( new UmlCanvas.ADLVisitor(), this );
	    var offset = 25;
	    var canvas = this.canvas;
	    this.classes.each( function( clazz, index ) {
		var pos  = offset*(index+1);
		var left = parseInt( clazz.props.left? clazz.props.left : pos);
		var top  = parseInt(clazz.props.top ? clazz.props.top  : pos);
		canvas.at( left, top ).put( clazz );
	    } );
	    this.relations.each( function(relation) {
		canvas.put(relation);
	    } );
	    this.canvas.thaw();
	}
    },

    addClass: function(clazz) {
	this.classes.push( clazz );
	this.classMap.set( clazz.props.name, clazz );
    },

    getClass: function(name) {
	return this.classMap.get(name);
    },

    addRelation: function(relation) {
	this.relations.push(relation);
    }
} );

UmlCanvas.Canvas = Canvas2D.Canvas;

UmlCanvas.determineVisibility = function(visibility) {
    switch(visibility) {
    case "protected": return "#";
    case "private":   return "-";
    case "package":   return "~";
    }
    return "+";
}

UmlCanvas.Attribute = Class.create( {
    visibility : null,
    name : null,
    type : null,
    initialize: function( attribute ) {
	this.visibility = attribute.visibility;
	this.name       = attribute.name;
	this.type       = attribute.type;
    },
    toString: function() {
	return UmlCanvas.determineVisibility(this.visibility)
	    + this.name + (this.type ? " : " + this.type.toString() : "");
    }
} );

UmlCanvas.Method = Class.create( {
    visibility : null,
    name : null,
    parameters : [],
    returnType : null,
    initialize: function( method ) {
	this.visibility = method.visibility;
	this.name       = method.name;
	this.returnType = method.returnType;
	this.parameters = new Array();
	if( method.parameters ) {
	    for(var p=0; p<method.parameters.length; p++ ) {
		this.addParameter(method.parameters[p]);
	    }
	}
    },
    addParameter: function(parameter) {
	this.parameters.push( parameter.type.toString() );
    },
    toString: function() {
	return UmlCanvas.determineVisibility(this.visibility)
	    + this.name + "(" + this.parameters.join( ", " ) + ")"
	    + (this.returnType ? " : " + this.returnType.toString() : "");
    }
} );

UmlCanvas.Class = Class.create( Canvas2D.Rectangle, {
    prepared   : true,
    attributes : [],
    methods    : [],

    config:     { font:               "Sans",
		  fontSize:           10,
		  fontColor:          "black",
		  lineColor:          "rgba(255,0,0,1)",
		  lineWidth:          1,
		  backgroundColor:    "rgba(255,255,200,1)",
		  lineSpacing:        5,
		  compartmentSpacing: 3,
		  padding:            5 },

    initialize: function($super,props) {
	$super(props || {});
	this.attributes = new Array();
	this.methods = new Array();
	this.markUnprepared();
    },

    getProperties: function($super) {
	var props = $super();
	props.type = "Class";
	return props;
    },
    
    measureText: function(text) {
	if( this.canvas ) { 
	    return this.canvas.measureText( this.config.font, 
	                                    this.config.fontSize, 
	                                    text );
	} else {
	    alert( "UmlCanvas.Class::measureText: need canvas" );
	}
    },

    drawText: function(top, text) {
	if( this.canvas ){
	    this.canvas.drawText( this.config.font, this.config.fontSize, 
				  this.props.left + this.config.padding, 
				  this.props.top  + top, 
				  text );
	} else {
	    alert( "UmlCanvas.Class::drawText: need canvas" );
	}
    },

    drawTextCenter: function(top, text) {
	if( this.canvas ) {
	    this.canvas.drawTextCenter( this.config.font, this.config.fontSize, 
					this.props.left + (this.props.width/2), 
					this.props.top  + top, 
					text );
	} else {
	    alert( "UmlCanvas.Class::drawTextCenter: need canvas" );
	}
    },

    fillStrokeRect: function(top, height) {
	if( this.canvas ) {
	    if( this.props.left ) {
		this.canvas.fillRect  (this.props.left, this.props.top + top, 
				       this.props.width, height);
		this.canvas.strokeRect(this.props.left, this.props.top + top, 
				       this.props.width, height);
	    } else {
		alert( "UmlCanvas.Class::fillStrokeRect: need position" );
	    }
	} else {
	    alert( "UmlCanvas.Class::fillStrokeRect: need canvas" );
	}
    },

    prepare: function() {
	if( !this.canvas ) { return; }
	if( this.prepared ) { return; }

	// this.canvas.log( "prepare" );
	// find widest text amongst
	// ... className
	var maxWidth = this.measureText(this.props.name);

	// ... stereotype
	var width = this.measureText("<<" + this.props.stereotype + ">>" );
	maxWidth = width >= maxWidth ? width : maxWidth;

	// ... attributes
	for( var i=0; i<this.attributes.length; i++ ) {
	    var width = this.measureText(this.attributes[i].toString());
	    maxWidth = width >= maxWidth ? width : maxWidth;
	}
	// ... methods
	for( var i=0; i<this.methods.length; i++ ) {
	    var width = this.measureText( this.methods[i].toString() );
	    maxWidth = width >= maxWidth ? width : maxWidth;
	}

	// calculate width and height
	this.props.width = ( 2 * this.config.padding ) + maxWidth;

	var lineSize = this.config.fontSize + this.config.lineSpacing;
	var attributesHeight = this.attributes.length > 0 ?
	    ( this.attributes.length * lineSize )
	    + ( 2 * this.config.compartmentSpacing )
	    : 0;
	var methodsHeight = this.methods.length > 0 ?
	    ( this.methods.length * lineSize )
	    + ( 2 * this.config.compartmentSpacing )
	    : 0;
	
	this.props.height = attributesHeight + methodsHeight
	    + ( ( this.props.stereotype ? 2 : 1 ) * lineSize )
	    + ( 2 * this.config.padding );
	
	this.prepared = true;
    },

    markUnprepared: function() {
	this.prepared = false;	
	this.forceRedraw();
    },

    forceRedraw: function($super) {
	this.prepare();
	$super();
    },

    addAttribute: function(attribute) {
	// allowing shorthand hash notation, objectifying on the fly
	if( !(attribute instanceof UmlCanvas.Attribute) ) {
	    attribute = new UmlCanvas.Attribute( attribute );
	}
	this.attributes.push( attribute );
	this.markUnprepared();
	return attribute;
    },

    addMethod: function(method) {
	// allowing shorthand hash notation, objectifying on the fly
	if( !(method instanceof UmlCanvas.Method) ) {
	    method = new UmlCanvas.Method( method );
	}
	this.methods.push(method);
	this.markUnprepared();
	return method;
    },

    render: function() {
	this.prepare();
	this.canvas.fillStyle   = this.config.backgroundColor;
	this.canvas.strokeStyle = this.config.lineColor;
	this.canvas.lineWidth   = this.config.lineWidth;

	var lineSize = this.config.fontSize + this.config.lineSpacing

	// className compartment
	var classCompHeight = ( this.config.padding 
				+ (lineSize * (this.props.stereotype ? 2 : 1)) 
				+ this.config.compartmentSpacing );
	this.fillStrokeRect( 0, classCompHeight );
	
	// attribute compartment
	var attrCompHeight = 0;
	if( this.attributes.length > 0 ) {
	    attrCompHeight =  ( this.config.compartmentSpacing
				+ ( lineSize * this.attributes.length )
				+ this.config.compartmentSpacing );
	    this.fillStrokeRect( classCompHeight, attrCompHeight );
	}

	// method compartment
	var methCompHeight = 0;
	if( this.methods.length > 0 ) {
	    methCompHeight = ( this.config.compartmentSpacing
				   + ( lineSize * this.methods.length ) 
				   + this.config.padding );
	    this.fillStrokeRect( classCompHeight + attrCompHeight, 
				 methCompHeight );
	}
	// TEXT
	this.canvas.strokeStyle = this.config.fontColor;

	// stereotype
	if( this.props.stereotype ) {
	    this.drawTextCenter( this.config.padding + this.config.fontSize,
				 "<<" + this.props.stereotype + ">>" );
	}
	// className
	this.drawTextCenter( this.config.padding     + this.config.fontSize
			     + ( this.props.stereotype ? lineSize : 0 ), 
			     this.props.name );

	// attributes
	for( var i=0; i<this.attributes.length; i++ ) {
	    this.drawText( classCompHeight + ( lineSize * (i+1) ), 
			   this.attributes[i].toString() );
	}

	// methods
	for( var i=0; i<this.methods.length; i++ ) {
	    this.drawText( classCompHeight + attrCompHeight + (lineSize*(i+1)),
			   this.methods[i].toString() );
	}
    }
} );

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
    
}
