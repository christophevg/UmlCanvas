using System;
using System.Collections.Generic;

using UML = TSF.UmlToolingFramework.UML;
using ADL = TSF.ADL;
using TSF.UmlCanvas;

namespace TSF.UmlCanvas.UTF {
  public class Factory : UML.UMLFactory {
    protected Factory(Model model) : base(model) {}

    /// returns the singleton instance for the given model.
    public static Factory getInstance(Model model) {
      Factory factory = UML.UMLFactory.getFactory(model) as Factory;
      if( factory == null ) {
        factory = new Factory(model);
      }
      return factory;
    }

    /// returns the singleton instance for a new model
    public static Factory getInstance() {
      return getInstance(new Model());
    }
    
    internal Element createElement(TSF.ADL.Construct construct,
                                   ConstructWrapper owner)
    {
      Element element = this.createElement(construct) as Element;
      if( element != null ) {
        element.owner = owner;
      }
      return element;
    }

    public override UML.Classes.Kernel.Element createElement
      (Object objectToWrap)
    {
      if( objectToWrap is TSF.UmlCanvas.Interface ) {
        return new Interface( (Model)this.model, 
                              (TSF.UmlCanvas.Interface)objectToWrap );
      } else if( objectToWrap is TSF.UmlCanvas.Class ) {
        return new Class( (Model)this.model, 
                          (TSF.UmlCanvas.Class)objectToWrap );
      } else if( objectToWrap is TSF.UmlCanvas.Diagram ) {
        return new Diagram( (Model)this.model, 
                            (TSF.UmlCanvas.Diagram)objectToWrap );
      } else if( objectToWrap is TSF.UmlCanvas.Operation ) {
        return new Operation( (Model)this.model, 
                              (TSF.UmlCanvas.Operation)objectToWrap );
      } else if( objectToWrap is TSF.UmlCanvas.Argument ) {
        return new Parameter( (Model)this.model, 
                              (TSF.UmlCanvas.Argument)objectToWrap );
      } else if( objectToWrap is TSF.UmlCanvas.Association ) {
        return new Association( (Model)this.model, 
                                (TSF.UmlCanvas.Association)objectToWrap );
      } else if( objectToWrap is TSF.UmlCanvas.Role ) {
        return new RoleWrapper( (Model)this.model, 
                                (TSF.UmlCanvas.Role)objectToWrap );
      } else if (objectToWrap is TSF.UmlCanvas.Attribute) {
        return new Attribute( (Model)this.model, 
                              (TSF.UmlCanvas.Attribute)objectToWrap );
      } else if( objectToWrap is TSF.UmlCanvas.Dependency ){
        return new Dependency( (Model)this.model, 
                               (TSF.UmlCanvas.Dependency)objectToWrap );
      } else if( objectToWrap is TSF.UmlCanvas.Note ) {
        return new Comment( (Model)this.model, 
                            (TSF.UmlCanvas.Note)objectToWrap );
      }

      return null;
    }

    public override UML.Classes.Kernel.PrimitiveType createPrimitiveType
      (Object objectToWrap)
    {
      return new PrimitiveType((Model)this.model, objectToWrap as String);
    }

    public override T createNewElement<T>(UML.Classes.Kernel.Element owner, 
                                          String name)
    {
      if (owner is ConstructWrapper) {
        return ((ConstructWrapper)owner).addOwnedElement<T>(name);
      } else {
        return default(T);
      }
    }
    /// creates a set of stereotypes based on the comma seperated names string 
    /// and attaches it to the given element
    public HashSet<UML.Profiles.Stereotype> createStereotypes
      (UML.Classes.Kernel.Element owner, String names)
    {
      HashSet<UML.Profiles.Stereotype> newStereotypes = 
        new HashSet<UML.Profiles.Stereotype>();
      String[] stereotypeNames = names.Split(',');
      foreach(String name in stereotypeNames) {
        if( name != string.Empty ) {
          UML.Profiles.Stereotype stereotype = 
            this.createStereotype(owner, name);
          if( stereotype != null ) {
            newStereotypes.Add(stereotype);
          }
        }
      }
      return newStereotypes;
    }
    
    public override UML.Profiles.Stereotype createStereotype
      (UML.Classes.Kernel.Element owner, String name)
    {
      return new Stereotype(this.model as Model, owner as Element, name);
    }

    public override UML.Diagrams.Diagram createNewDiagram
      (UML.Classes.Kernel.Element owner, String name)
    {
      return new Diagram(this.model as Model, name);
    }

    public override UML.Diagrams.DiagramElement createNewDiagramElement
      (UML.Diagrams.Diagram owner, UML.Classes.Kernel.Element element)
    {
      return element as UML.Diagrams.DiagramElement;
    }

    public Diagram createNewDiagram(String name)
    {
      return new Diagram(this.model as Model, name);
    }
    
    public Generalization createNewGeneralization
      (UML.Classes.Kernel.Element owner)
    {
      return new Generalization(this.model as Model, owner as Element);
    }

    public InterfaceRealization createInterfaceRealization
      (UML.Classes.Kernel.Element owner)
    {
      return new InterfaceRealization(this.model as Model, owner as Element);
    }

    internal Diagram cloneDiagram(UML.Diagrams.Diagram sourceDiagram)
    {
        Diagram targetDiagram = this.createNewDiagram(sourceDiagram.name);
        return this.cloneDiagram(targetDiagram as UML.Classes.Kernel.Element,sourceDiagram) as Diagram;

    }
  }
}
