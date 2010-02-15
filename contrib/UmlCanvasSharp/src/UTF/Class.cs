using System;
using System.Collections.Generic;

using UML = TSF.UmlToolingFramework.UML;
using TSF.UmlCanvas;

namespace TSF.UmlCanvas.UTF {
  public class Class : PositionableWrapper, UML.Classes.Kernel.Class {
    internal Class(Model model, TSF.UmlCanvas.Class _class) 
      : base(model,_class)
    {}

    internal TSF.UmlCanvas.Class wrappedClass {
      get { return this.wrappedConstruct as TSF.UmlCanvas.Class; }
      set { this.wrappedConstruct = value; }
    }

    public HashSet<UML.Classes.Kernel.Property> ownedAttributes {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public HashSet<UML.Classes.Kernel.Classifier> nestedClassifiers {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public HashSet<UML.Classes.Kernel.Operation> ownedOperations {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public HashSet<UML.Classes.Kernel.Class> superClasses {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public bool isAbstract {
      get { return this.wrappedClass.isAbstract; }
      set { this.wrappedClass.isAbstract = value; }
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

    public HashSet<UML.Classes.Kernel.RedefinableElement> redefinedElements{
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
