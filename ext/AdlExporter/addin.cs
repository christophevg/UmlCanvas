using System;
using System.IO;
using System.Collections.Generic;
using System.Windows.Forms;

namespace addin {
    public class Modifier {
	private String  key;
	private String  stringValue;
	private int     integerValue;
	private Boolean boolValue;
	private String  type;

	public Modifier(String key) {
	    this.key = key;
	}

	public Modifier(String key, String value) {
	    this.key = key;
	    this.stringValue = value;
	    this.type = "String";
	}

	public Modifier(String key, int value) {
	    this.key = key;
	    this.integerValue = value;
	    this.type = "Integer";
	}

	public Modifier(String key, Boolean value) {
	    this.key = key;
	    this.boolValue = value;
	    this.type = "Boolean";
	}

	public String toString() {
	    String s = " +" + this.key;
	    switch(this.type) {
	    case "String":
		return s + "=\"" + this.stringValue + "\"";
	    case "Integer":
		return s + "=" + this.integerValue;
	    case "Boolean":
		return s + "=" + this.boolValue + "\"";
	    }
	    return s;
	}
    }

    public class Construct {
	private List<String> annotations = new List<String>();
	private String type;
	private String name;
	private List<String>      supers = new List<String>();
	private List<Modifier> modifiers = new List<Modifier>();
	private List<Construct> children = new List<Construct>();

	public List<String> getDependencies() {
	    List<String> deps = new List<String>();
	    foreach( Construct child in this.children ) {
		deps.AddRange(child.getDependencies());
	    }
	    deps.AddRange(this.supers);
	    return deps;
	}

	public Construct addAnnotation(String annotation) {
	    this.annotations.Add(annotation);
	    return this;
	}

	public String getAnnotationsAsString(String prefix) {
	    String s = "";
	    foreach( String annotation in this.annotations ) {
		s += "[@" + annotation + "]\r\n";
	    }
	    return s;
	}

	public Construct setType(String type) {
	    this.type = type.ToLower();
	    return this;
	}

	public Construct setName(String name) {
	    this.name = name;
	    return this;
	}

	public String getName() {
	    return this.name;
	}

	public Construct addSuper(String name) {
	    this.supers.Add(name);
	    return this;
	}

	public String getSuperAsString() {
	    String s = "";
	    foreach( String zuper in this.supers ) {
		s += " :" + zuper;
	    }
	    return s;
	}

	public Construct addModifier(Modifier modifier) {
	    this.modifiers.Add(modifier);
	    return this;
	}

	public String getModifiersAsString() {
	    String s = "";
	    foreach( Modifier modifier in this.modifiers ) {
		s += modifier.toString() + " ";
	    }
	    return s;
	}

	public Construct addChild(Construct construct) {
	    this.children.Add(construct);
	    return this;
	}

	public String getChildrenAsString(String prefix) {
	    if( this.children.Count < 1 ) { return ";"; }
	    String s = " {\r\n";
	    foreach( Construct child in this.children ) {
		s += child.toString(prefix + "  ") + "\r\n";
	    }
	    s += prefix + "}";
	    return s;
	}

	public String toString() { return this.toString(""); }
	public String toString(String prefix) {
	    return this.getAnnotationsAsString(prefix) 
		+ prefix + this.type + " " + this.name
		+ this.getSuperAsString()
		+ this.getModifiersAsString()
		+ this.getChildrenAsString(prefix);
	}
    }

    public class DiagramVisitor {
	private EA.Repository repository;
	private List<Construct> constructs = new List<Construct>();

	public DiagramVisitor visit(EA.Repository repository) {
	    this.repository = repository;
	    return this;
	}

	private void importSupers(Construct construct, EA.Element elem) {
	    foreach( EA.Element zuper in elem.BaseClasses ) {
		construct.addSuper(zuper.Name);
	    }
	    foreach( EA.Element zuper in elem.Realizes ) {
		construct.addSuper(zuper.Name);
	    }
	}

	private void importAttributes(Construct construct, EA.Element elem) {
	    foreach( EA.Attribute attribute in elem.Attributes ) {
		construct.addChild
		    ( new Construct()
		      .setType("attribute")
		      .setName(attribute.Name)
		      .addSuper(attribute.Type)
		      .addModifier
		      (new Modifier(attribute.Visibility.ToLower())) );
	    }
	}

	private void importOperations(Construct construct, EA.Element elem) {
	    foreach( EA.Method operation in elem.Methods ) {
		Construct child = new Construct()
		    .setType("operation")
		    .setName(operation.Name)
		    .addSuper(operation.ReturnType)
		    .addModifier(new Modifier(operation.Visibility.ToLower()));
		foreach(EA.Parameter parameter in operation.Parameters ) {
		    child.addChild( new Construct()
				    .setType("parameter")
				    .setName(parameter.Name)
				    .addSuper(parameter.Type) );
		}
		construct.addChild( child );
	    }
	}

	private Construct importRole(int elementID, EA.ConnectorEnd end ) {
	    String zuper = this.repository.GetElementByID(elementID).Name;
	    String name  = end.Role != "" ? end.Role : zuper.ToLower();
	    Construct role = new Construct()
		.setType("role")
		.setName(name)
		.addSuper(zuper);

	    if( end.IsNavigable ) {
		role.addModifier(new Modifier("navigable"));
	    }

	    switch(end.Aggregation) {
	    case 1:
		role.addModifier(new Modifier("aggregation"));
		break;
	    case 2:
		role.addModifier(new Modifier("composition"));
		break;
	    }
	    return role;
	}

	private void importAssociation(EA.Connector connector) {
	    Construct fromRole = this.importRole(connector.SupplierID,
						 connector.SupplierEnd);
	    Construct toRole   = this.importRole(connector.ClientID,
						 connector.ClientEnd);

	    this.constructs.Add( new Construct()
				 .setType("association")
				 .setName(connector.Name)
				 .addChild( fromRole )
				 .addChild( toRole ) );
	}

	private void importAssociations(EA.Element elem) {
	    foreach( EA.Connector connector in elem.Connectors ) {
		if( ( connector.Type == "Association" ||
		      connector.Type == "Aggregation" ) 
		    && connector.SupplierID == elem.ElementID ) 
		    {
			this.importAssociation(connector);
		    }
	    }
	}
	
	private void importDiagramObject(EA.DiagramObject obj) {
	    EA.Element elem = this.repository.GetElementByID(obj.ElementID);
	    
	    Construct construct = new Construct()
		.addAnnotation(obj.left + "," + Math.Abs(obj.top))
		.setType(elem.Type)
		.setName(elem.Name)
		.addModifier(new Modifier(elem.Visibility.ToLower()));

	    if( elem.StereotypeEx != "" ) {
		construct.addModifier
		    (new Modifier("stereotype", elem.StereotypeEx));
	    }
	    
	    this.importSupers(construct, elem);
	    this.importAttributes(construct, elem);
	    this.importOperations(construct, elem);
		
	    this.constructs.Add( construct );
	
	    this.importAssociations(elem);
	}

	public DiagramVisitor visit(EA.Diagram diagram ) {
	    foreach( EA.DiagramObject obj in diagram.DiagramObjects ) {
		this.importDiagramObject(obj);
	    }
	    return this;
	}

	public String toString() {
	    String s = "";
	    List<String> exported = new List<String>();
	    int loops = 0;

	    while( loops++ < 10 && exported.Count < this.constructs.Count ) {
		foreach( Construct construct in this.constructs ) {
		    if( !exported.Contains(construct.getName() ) ) {
			Boolean ok = true;
			foreach( String dep in construct.getDependencies() ) {
			    if( !exported.Contains(dep) ) { ok = false; }
			}
			if( ok ) { 
			    s += construct.toString() + "\r\n\r\n"; 
			    exported.Add( construct.getName() );
			}
		    }
		}
	    }
	    return s;
	}
    }

    public class Main {
	public object EA_GetMenuItems(EA.Repository Repository, 
				      string Location, string MenuName) {
	    switch( MenuName ) {
	    case "":
		string[] ar = { "&Copy as ADL" };
		return ar;
	    }
	    return "";
	}
	
	public void EA_MenuClick(EA.Repository Repository, string Location, 
				 string MenuName, string ItemName) {
	    switch( ItemName ) {
	    case "&Copy as ADL":		
		Clipboard.SetText( new DiagramVisitor()
				   .visit(Repository)
				   .visit(Repository.GetCurrentDiagram())
				   .toString() );
		break;					
	    }
	}
    }
}
