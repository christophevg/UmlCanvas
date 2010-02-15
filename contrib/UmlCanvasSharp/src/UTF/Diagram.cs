using System;
using System.Collections.Generic;

using UML = TSF.UmlToolingFramework.UML;
using TSF.UmlCanvas;

namespace TSF.UmlCanvas.UTF {
  /// In UmlCanvas the diagram is also the container of the elements.
  /// Therefore this class is both a Diagram and an Element
  public class Diagram : ConstructWrapper, 
                         UmlToolingFramework.UML.Diagrams.Diagram
  {
    private int _height { get; set; }
    private int _width  { get; set; }

    public string diagramID { get; set; }

    internal TSF.UmlCanvas.Diagram wrappedDiagram {
      get { return this.wrappedConstruct as TSF.UmlCanvas.Diagram; }
      set { this.wrappedConstruct = value; }
    }

    internal Diagram(Model model, TSF.UmlCanvas.Diagram diagram) 
      : base(model,diagram)
    {
      this.wrappedDiagram.makeDynamic();
    }

    internal Diagram(Model model, string name)
      : this(model, new TSF.UmlCanvas.Diagram())
    {
      this.wrappedDiagram.setName(name);
    }

    public int height {
      get { return this._height; }
      set { this.height = value < 1000 ? value : 999; }
    }
    
    public int width {
      get { return this._width; }
      set { this._width = value < 1000 ? value : 999; }
    }

    public string ADL {
      get { return this.wrappedDiagram.ToString(); }
    }

    public override HashSet<UML.Classes.Kernel.Element> ownedElements {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public override HashSet<UML.Classes.Kernel.Comment> ownedComments {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public override UML.Classes.Kernel.Element owner {
      get { return this; }
      set { throw new NotImplementedException(); }
    }

    public override HashSet<UML.Profiles.Stereotype> stereotypes {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    } 

    internal override void saveElement() {
      throw new NotImplementedException();
    }

    public HashSet<UML.Diagrams.DiagramElement> diagramElements {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public List<UML.Classes.Kernel.Element> elements {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public HashSet<UML.Diagrams.DiagramElement> getDiagramElements<T>() 
      where T : UML.Classes.Kernel.Element
    {
      throw new NotImplementedException();
    }

    public string comment { get; set; }
  }
}
