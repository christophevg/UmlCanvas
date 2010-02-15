using System;
using System.Collections.Generic;

using UML = TSF.UmlToolingFramework.UML;

namespace TSF.UmlCanvas.UTF {
  public class InterfaceRealization : Abstraction, 
                                UML.Classes.Interfaces.InterfaceRealization, 
                                UML.Diagrams.DiagramElement
  {
    public InterfaceRealization(Model model, Element owner) 
      : base(model, owner)
    {}
  }
}
