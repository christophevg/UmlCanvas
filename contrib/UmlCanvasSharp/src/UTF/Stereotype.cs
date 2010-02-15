using System;
using System.Collections.Generic;

using UML = TSF.UmlToolingFramework.UML;

namespace TSF.UmlCanvas.UTF {
  public class Stereotype:  Element, UML.Profiles.Stereotype {
    private Element _owner { get; set; }

    public Stereotype(Model model, Element owner, String name) : base(model) {
      this._owner = owner;
      this.name = name;
    }

    public override HashSet<UML.Classes.Kernel.Element> ownedElements {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public override HashSet<UML.Classes.Kernel.Comment> ownedComments {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public override UML.Classes.Kernel.Element owner {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public override HashSet<UML.Profiles.Stereotype> stereotypes {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    internal override void saveElement() { /* do nothing */ }

    public String name { get; set; }

    public UML.Classes.Kernel.VisibilityKind visibility {
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

    public override bool Equals(object obj) {
      Stereotype comparedStereotype = obj as Stereotype;
      return comparedStereotype != null 
             && comparedStereotype.name == this.name;
    }

    public override int GetHashCode() {
      return this.name.GetHashCode();
    }
  }
}
