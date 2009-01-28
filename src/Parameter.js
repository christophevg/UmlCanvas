UmlCanvas.Parameter = {};

UmlCanvas.Parameter.getNames = function() {
    return ["parameter", "argument"];
}

UmlCanvas.Parameter.from = function(construct, operation) {
    return operation.addParameter( { name: construct.name, 
				     type: construct.zuper.toString() } );

};

Canvas2D.ADLVisitor.registerConstruct(UmlCanvas.Parameter);
