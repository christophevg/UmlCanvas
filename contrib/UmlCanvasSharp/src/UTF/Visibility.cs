using System;

using UML = TSF.UmlToolingFramework.UML;

namespace TSF.UmlCanvas.UTF {
  static class Visibility {
    public static String 
    getVisibility(UML.Classes.Kernel.VisibilityKind visibility) {
      switch( visibility ) {
        case UML.Classes.Kernel.VisibilityKind._private:   return "private";
        case UML.Classes.Kernel.VisibilityKind._protected: return "protected";
        case UML.Classes.Kernel.VisibilityKind._package:   return "package";
        case UML.Classes.Kernel.VisibilityKind._public:    return "public";
        default:                                           return "public";
      }
    }

    public static UML.Classes.Kernel.VisibilityKind 
    getVisibility(String visibility) {
      switch (visibility) {
        case "private":   return UML.Classes.Kernel.VisibilityKind._private;
        case "protected": return UML.Classes.Kernel.VisibilityKind._protected;
        case "package":   return UML.Classes.Kernel.VisibilityKind._package;
        case "public":    return UML.Classes.Kernel.VisibilityKind._public;
        default:          return UML.Classes.Kernel.VisibilityKind._public;
      }
    }
  }
}
