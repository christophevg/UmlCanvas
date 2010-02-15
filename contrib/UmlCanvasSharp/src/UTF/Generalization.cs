using System;
using System.Collections.Generic;

using UML = TSF.UmlToolingFramework.UML;

namespace TSF.UmlCanvas.UTF {
  public class Generalization : Abstraction,
                                UML.Classes.Kernel.Generalization, 
                                UML.Diagrams.DiagramElement 
  {
    public Generalization(Model model, Element owner) : base(model,owner) {}
  }
}
