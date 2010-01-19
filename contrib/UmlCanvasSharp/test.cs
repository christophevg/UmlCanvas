using System;
using System.IO;

using TSF.UmlCanvas;

public class test {
  public static void Main(String[] Args) {
    Diagram diagram = new Diagram();

    diagram.setName( "myDiagram" );
    diagram.makeDynamic();
    // diagram.makeStatic();

    Interface interface1 = new Interface();
    interface1.setName( "myInterface" );
    interface1.setPosition( 51, 26 );
    
    Operation operation1 = new Operation();
    operation1.setName( "myOperation" );
    operation1.setReturnType( "String" );
    operation1.setVisibility( "public" );
    
    interface1.add( operation1 );

    Class class1 = new Class();
    class1.setName( "myClass" );
    class1.implement( interface1 );
    class1.setPosition( 194, 106 );
    
    TSF.UmlCanvas.Attribute attribute1 = new TSF.UmlCanvas.Attribute();
    attribute1.setName( "attribute1" );
    attribute1.setType( "String" );
    attribute1.setVisibility( "public" );

    class1.add( attribute1 );

    Class class2 = new Class();
    class2.setName( "myOtherClass" );
    class2.inheritFrom( class1 );
    class2.setPosition( 58, 206 );
    class2.makeAbstract();

    TSF.UmlCanvas.Attribute attribute2 = new TSF.UmlCanvas.Attribute();
    attribute2.setName( "attribute2" );
    attribute2.setType( class1 );
    attribute2.setVisibility( "protected" );
    attribute2.makeStatic();
    
    class2.add( attribute2 );

    Operation operation2 = new Operation();
    operation2.setName( "myOtherOperation" );
    operation2.add( new Argument( "arg1", "argType" ) );
    operation2.add( new Argument( "arg2", interface1 ) );
    operation2.makeAbstract();
    
    class2.add( operation2 );

    Enumeration enumeration1 = new Enumeration();
    enumeration1.setName( "myEnumeration" );
    enumeration1.setPosition( 354, 115 );

    diagram.add( interface1 );
    diagram.add( enumeration1 );
    diagram.add( class1 );
    diagram.add( class2 );
    
    Association association1 = new Association();
    association1.setName( "myAssociation" );
    Role role1 = new Role( interface1 );
    role1.makeNavigable();
    association1.add( role1 );
    Role role2 = new Role( class2, "roleName" );
    role2.makeComposite();
    association1.add( role2 );
    
    diagram.add( association1 );
    
    Dependency dependency1 = new Dependency();
    dependency1.setClient( class1 );
    dependency1.setSupplier( enumeration1, "usingThis" );
    
    diagram.add( dependency1 );
    
    Note note1 = new Note();
    note1.setText( "We do notes too ;-)" );
    note1.linkTo( class2 );
    note1.setPosition( 341, 233 );
    
    diagram.add( note1 );

    Console.WriteLine( diagram );
  }
}
