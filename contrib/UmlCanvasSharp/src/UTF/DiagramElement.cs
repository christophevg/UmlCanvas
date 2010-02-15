using System;
using System.Collections.Generic;

using UML = TSF.UmlToolingFramework.UML;
using TSF.UmlCanvas;

namespace TSF.UmlCanvas.UTF {
  public abstract class DiagramElement : ConstructWrapper, 
                                         UML.Diagrams.DiagramElement
  {
    internal Diagram diagram { get; set; }

    internal DiagramElement(Model model, TSF.ADL.Construct construct)
      : base(model,construct)
    {}

    /// in most cases the diagram is the owner of the element.
    /// Only operations,parameters and attributes are different
    public override UML.Classes.Kernel.Element owner {
      get { return this.diagram; }
      set { this.diagram = value as Diagram; }
    }

    internal override void saveElement() {
      throw new NotImplementedException();
    }

    public UML.Classes.Kernel.Element element {
      get { return this; }
      set { /* do nothing */ }
    }

    public abstract int xPosition { get; set; }
    public abstract int yPosition { get; set; }
  }
}
