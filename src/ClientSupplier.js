UmlCanvas.Client = Class.extend({});
UmlCanvas.Supplier = Class.extend({});

UmlCanvas.Client.from = function(construct, diagram) {
    return null;
};

UmlCanvas.Supplier.from = function(construct, diagram) {
    return null;
};

UmlCanvas.Client.MANIFEST = {
    name : "client"
}

UmlCanvas.Supplier.MANIFEST = {
    name : "supplier"
}
    
Canvas2D.registerShape(UmlCanvas.Client);
Canvas2D.registerShape(UmlCanvas.Supplier);
