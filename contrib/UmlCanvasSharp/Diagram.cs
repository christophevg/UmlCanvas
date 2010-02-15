using System;
using TSF.ADL;

namespace TSF.UmlCanvas {
  public class Diagram : Construct {
    private Boolean dynamic = false;

    public Diagram() {
      this.setType( "Diagram" );
      this.setName( "NewDiagram" );
    }
    
    public void add( Positionable item ) {
      this.addChild( item );
    }
    
    public void add( Relation relation ) {
      this.addChild( relation );
    }

    public void makeDynamic() {
      this.dynamic = true;
    }
    
    public void makeStatic() {
      this.dynamic = false;
    }
    
    public override void prepare() {
      base.prepare();
      if( this.dynamic ) {
        this.addModifier( new Modifier("dynamic") );
      }
    }
  }
}
