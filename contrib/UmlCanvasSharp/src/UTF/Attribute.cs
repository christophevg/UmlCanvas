using System;
using System.Collections.Generic;

using UML = TSF.UmlToolingFramework.UML;
using ADL = TSF.ADL;
using TSF.UmlCanvas;

namespace TSF.UmlCanvas.UTF {
    public class Attribute : ConstructWrapper, UML.Classes.Kernel.Property {
    internal ConstructWrapper _owner { get; set; }
    
    private UML.Classes.Kernel.Type _type { get; set; }
    
    public Attribute(Model model, TSF.UmlCanvas.Attribute attribute)
      : base(model, attribute)
    {}

    internal TSF.UmlCanvas.Attribute wrappedAttribute {
      get { return this.wrappedConstruct as TSF.UmlCanvas.Attribute; }
      set { this.wrappedConstruct = value; }
    }

    public override UML.Classes.Kernel.Element owner {
      get { return this._owner; }
      set { this._owner = value as ConstructWrapper; }
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
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public string _default {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public UML.Classes.Kernel.AggregationKind aggregation {
      // AggregationKind doesn't mean anything for Attributes.
      // standard at none
      get { return UML.Classes.Kernel.AggregationKind.none; }
      set { /* do nothing */ }
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
      return this._isNavigable;
    }

    public bool _isNavigable {
      // navigability doesn't mean anything for attributes.
      // standard return true
      get { return true; }
      set { /* do nothing */ }
    }

    public bool isReadOnly {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public bool isStatic {
      get { return this.wrappedAttribute.isStatic;  }
      set { this.wrappedAttribute.isStatic = value; }
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
        return Visibility.getVisibility(this.wrappedAttribute.visibility);
      }
      set { 
        this.wrappedAttribute.visibility = Visibility.getVisibility(value);
      }
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
      get {
        if( this._type == null 
            || this.wrappedAttribute.superType != this._type.name )
        {
          // type not found, only name. Create primitive for typename
          this._type = this.model.factory.createPrimitiveType
            (this.wrappedAttribute.superType);
        }
        return this._type;
      }
      set {
        this._type = value;
        this.wrappedAttribute.superType = value.name;
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
  }
}
