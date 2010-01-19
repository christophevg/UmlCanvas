using System;
using TSF.ADL;

namespace TSF.UmlCanvas {
  public class Role : Construct {
    private Class target;
    private Boolean isNavigable;
    private Boolean isShared;
    private Boolean isComposite;
    
    public Role() {
      this.setType( "Role" );
    }

    public Role( Class target ) : this() {
      this.setTarget( target );
    }

    public Role( Class target, String roleName ) : this(target) {
      this.setName( roleName );
    }
    
    public void setTarget( Class target ) {
      this.target = target;
    }
    
    public void makeNavigable() {
      this.isNavigable = true;
    }
    
    public void makeShared() {
      this.isShared = true;
      this.isComposite = false;
    }

    public void makeComposite() {
      this.isShared = false;
      this.isComposite = true;
    }

    public override void prepare() {
      if( this.getName() == null ) {
        this.setName( this.target.getName() );
      }
      if( this.target != null ) {
        this.addSuper( this.target.getName() ); 
      }
      if( this.isShared ) {
        this.addModifier( new Modifier( "shared" ) );
      }
      if( this.isComposite ) {
        this.addModifier( new Modifier( "composite" ) );
      }
      if( this.isNavigable ) {
        this.addModifier( new Modifier( "navigable" ) );
      }
    }
  }

  public class Relation : Construct {}

  public class Association : Relation {
    public Association() {
      this.setType( "Association" );
      this.setName( "NewAssociation" );
    }
    
    public void add( Role role ) {
      this.addChild( role );
    }
  }

  public class Dependency : Relation {
    private Class client;
    private String clientRoleName;
    private Class supplier;
    private String supplierRoleName;
    
    public Dependency() {
      this.setType( "Dependency" );
      this.setName( "NewDependency" );
    }
    
    public void setClient( Class clazz ) {
      this.client = clazz;
    }

    public void setClient( Class clazz, String roleName ) {
      this.setClient( clazz );
      this.clientRoleName = roleName;
    }
    
    public void setSupplier( Class clazz ) {
      this.supplier = clazz;
    }

    public void setSupplier ( Class clazz, String roleName ) {
      this.setSupplier( clazz );
      this.supplierRoleName = roleName;
    }
    
    public override void prepare() {
      if( this.client != null ) {
        Role clientRole = new Role( this.client );
        clientRole.setType( "client" );
        if( this.clientRoleName != null ) {
          clientRole.setName( this.clientRoleName );
        }
        this.addChild( clientRole );
      }
      if( this.supplier != null ) {
        Role supplierRole = new Role( this.supplier );
        supplierRole.setType( "supplier" );
        if( this.supplierRoleName != null ) {
          supplierRole.setName( this.supplierRoleName );
        }
        this.addChild( supplierRole );  
      }
    }
  }
}
