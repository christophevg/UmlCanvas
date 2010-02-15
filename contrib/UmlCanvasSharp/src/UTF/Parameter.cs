using System;
using System.Collections.Generic;

using UML = TSF.UmlToolingFramework.UML;
using ADL = TSF.ADL;
using TSF.UmlCanvas;

namespace TSF.UmlCanvas.UTF {
  public class Parameter: ConstructWrapper, UML.Classes.Kernel.Parameter {
    internal Operation owningOperation { get; set; }
    
    internal Element _type { get; set; }

    private UML.Classes.Kernel.ParameterDirectionKind _direction { get; set; }

    internal Argument wrappedArgument {
      get { return this.wrappedConstruct as Argument; }
      set { this.wrappedConstruct = value; }
    }

    public Parameter( Model model, Argument argument )
      : base(model, argument)
    {}

    public override String name {
      get { return this.wrappedArgument.name; }
      set { this.wrappedArgument.name = value; }
    }

    public override UML.Classes.Kernel.Element owner {
      get { return this.owningOperation; }
      set { this.owningOperation = value as Operation; }
    }

    internal override void saveElement() {
      // do nothing
    }

    public UML.Classes.Kernel.ParameterDirectionKind direction {
      get { return this._direction; }
      set {
        // if set to return then the Argument should be removed from the
        // owning operation
        // if set to something else then an Argument should be added.
        if( this._direction == 
              UML.Classes.Kernel.ParameterDirectionKind._return
            && value != UML.Classes.Kernel.ParameterDirectionKind._return )
        {
          // add argument
          this.owningOperation.wrappedOperation.addChild
            (this.wrappedArgument);
          // and remove the returntype from the wrapped operation
          this.owningOperation.wrappedOperation.setReturnType(string.Empty);
        } else if( this._direction != 
                     UML.Classes.Kernel.ParameterDirectionKind._return
                   && value == 
                     UML.Classes.Kernel.ParameterDirectionKind._return )
        {
          // remove the argument
          owningOperation.wrappedOperation.children.Remove
            (this.wrappedArgument);
          // add the returntype to the wrapped operation
          if( this.type is Class && this.type is Interface) {
            owningOperation.wrappedOperation.setReturnType
              (((ConstructWrapper)this.type).wrappedConstruct as 
                TSF.UmlCanvas.Class);
          } else {
            owningOperation.wrappedOperation.setReturnType(this.type.name);
          }
        }
        this._direction = value;
      }
    }

    public string _default {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public UML.Classes.Kernel.ValueSpecification defaultValue {
      get { throw new NotImplementedException(); }
      set { throw new NotImplementedException(); }
    }

    public UML.Classes.Kernel.Operation operation {
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

    public UML.Classes.Kernel.Type type {
      get { return this._type as UML.Classes.Kernel.Type; }
      set {
        this._type = value as Element;
        this.wrappedArgument.setType(value.name);
      }
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
