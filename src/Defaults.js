UmlCanvas.Defaults = {}

UmlCanvas.Class.Defaults = { 
    stereotype        : "",
    supers            : [],
    
    useCrispLines     : true,
    font              : "7pt Verdana",
    fontColor         : "black",
    fontAbstract      : "italic 7pt Verdana",
    abstractColor     : "black",
    decoration        : "none",
    decorationStatic  : "underline",

    lineWidth          : 1,
    lineColor          : "rgba(255,0,0,1)",
    backgroundColor    : "rgba(255,255,200,1)",

    padding            : 5,
    lineSpacing        : 5,
    compartmentSpacing : 3
};

UmlCanvas.Interface.Defaults   = {}
UmlCanvas.Enumeration.Defaults = {}

UmlCanvas.Association.Defaults = {}
UmlCanvas.Dependency.Defaults  = {}

UmlCanvas.Inheritance.Defaults = {}
UmlCanvas.Realization.Defaults = {}

UmlCanvas.Note.Defaults = {
    text		: "TODO",
    width		: 100,
    height		: 40,
    padding		: 5,
    font		: "7pt Verdana",
    fontColor		: "black",
    lineColor		: "grey",
    backgroundColor	: "rgba(240,240,240,1)",
    lineWidth		: 1,
    useCrispLines	: true
};

UmlCanvas.NoteLink.Defaults = {};
