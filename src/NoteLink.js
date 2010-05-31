UmlCanvas.NoteLink = Canvas2D.Connector.extend( {
    preprocess: function( props ) {
	props.routing = props.routing || "horizontal";
	props.lineStyle = props.lineStyle || "dashed";
	props.from = props.note;
	props.to   = props.element;
	return props;
    },

    asConstruct : function asConstruct() {
	return null;
    }
});

UmlCanvas.NoteLink.MANIFEST = {
    name         : "notelink",
    propertyPath : [ Canvas2D.Connector ],
    libraries    : [ "UmlCanvas", "Class Diagram", "Relationship" ]
}

Canvas2D.registerShape( UmlCanvas.NoteLink );
