using System;
using System.Collections.Generic;

using UML = TSF.UmlToolingFramework.UML;
using TSF.UmlCanvas;

namespace TSF.UmlCanvas.UTF {
  public class Operation : ConstructWrapper, UML.Classes.Kernel.Operation {
    internal ConstructWrapper _owner { get; set; }

    public Operation( Model model, TSF.UmlCanvas.Operation operation) 
      : base(model,operation)
    {}

    internal TSF.UmlCanvas.Operation wrappedOperation {
      get { return this.wrappedConstruct as TSF.UmlCanvas.Operation; }
      set { this.wrappedConstruct = value; }
    }

    public override UML.Classes.Kernel.Element owner {
      get { return this._owner; }
      set { this._owner = value as ConstructWrapper; }
    }

    internal override void saveElement() {
      throw new NotImplementedException();
    }

    public bool isQuery {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public bool isOrdered {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public bool isUnique {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public int lower {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public UML.Classes.Kernel.UnlimitedNatural upper {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public UML.Classes.Kernel.Type type {
      get {
        // TODO figure out how to get the returntype
        // Should be the type of the parameter with directionkind return
        foreach( UML.Classes.Kernel.Parameter parameter 
                 in this.ownedParameters )
        {
          if( parameter.direction == 
              UML.Classes.Kernel.ParameterDirectionKind._return)
          {
            return parameter.type;
          }
        }
        // if no return parameter found then return null
        return null;
      }
      set {
        UML.Classes.Kernel.Parameter returnParameter = 
          this.addOwnedElement<UML.Classes.Kernel.Parameter>(value.name);
        returnParameter.type = value;
      }
    }

    public HashSet<UML.Classes.Kernel.Operation> redefinedOperations {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public UML.Classes.Kernel.Constraint bodyCondition {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public HashSet<UML.Classes.Kernel.Constraint> postcondition {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public HashSet<UML.Classes.Kernel.Constraint> precondition {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public UML.Classes.Interfaces.Interface _interface {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public HashSet<UML.Classes.Kernel.Type> raisedExceptions {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public HashSet<UML.Classes.Kernel.Parameter> ownedParameters {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public bool isStatic {
      get { return this.wrappedOperation.isStatic; }
      set { this.wrappedOperation.isStatic = value; }
    }

    public HashSet<UML.Classes.Kernel.Classifier> featuringClassifiers {
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
      get {
        return Visibility.getVisibility(this.wrappedOperation.visibility);
      }
      set {
        this.wrappedOperation.visibility = Visibility.getVisibility(value);
      }
    }

    public string qualifiedName {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public UML.Classes.Kernel.Namespace owningNamespace {
      get { return this._owner as UML.Classes.Kernel.Namespace; }
      set { this._owner = value as ConstructWrapper; }
    }

    public List<UML.Classes.Dependencies.Dependency> clientDependencies {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public List<UML.Classes.Dependencies.Dependency> supplierDependencies {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public bool isAbstract {
      get { return this.wrappedOperation.isAbstract; }
      set { this.wrappedOperation.isAbstract = value; }
    }
  }
}
