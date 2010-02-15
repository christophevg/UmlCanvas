using System;
using System.Collections.Generic;

using UML = TSF.UmlToolingFramework.UML;
using ADL = TSF.ADL;
using TSF.UmlCanvas;

namespace TSF.UmlCanvas.UTF {
  public class Dependency : RelationWrapper, 
                            UML.Classes.Dependencies.Dependency
  {
    internal TSF.UmlCanvas.Dependency wrappedDependency {
      get { return this.wrappedRelation as TSF.UmlCanvas.Dependency; }
      set { this.wrappedRelation = value; }
    }

    public Dependency(Model model, TSF.UmlCanvas.Dependency dependency)
      : base(model, dependency)
    {}

    public UML.Classes.Kernel.NamedElement client {
      get { 
        return this.model.factory.createElement(this.wrappedDependency.client) 
          as UML.Classes.Kernel.NamedElement;
      }
      set {
        if(value is ConstructWrapper) {
          this.wrappedDependency.client = 
            ((ConstructWrapper)value).wrappedConstruct as TSF.UmlCanvas.Class;
        }
      }
    }

    public UML.Classes.Kernel.NamedElement supplier {
      get {
        return this.model.factory.createElement
          (this.wrappedDependency.supplier) 
            as UML.Classes.Kernel.NamedElement;
      }
      set {
        if(value is ConstructWrapper) {
          this.wrappedDependency.supplier = 
            ((ConstructWrapper)value).wrappedConstruct as TSF.UmlCanvas.Class;
        }
      }
    }

    public UML.Classes.Kernel.Element target {
      get { return this.supplier; }
      set { this.supplier = value as UML.Classes.Kernel.NamedElement; }
    }

    public UML.Classes.Kernel.Element source {
      get { return this.client; }
      set { this.client = value as UML.Classes.Kernel.NamedElement; }
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
