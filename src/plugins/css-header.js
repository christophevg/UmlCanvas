function getCSSRule(ruleName) {
  ruleName=ruleName.toLowerCase();
  for (var i=0; i<document.styleSheets.length; i++) {
     var styleSheet=document.styleSheets[i];
     var ii=0;
     var cssRule=false;
     do {
        if (styleSheet.cssRules) {
           cssRule = styleSheet.cssRules[ii];
        } else {
           cssRule = styleSheet.rules[ii];
        }
        if( cssRule && cssRule.selectorText.toLowerCase()==ruleName) {
           return cssRule;
        }
        ii++;
     } while(cssRule)
   }
   return false;
}

function addCSSRule(sheet, ruleName) {
   if (sheet.addRule) {
      sheet.addRule(ruleName, null,0);
   } else {
      sheet.insertRule(ruleName+' { }', 0);
   }
   return getCSSRule(ruleName);
}

function makeCSSSheet() {
 var cssNode = document.createElement('style');
 cssNode.type = 'text/css';
 cssNode.rel = 'stylesheet';
 cssNode.media = 'screen';
 cssNode.title = 'UC_Inspector';
 document.getElementsByTagName("head")[0].appendChild(cssNode); 
 for(var i=0; i<document.styleSheets.length;i++) {
   if( document.styleSheets[i].title == 'UC_Inspector' ) { 
     return document.styleSheets[i]; 
   }
 }
}

function addCSSRules( sheet, rules ) {
  $H(rules).iterate(function(rule, styling) {
    if( rule != "" ) { 
      var cssRule = addCSSRule(sheet, rule);
      if( cssRule ) {
        var style = cssRule.style;
        $H(styling).iterate( function(name, value ) {
          style[name] = value;
        } );
      } else {
        alert( "could not add " + rule );
      }
    }
  });
}

addCSSRules( makeCSSSheet(), {