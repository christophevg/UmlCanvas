using System;
using System.Collections.Generic;

using UML = TSF.UmlToolingFramework.UML;
using TSF.UmlCanvas;

namespace TSF.UmlCanvas.UTF {
  public class Interface : PositionableWrapper, 
                           UML.Classes.Interfaces.Interface
  {
    internal TSF.UmlCanvas.Interface wrappedInterface { get; set; }
      
    internal Interface(Model model, TSF.UmlCanvas.Interface _interface)
      : base(model,_interface)
    {
      this.wrappedInterface = _interface;
    }

    public HashSet<UML.Classes.Kernel.Classifier> nestedClassifiers {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public List<UML.Classes.Interfaces.InterfaceRealization>
           InterfaceRealizations 
    {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public HashSet<UML.Classes.Kernel.Operation> ownedOperations {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public List<UML.Classes.Interfaces.Interface> redefinedInterface {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public HashSet<UML.Classes.Kernel.Property> ownedAttributes {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public bool isAbstract {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public HashSet<UML.Classes.Kernel.Generalization> generalizations {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public HashSet<UML.Classes.Kernel.Property> attributes {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public HashSet<UML.Classes.Kernel.Feature> features {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public HashSet<UML.Classes.Dependencies.Substitution> substitutions {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public bool isLeaf {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public HashSet<UML.Classes.Kernel.RedefinableElement> redefinedElements {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public HashSet<UML.Classes.Kernel.Classifier> redefinitionContexts {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }


    public UML.Classes.Kernel.VisibilityKind visibility {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public string qualifiedName {
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
