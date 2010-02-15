using System;
using System.Collections.Generic;

using UML = TSF.UmlToolingFramework.UML;
using ADL = TSF.ADL;
using TSF.UmlCanvas;

namespace TSF.UmlCanvas.UTF {
  
  public abstract class RelationWrapper : DiagramElement,       
                                          UML.Classes.Kernel.Relationship 
  {
    /// Umlcanvas doesn't like unnamed relations.
    /// If no name is provided the relation gets a dummy name using the 
    /// namecounter to ensure uniqueness
    private static int namecounter = 1;

    internal Relation wrappedRelation {
      get { return this.wrappedConstruct as Relation; }
      set { this.wrappedConstruct = value; }
    }

    internal ConstructWrapper _owner { get; set; }

    public RelationWrapper(Model model, TSF.UmlCanvas.Relation relation)
      : base(model, relation)
    {}

    public override String name {
      get { return base.name; }
      set {
        // UmlCanvas doesn't like relations without a name
        if (value == String.Empty) {
          base.name = "a" + (RelationWrapper.namecounter++).ToString();
        }
      }
    }

    public override UML.Classes.Kernel.Element owner {
      get { return this._owner as UML.Classes.Kernel.Element; }
      set { this._owner = value as ConstructWrapper; }
    }

    public List<UML.Classes.Kernel.Element> relatedElements {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public override int xPosition {
      get { return 0; }
      set { /* do nothing */ }
    }

    public override int yPosition {
      get { return 0; }
      set { /* do nothing */ }
    }
  }
}
