using System;
using TSF.ADL;

namespace TSF.UmlCanvas {
  public class Attribute : Construct {
    String superType;
    String visibility;
    Boolean isStatic;
        
    public Attribute() {
      base.setType( "Attribute" );
      this.setName( "NewAttribute" );
    }

    public new void setType(String type) {
      this.superType = type;
    }
    
    public void setType(Class type ) {
      this.setType( type.getName() );
    }
    
    public void setVisibility(String visibility) {
      this.visibility = visibility;
    }
    
    public void makeStatic() {
      this.isStatic = true;
    }
    
    public override  void prepare() {
      if( this.superType != null ) {
        this.addSuper( this.superType );
      }

      if( this.isStatic ) {
        this.addModifier( new Modifier( "static" ) );
      }

      if( this.visibility != null ) {
        this.addModifier( new Modifier( this.visibility ) );
      }
    }
  }
}
