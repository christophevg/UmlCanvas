using System;
using System.Collections.Generic;
using System.Linq;

using UML = TSF.UmlToolingFramework.UML;
using TSF.UmlCanvas;

namespace TSF.UmlCanvas.UTF {
  public class Comment : PositionableWrapper, UML.Classes.Kernel.Comment {
    private static int nameCounter = 0;

    internal Note wrappedNote {
      get { return this.wrappedConstruct as Note; }
      set { this.wrappedConstruct = value; }
    }

    public Comment(Model model, Note note) : base(model, note) {}

    public string body {
      get { return this.wrappedNote.text; }
      set { 
        this.wrappedNote.text = value.Replace(Environment.NewLine, @"\n");  
      }
    }

    public HashSet<UML.Classes.Kernel.Element> annotatedElements {
      get { 
        HashSet<UML.Classes.Kernel.Element> returnedElements = 
        new HashSet<UML.Classes.Kernel.Element>();
        returnedElements.Add
        (this.model.factory.createElement(this.wrappedNote.target));
        return returnedElements;
      }
      set {
        // In UMlCanvas there can only be one annotated element, 
        // so we take the first
        if( value.Count > 0 ) {
          if( value.First() is ConstructWrapper ) {
            this.wrappedNote.target =
            ((ConstructWrapper)value.First()).wrappedConstruct 
            as TSF.UmlCanvas.Class;
          }
        }
      }
    }

    public override String name {
      get { return base.name; }
      set {
        if( value == String.Empty ) {
          base.name = "n" + (Comment.nameCounter++).ToString();
        } else {
          base.name = value;
        }
      }
    }
  }
}
