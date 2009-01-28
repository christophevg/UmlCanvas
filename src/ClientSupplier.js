UmlCanvas.Client = {};
UmlCanvas.Supplier = {};

UmlCanvas.Client.getNames = function() {
    return ["client"];
}
UmlCanvas.Supplier.getNames = function() {
    return ["supplier"];
}

UmlCanvas.Client.from = function(construct, diagram) {
    return null;
};
UmlCanvas.Supplier.from = function(construct, diagram) {
    return null;
};
    
Canvas2D.ADLVisitor.registerConstruct(UmlCanvas.Client);
Canvas2D.ADLVisitor.registerConstruct(UmlCanvas.Supplier);
