using System;
using TSF.ADL;

namespace TSF.UmlCanvas {
  public class Note : Positionable {
    public String text   { get; set; }
    public Class  target { get; set; }
    
    public Note() {
      this.setType( "Note" );
      this.setName( "NewNote" );
    }
    
    public void setText(String text) {
      this.text = text;
    }
    
    public void linkTo(Class target) {
      this.target = target;
    }

    public override void prepare() {
      base.prepare();
      if( this.text != null ) {
        this.addModifier( new Modifier( "text", this.text ) );
      }
      if( this.target != null ) {
        this.addModifier( new Modifier( "linkedTo", this.target.getName() ) );
      }
    }
  }
}
