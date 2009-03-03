UmlCanvas.Common = {
    extractVisibility: function(construct) {
	var visibility = construct.modifiers.get("visibility" );
	if( visibility ) { return visibility.value.value; }
	// short hand
	if( construct.modifiers.get( "public"    ) ) { return "public"; }
	if( construct.modifiers.get( "private"   ) ) { return "private"; }
	if( construct.modifiers.get( "protected" ) ) { return "protected"; }
	
	return null;
    },

    determineVisibility: function(visibility) {
	switch(visibility) {
	case "protected": return "#";
	case "private"  : return "-";
	case "package"  : return "~";
	}
	return "+";
    }
}

