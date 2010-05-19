using System;
using System.Windows.Forms;

using UML=TSF.UmlToolingFramework.UML;
using UTF_EA=TSF.UmlToolingFramework.Wrappers.EA;
using UTF_UC=TSF.UmlCanvas.UTF;

namespace TSF.UmlCanvas.Addins {
  public class EA {
    const string menuHeader = "-&UmlCanvas";
    const string menuCopy   = "&Copy as ADL to Clipboard";
    const string menuExport = "&Export to Hosted UmlCanvas";
    const string menuImport = "&Import from Hosted UmlCanvas";
    const string menuSync   = "&Synchronize with Hosted UmlCanvas";

    private global::EA.Repository repository;

    public String EA_Connect(global::EA.Repository Repository) {
      return "a string";
    }

    public object EA_GetMenuItems(global::EA.Repository Repository, 
                                  String Location, 
                                  String MenuName)
    {
      switch(MenuName) {
        case "":
          return menuHeader;
        case menuHeader:
          string[] ar = { menuCopy, menuExport, menuImport, menuSync };
          return ar;
      }

      return "";
    }

    bool IsProjectOpen(global::EA.Repository Repository) {
      try {
        if( Repository.Models != null ) return true;
      } catch {}
      return false;
    }

    public void EA_GetMenuState( global::EA.Repository Repository, 
                                 String Location,
                                 String MenuName, String ItemName, 
                                 ref bool IsEnabled, ref bool IsChecked )
    {
      if( IsProjectOpen(Repository) ) {
        Object selectedItem;
        global::EA.ObjectType selectedType = 
          Repository.GetContextItem(out selectedItem);

        switch(ItemName) {
          case menuCopy:
            IsEnabled = selectedType == global::EA.ObjectType.otDiagram;
            break;
          case menuExport:
            IsEnabled = selectedType == global::EA.ObjectType.otDiagram;
            break;
          default:
            IsEnabled = false;
            break;
        }
      } else {
        // If no open project, disable all menu options
        IsEnabled = false;
      }
    }

    public void EA_MenuClick( global::EA.Repository Repository, 
                              String Location, 
                              String MenuName, String ItemName )
    {
      this.repository = Repository;

      switch(ItemName) {
        case menuCopy   : this.copy();        break;
        case menuExport : this.export();      break;
        case menuImport : this.import();      break;
        case menuSync   : this.synchronize(); break;
      }
    }

    private void copy() {
      Clipboard.SetText(this.getDiagram().ADL);
    }

    private void export() {
      UTF_UC.Model model = UTF_UC.Model.getModel();
      UTF_UC.Diagram diagram = this.getDiagram();
        
      SubmissionForm form = new SubmissionForm();

      form.user        = model.author;
      form.password    = model.password;
      form.diagramID   = diagram.diagramID;
      form.description = diagram.comment;

      if (form.ShowDialog() == System.Windows.Forms.DialogResult.OK) {
        model.author      = form.user;
        model.password    = form.password;
        diagram.diagramID = form.diagramID;
        diagram.comment   = form.description;

        String url = model.saveDiagram(diagram);
        System.Diagnostics.Process.Start(url);
      }
    }

    private void import() {
      throw new NotImplementedException();
    }

    private void synchronize() {
      throw new NotImplementedException();
    }


    private UTF_UC.Diagram getDiagram() {
      UTF_EA.Model sourceModel = new UTF_EA.Model(this.repository);
      UML.Diagrams.Diagram sourceDiagram = sourceModel.selectedDiagram;
      
      UTF_UC.Model targetModel = UTF_UC.Model.getModel();
      return targetModel.cloneDiagram(sourceDiagram);
    }
  }
}
