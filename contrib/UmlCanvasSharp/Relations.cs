using System;
using TSF.ADL;

namespace TSF.UmlCanvas {
  public class Role : Construct {
    private Class target;

    public Boolean isNavigable { get; set; }

    private Boolean _isShared { get; set; }
    public Boolean isShared {
      get { return this._isShared; }
      set { 
        this._isShared = value;
        if( value ) {
          this._isComposite = false;
        }
      }
    }

    private Boolean _isComposite { get; set; }
    public Boolean isComposite {
      get { return this._isComposite; }
      set { 
        this._isComposite = value; 
        if( value ) {
          this._isShared = false;
        }
      }
    }
    
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
    }

    public void makeComposite() {
      this.isComposite = true;
    }

    public override void prepare() {
      base.prepare();
      if( this.getName() == null ) {
        this.setName( this.target.getName() );
      }
      if( this.target != null ) {
        this.supers.Clear();
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
    public Class client { get; set; }
    public String clientRoleName { get; set; }
    public Class supplier { get; set; }
    public String supplierRoleName { get; set; }
    
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
      base.prepare();
      this.children.Clear();
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
