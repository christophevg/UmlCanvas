using System;
using System.Collections.Generic;

using UML = TSF.UmlToolingFramework.UML;
using ADL = TSF.ADL;
using TSF.UmlCanvas;

namespace TSF.UmlCanvas.UTF {
  public abstract class ConstructWrapper : Element {
    internal ADL.Construct wrappedConstruct { get; set; }
    
    public ConstructWrapper(Model model, ADL.Construct construct) 
      : base(model) 
    {
      this.wrappedConstruct = construct;
    }

    public ConstructWrapper(Model model) : base(model) {}

    public override HashSet<UML.Classes.Kernel.Element> ownedElements {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public override HashSet<UML.Classes.Kernel.Comment> ownedComments {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public override HashSet<UML.Profiles.Stereotype> stereotypes {
      get {
        HashSet<UML.Profiles.Stereotype> returnStereotypes = 
          new HashSet<UML.Profiles.Stereotype>();
        foreach( ADL.Modifier modifier in this.wrappedConstruct.modifiers ) {
          //only one modifier will have the stereotype key
          if( modifier.key == "stereotype" ) {
            return ((Factory)this.model.factory).createStereotypes
              (this,modifier.value);
          }
        }
        // no stereotypes found, return the empty collection
        return returnStereotypes;
      }
      set {
        // first remove the stereotypes
        for( int i = this.wrappedConstruct.modifiers.Count -1;i>= 0;i-- ) {
          if( this.wrappedConstruct.modifiers[i].key == "stereotype" ) {
            this.wrappedConstruct.modifiers.RemoveAt(i);
          }
        }
        if( value.Count > 0 ) {
          String combinedStereotypes = String.Empty;
          // then add the new stereotypes
          foreach( UML.Profiles.Stereotype stereotype in value ) {
            //concatenate all stereotype names with commas separating them
            if( combinedStereotypes != string.Empty ) {
                combinedStereotypes += ",";
            }
            combinedStereotypes += stereotype.name;
          }
          this.wrappedConstruct.addModifier(new ADL.Modifier("stereotype", 
                                                        combinedStereotypes));
        }
      }
    }

    public virtual string name {
      get { return this.wrappedConstruct.name; }
      set { 
        if (value == string.Empty)  {
          this.wrappedConstruct.name = null;
        } else {
          this.wrappedConstruct.name = value;
        }
      }
    }


    internal T addOwnedElement<T>(String name) 
      where T: class, UML.Classes.Kernel.Element 
    {
      System.Type type = typeof(T);
      ADL.Construct newConstruct = null;
      if( type == typeof(UML.Classes.Kernel.Class) ) {
        newConstruct = new TSF.UmlCanvas.Class();
      } else if( type == typeof(UML.Classes.Interfaces.Interface) ) {
        newConstruct = new TSF.UmlCanvas.Interface();
      } else if( type == typeof(UML.Classes.Kernel.Generalization) ) {
        return ((Factory)this.model.factory).createNewGeneralization(this) 
          as T;
      } else if( type == typeof(UML.Classes.Interfaces.InterfaceRealization)){
        return ((Factory)this.model.factory).createInterfaceRealization(this) 
          as T;
      } else if( type == typeof(UML.Classes.Kernel.Parameter) ) {
        newConstruct = new TSF.UmlCanvas.Argument();
      } else if( type == typeof(UML.Classes.Kernel.Operation) ) {
        newConstruct = new TSF.UmlCanvas.Operation();
      } else if( type == typeof(UML.Classes.Kernel.Property) ) {
        newConstruct = this.createNewProperty();
      } else if( type == typeof(UML.Classes.Kernel.Association) ) {
        newConstruct = new TSF.UmlCanvas.Association();
      } else if( type == typeof(UML.Classes.Dependencies.Dependency) ) {
        newConstruct = new TSF.UmlCanvas.Dependency();
      } else if( type == typeof(UML.Classes.Kernel.Comment) ) {
        newConstruct = new TSF.UmlCanvas.Note();
      }
      newConstruct.setName(name);
      this.wrappedConstruct.addChild(newConstruct);
      Element returnedElement =
        ((Factory)this.model.factory).createElement(newConstruct,this) ;
      //set the name of the construct
      if (returnedElement is ConstructWrapper) {
        ((ConstructWrapper)returnedElement).name = name;
      }
      return returnedElement as T;
    }

    protected virtual ADL.Construct createNewProperty() {
      //standard implementation is to create a new attribute.
      return new TSF.UmlCanvas.Attribute();
    }
  }
}
