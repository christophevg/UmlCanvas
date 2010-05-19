using System;
using System.Collections.Generic;

using UML = TSF.UmlToolingFramework.UML;
using Hosted = TSF.UmlCanvas.Hosted;
using TSF.UmlCanvas;

namespace TSF.UmlCanvas.UTF {
  public class Model : UML.UMLModel  {
    internal Diagram _selectedDiagram { get; set; }
    
    public String author   { get; set; }
    public String password { get; set; }

    // returns the current model
    public static Model getModel(){
        return Factory.getInstance().model as Model;
    }
    
    public Diagram cloneDiagram(UML.Diagrams.Diagram sourceDiagram)
    {
        return ((Factory)this.factory).cloneDiagram(sourceDiagram);
    }   
    public String saveDiagram( Diagram diagram, 
                               string author, string password)
    {
      this.author   = author;
      this.password = password;
      return this.saveDiagram(diagram);
    }

    public String saveDiagram(Diagram diagram) {
      Hosted.Diagram hostedDiagram = new Hosted.Diagram();

      hostedDiagram.id     = diagram.diagramID;
      hostedDiagram.name   = diagram.name;
      hostedDiagram.descr  = diagram.comment;
      hostedDiagram.width  = diagram.width;
      hostedDiagram.height = diagram.height;
      hostedDiagram.src    = diagram.ADL;
      
      return Hosted.Client.save( hostedDiagram, this.author, this.password );
    }

    public UML.Classes.Kernel.Element selectedElement {
      get { throw new NotImplementedException(); }
    }

    public UML.UMLFactory factory {
      get { return Factory.getInstance(this); }
    }

    public UML.Diagrams.Diagram selectedDiagram {
      get { return this._selectedDiagram; }
      set { this._selectedDiagram = value as Diagram; }
    }

    public void saveElement(UML.Classes.Kernel.Element element) {
      throw new NotImplementedException();
    }

    public void saveDiagram(UML.Diagrams.Diagram diagram) {
      throw new NotImplementedException();
    }
  }
}
