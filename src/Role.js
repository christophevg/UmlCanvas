UmlCanvas.Role = Class.extend({
    setparent: function setParent() {}
});

UmlCanvas.Role.from = function(construct, diagram) {
    return null;
};

UmlCanvas.Role.MANIFEST = {
    name : "role"
}
    
Canvas2D.registerShape(UmlCanvas.Role);
