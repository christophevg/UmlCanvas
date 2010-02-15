using System;
using System.Collections.Generic;

using UML = TSF.UmlToolingFramework.UML;

namespace TSF.UmlCanvas.UTF {
  public class Abstraction : Element,
                             UML.Diagrams.DiagramElement 
  {
    private UML.Classes.Kernel.Element _owner    { get; set; }
    private ConstructWrapper           _specific { get; set; }
    private UML.Classes.Kernel.Element _general  { get; set; }

    public Abstraction(Model model, Element owner) : base(model) {
      this._owner = owner;
    }

    public override HashSet<UML.Classes.Kernel.Element> ownedElements {
      get { return new HashSet<UML.Classes.Kernel.Element>(); }
      set { /* do nothing, no owned elements */ }
    }

    public override HashSet<UML.Classes.Kernel.Comment> ownedComments {
      get { return new HashSet<UML.Classes.Kernel.Comment>(); }
      set { /* do nothing, no comments for generalization */ }
    }

    public override UML.Classes.Kernel.Element owner {
      get { return this._owner; }
      set { this._owner = value as Element; }
    }

    public override
    HashSet<UML.Profiles.Stereotype> stereotypes {
      get { return new HashSet<UML.Profiles.Stereotype>(); }
      set { /*do nothing, not stereotypes for generalization */  }
    }

    internal override void saveElement() {
      //do nothing, saved with source
    }

    public bool isSubstitutable {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }
    
    public UML.Classes.Kernel.Classifier general {
      get { return this.target as UML.Classes.Kernel.Classifier; }
      set { this.target = value; } 
    }
      
    public UML.Classes.Kernel.Classifier specific { 
      get { return this.source as UML.Classes.Kernel.Classifier; }
      set { this.source = value; } 
    }
      
    public UML.Classes.Kernel.Element target { 
      get { return this._general; } 
      set { 
        this._general = value as Element; 
        if (this._specific != null) { 
          // TODO check if already added, otherwise do nothing
          this._specific.wrappedConstruct.addSuper(this.general.name); 
        }
      } 
    }
      
    public UML.Classes.Kernel.Element source { 
      get { return this._specific; } 
      set { 
        this._specific = value as ConstructWrapper; 
        if( this._general != null ) {
          this._specific.wrappedConstruct.addSuper(this.general.name); 
        }
      }
    }
      
    public List<UML.Classes.Kernel.Element> relatedElements { 
      get { 
        List<UML.Classes.Kernel.Element> elements = 
          new List<UML.Classes.Kernel.Element>();
        elements.Add(this.general);
        elements.Add(this.specific); 
        return elements; 
      } 
      set { throw new NotImplementedException(); } 
    }

    public UML.Classes.Kernel.Element element { 
      get { return this; } 
      set { /* do nothing */ } 
    }

    public int xPosition { 
      get { return 0; } 
      set { /* do nothing */ } 
    }

    public int yPosition { 
      get { return 0; } 
      set { /* do nothing */ } 
    } 

    public UML.Classes.Interfaces.Interface contract { 
      get { return this.target as UML.Classes.Interfaces.Interface; } 
      set { this.target = value; } 
    }

    public UML.Classes.Interfaces.BehavioredClassifier implementingClassifier{ 
      get {return this.source as UML.Classes.Interfaces.BehavioredClassifier;} 
      set { this.source = value; } 
    }

    public UML.Classes.Kernel.OpaqueExpression mapping { 
      get { throw new NotImplementedException(); } 
      set { throw new NotImplementedException(); }
    }

    public UML.Classes.Kernel.NamedElement client { 
      get { throw new NotImplementedException(); } 
      set { throw new NotImplementedException(); } 
    }

    public UML.Classes.Kernel.NamedElement supplier { 
      get { throw new NotImplementedException(); } 
      set { throw new NotImplementedException(); }
    }

    public String name { 
      get { throw new NotImplementedException(); } 
      set { throw new NotImplementedException(); } 
    }

    public UML.Classes.Kernel.VisibilityKind visibility { 
      get { throw new NotImplementedException(); } 
      set { throw new NotImplementedException(); }
    }

    public String qualifiedName { 
      get { throw new NotImplementedException(); } 
      set { throw new NotImplementedException(); }
    }

    public UML.Classes.Kernel.Namespace owningNamespace { 
      get { throw new NotImplementedException(); } 
      set { throw new NotImplementedException(); }
    }

    public List<UML.Classes.Dependencies.Dependency> clientDependencies { 
      get { throw new NotImplementedException(); } 
      set { throw new NotImplementedException(); } 
    }

    public List<UML.Classes.Dependencies.Dependency> supplierDependencies { 
      get { throw new NotImplementedException(); } 
      set { throw new NotImplementedException(); } 
    }
  }
}
