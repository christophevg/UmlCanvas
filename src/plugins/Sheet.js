UmlCanvas.KickStart.plugins.Inspector.Sheet = Class.extend( {

  /**
  * Sheet constructor
  * @param label label for the sheet
  * @param element the html element for the content of the sheet. Optional,
  * if not given, a div element is created.
  * @return a Sheet
  */
  init: function init(label, element) {
    this.label = label;
    if( element ) {
      this.element = element;
    } else {
      this.element = document.createElement('div');
    }
  },

  /**
  * Provides the label of the sheet.
  * @return the label
  */
  getLabel: function getLabel() {
    return this.label;
  },

  /**
  * Sets the label. 
  * @param label the label to set
  */
  setLabel: function setLabel(label) {
    this.label = label;
  },

  /**
  * Provides an html representation of the sheet and its content.
  * @param umlcanvasName name of the UmlCanvas for which the element is created
  * @return an html snippet
  */
  getElement: function getElement(umlcanvasName) {
    this.element.id = "UC_" + this.getLabel() + "_for_" + umlcanvasName;
    this.element.className = "UC_inspector_tab_content";
    this.element.style.resize = "none";

    return this.element;
  }

} );
