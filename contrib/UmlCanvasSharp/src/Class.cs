using System;
using TSF.ADL;

namespace TSF.UmlCanvas {
  
  public class Positionable : Construct {
    public int? x { get; set; }
    public int? y { get; set; }

    public void setPosition( int x, int y ) {
      this.x = x;
      this.y = y;
    }

    public override void prepare() {
      base.prepare();
      this.annotations.Clear();
      if( this.x != null && this.y != null ) {
        this.addAnnotation( this.x + "," + this.y );
      }
    }
  }
  
  public class Class : Positionable {
    public Boolean isAbstract { get; set; }
    
    public Class() {
      this.setType( "Class" );
      this.setName( "NewClass" );
    }

    public void inheritFrom( Class clazz ) {
      this.addSuper( clazz.getName() );
    }

    public void implement( Interface interfaze ) {
      this.addSuper( interfaze.getName() );
    }

    public void add( Attribute attribute ) {
      this.addChild( attribute );
    }

    public void add( Operation operation ) {
      this.addChild( operation );
    }
    
    public void makeAbstract() {
      this.isAbstract = true;
    }
    
    public void addStereotype( String stereotype ) {
      this.addModifier( new Modifier( "stereotype", stereotype ) );
    }
    
    public override void prepare() {
      base.prepare();
      if( this.isAbstract ) {
        this.addModifier( new Modifier( "abstract" ) );
      }
    }
  }
}
