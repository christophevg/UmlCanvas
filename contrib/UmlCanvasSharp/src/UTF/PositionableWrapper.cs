using System;
using System.Collections.Generic;

using TSF.UmlToolingFramework;
using TSF.UmlCanvas;
using TSF.ADL;

namespace TSF.UmlCanvas.UTF {
  public abstract class PositionableWrapper : DiagramElement {
    internal Positionable wrappedPositionable {
      get { return this.wrappedConstruct as Positionable; }
      set { this.wrappedConstruct = value; }
    }

    public PositionableWrapper(Model model, Positionable construct)
      : base(model, construct)
    {}

    public override int xPosition {
      get {
        // TODO add getter in Positionable
        if( this.wrappedPositionable.x != null ) {
          return (int)this.wrappedPositionable.x;
        } else {
          return 0;
        }
      }
      set { this.wrappedPositionable.x = value; }
    }

    public override int yPosition {
      get {
        if( this.wrappedPositionable.y != null ) {
          return (int)this.wrappedPositionable.y;
        } else {
          return 0;
        }
      }
      set { this.wrappedPositionable.y = value; }
    }
  }
}
