using System;
using System.Collections.Generic;
using System.Linq;

using UML = TSF.UmlToolingFramework.UML;
using ADL = TSF.ADL;
using TSF.UmlCanvas;

namespace TSF.UmlCanvas.UTF {

  public class Association 
    : RelationWrapper, UmlToolingFramework.UML.Classes.Kernel.Association
  {
    internal TSF.UmlCanvas.Association wrappedAssociation {
      get { return this.wrappedRelation as TSF.UmlCanvas.Association; }
      set { this.wrappedRelation = value; }
    }

    internal List<RoleWrapper> _memberEnds { get; set; }

    public Association(Model model, TSF.UmlCanvas.Association association)
    : base(model, association)
    {}

    protected override ADL.Construct createNewProperty() {
      return new TSF.UmlCanvas.Role();
    }

    internal override void saveElement() {
      throw new NotImplementedException();
    }

    public bool isDerived {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public List<UML.Classes.Kernel.Property> navigableOwnedEnds {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public List<UML.Classes.Kernel.Property> ownedEnds {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public List<UML.Classes.Kernel.Type> endTypes {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public List<UML.Classes.Kernel.Property> memberEnds {
      get {
        return this.model.factory
        .createElements(this.wrappedAssociation.children)
        .Cast<UML.Classes.Kernel.Property>().ToList();
      }
      set {
        //clear the existing roles
        this.wrappedAssociation.children.Clear();
        //add the new roles
        foreach( RoleWrapper role in value.Cast<RoleWrapper>().ToList() ) {
          this.wrappedAssociation.children.Add(role.wrappedRole);
        }
      }
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

    public HashSet<UML.Classes.Kernel.RedefinableElement>
    redefinedElements 
    {
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
