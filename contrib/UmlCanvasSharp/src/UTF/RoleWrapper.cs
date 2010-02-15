using System;
using System.Collections.Generic;

using UML = TSF.UmlToolingFramework.UML;
using TSF.UmlCanvas;

namespace TSF.UmlCanvas.UTF {
  public class RoleWrapper: ConstructWrapper, UML.Classes.Kernel.Property {

    internal Role wrappedRole {
      get { return this.wrappedConstruct as Role; }
      set { this.wrappedConstruct = value; }
    }

    internal RelationWrapper owningRelation { get; set; }

    public RoleWrapper(Model model, Role associationEnd )
      : base(model, associationEnd) 
    {}

    public override UML.Classes.Kernel.Element owner {
      get { return this.owningRelation; }
      set { this.owningRelation = value as RelationWrapper; }
    }

    internal override void saveElement() {
      throw new NotImplementedException();
    }

    public bool isDerived {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public bool isDerivedUnion {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public bool isComposite {
      get { return this.wrappedRole.isComposite;  }
      set { this.wrappedRole.isComposite = value; }
    }

    public string _default {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public UML.Classes.Kernel.AggregationKind aggregation {
      get {
        if (this.wrappedRole.isComposite) {
          return UML.Classes.Kernel.AggregationKind.composite;
        } else if (this.wrappedRole.isShared) {
          return UML.Classes.Kernel.AggregationKind.shared;
        } else {
          return UML.Classes.Kernel.AggregationKind.none;
        }
      }
      set {
        switch (value) {
          case UML.Classes.Kernel.AggregationKind.composite:
            this.wrappedRole.isComposite = true;
            break;
          case UML.Classes.Kernel.AggregationKind.shared:
            this.wrappedRole.isShared = true;
            break;
          default:
            this.wrappedRole.isComposite = false;
            this.wrappedRole.isShared = false;
            break;
        }
      }
    }

    public UML.Classes.Kernel.ValueSpecification defaultValue {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public HashSet<UML.Classes.Kernel.Property> redefinedProperties {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public HashSet<UML.Classes.Kernel.Property> subsettedProperties {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public UML.Classes.Kernel.Property opposite {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public UML.Classes.Kernel.Classifier classifier {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public UML.Classes.Kernel.Class _class {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public UML.Classes.Kernel.Association owningAssociation {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public UML.Classes.Kernel.Association association {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public UML.Classes.Kernel.DataType datatype {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public bool isNavigable() {
      throw new NotImplementedException();
    }

    public bool isReadOnly {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    /// isStatic is not supported by UmlCanvas roles
    public bool isStatic {
      get { return false; }
      set { /* do nothing */ }
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
      // Roles in UMLCanvas don't have visibility
      // return standard public
      get { return UML.Classes.Kernel.VisibilityKind._public; }
      set { /* do nothing */ }
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

    public UML.Classes.Kernel.Type type {
      get { throw new NotImplementedException(); }
      set {
        this.wrappedRole.setTarget
          ( ((ConstructWrapper)value).wrappedConstruct as 
            TSF.UmlCanvas.Class);
      }
    }

    public bool isOrdered {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public bool isUnique {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public UML.Classes.Kernel.UnlimitedNatural upper {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public int lower {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public UML.Classes.Kernel.ValueSpecification upperValue {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public UML.Classes.Kernel.ValueSpecification lowerValue {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public bool _isNavigable {
      get { return this.wrappedRole.isNavigable;  }
      set { this.wrappedRole.isNavigable = value; }
    }
  }
}
