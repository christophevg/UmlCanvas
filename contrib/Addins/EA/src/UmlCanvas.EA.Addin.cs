using System;
using System.Windows.Forms;

using UML=TSF.UmlToolingFramework.UML;
using UTF_EA=TSF.UmlToolingFramework.Wrappers.EA;
using UTF_UC=TSF.UmlCanvas.UTF;

namespace TSF.UmlCanvas.Addins {
  public class EA {
    public String EA_Connect(global::EA.Repository Repository) {
      return "a string";
    }

    public object EA_GetMenuItems(global::EA.Repository Repository, 
                                  String Location, 
                                  String MenuName)
    {
      switch(MenuName) {
        case "":
          return "-&UMLCanvas";
        case "-&UMLCanvas":
          string[] ar = { "&Export", "&Import", "&Synchronize" };
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
          case "&Export":
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
      switch(ItemName) {
        case "&Export":
          this.export(Repository);
          break;
        case "&Import":
          this.import(Repository);
          break;
        case "&Synchronize":
          this.synchronize(Repository);
          break;
      }
    }

    private void export(global::EA.Repository eaRepository) {
      UML.UMLModel model = new UTF_EA.Model(eaRepository);
      UML.Diagrams.Diagram sourceDiagram = model.selectedDiagram;
      
      UTF_UC.Factory targetFactory = UTF_UC.Factory.getInstance();
      UTF_UC.Model   targetModel   = targetFactory.model as UTF_UC.Model;
      
      UML.Classes.Kernel.Element targetOwner = 
        targetFactory.createNewDiagram(sourceDiagram.name);
      
      targetFactory.model.selectedDiagram = targetOwner as UTF_UC.Diagram;

      UTF_UC.Diagram targetDiagram = 
        targetFactory.cloneDiagram(targetOwner, sourceDiagram) 
        as UTF_UC.Diagram;
        
      SubmissionForm form = new SubmissionForm();

      form.user        = targetModel.author;
      form.password    = targetModel.password;
      form.diagramID   = targetDiagram.diagramID;
      form.description = targetDiagram.comment;

      if (form.ShowDialog() == System.Windows.Forms.DialogResult.OK) {
        targetModel.author      = form.user;
        targetModel.password    = form.password;
        targetDiagram.diagramID = form.diagramID;
        targetDiagram.comment   = form.description;

        String diagramUrl = targetModel.saveDiagram(targetDiagram);
        System.Diagnostics.Process.Start(diagramUrl);
      }
    }

    private void import(global::EA.Repository eaRepository) {
      throw new NotImplementedException();
    }

    private void synchronize(global::EA.Repository Repository) {
      throw new NotImplementedException();
    }
  }
}
