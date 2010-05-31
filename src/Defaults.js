UmlCanvas.Defaults = {}

UmlCanvas.Class.Defaults = {
    name              : "newClass",
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

UmlCanvas.Interface.Defaults   = {
  name : "newInterface"
}
UmlCanvas.Enumeration.Defaults = {
  name : "newEnumeration"
}

UmlCanvas.Association.Defaults = {
  name : "newAssociation"
}
UmlCanvas.Dependency.Defaults  = {
  name : "newDependency"
}

UmlCanvas.Inheritance.Defaults = {
  name : "newInheritance"
}
UmlCanvas.Realization.Defaults = {
  name : "newRealization"
}

UmlCanvas.Note.Defaults = {
  name            : "NewName",
  text		        : "New Note",
  width		        : 100,
  height		      : 40,
  padding		      : 5,
  font		        : "7pt Verdana",
  fontColor		    : "black",
  lineColor		    : "grey",
  backgroundColor	: "rgba(240,240,240,1)",
  lineWidth		    : 1,
  useCrispLines	  : true
};

UmlCanvas.NoteLink.Defaults = {};

UmlCanvas.State.Defaults = {
  name         : 'newState',
  roundCorners : true,
  lineColor    : 'rgb(250,125,0)',
  fillColor    : 'rgb(255,240,175)',
  labelColor   : 'rgb(250,125,0)',
  labelPos     : 'top-inner',
  width        : 100,
  height       : 50
};

UmlCanvas.Transition.Defaults = {
  name         : 'NewTransition',
  lineColor    : 'rgb(250,125,0)'
};
