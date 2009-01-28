UmlCanvas.Role = {};

UmlCanvas.Role.getNames = function() {
    return ["role"];
}

UmlCanvas.Role.from = function(construct, diagram) {
    return null;
};
    
Canvas2D.ADLVisitor.registerConstruct(UmlCanvas.Role);
