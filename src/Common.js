UmlCanvas.Common = {
  extractVisibility: function(construct) {
    // default modifier "visibility"
    var visibility = construct.modifiers.get("visibility" );
    if( visibility && visibility.value ) { return visibility.value.value; }
    
    // detect short hand versions
    if( construct.modifiers.get( "public"    ) ) { return "public";    }
    if( construct.modifiers.get( "private"   ) ) { return "private";   }
    if( construct.modifiers.get( "protected" ) ) { return "protected"; }
    if( construct.modifiers.get( "package"   ) ) { return "package";   }

    return null;
  },

  extractStatic: function(construct) {
    return construct.modifiers.get( "static" );
  },

  extractAbstract: function(construct) {
    var abstract = construct.modifiers.get("abstract");
    if( abstract && abstract.value ) {
      return abstract.value.value;
    } else if( abstract ) {
      return true;
    }
    return false;
  },

  determineVisibility: function(visibility) {
    switch(visibility) {
      case "__HIDE__" : return "";
      case "protected": return "#";
      case "private"  : return "-";
      case "package"  : return "~";
    }
    return "+";
  }
}
