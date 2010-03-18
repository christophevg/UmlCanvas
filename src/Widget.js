/**
 * Widget Class
 * Keeps a reference to all HTML elements that can interact with the 
 * UmlCanvas' model and synchronizes state between them.
 *
 * @TODO Should be back-ported to Canvas2D.
 */
UmlCanvas.Widget = Class.extend( {
  /**
   * Constructor, sets up all elements known to this Widget
   */
  init : function initialize(model) {
    this.model = model;
    
    this.setupConsole();
    this.setupSource();
    this.setupGeneratedSource();
    this.setupErrors();
    this.setupAbout();
    this.setupEditor();
  },
  
  /**
   * Returns the name of the model of this Widget.
   * @returns the name of the model of this Widget
   */
  getName : function getName() {
    return this.model.getName();
  },
  
  /**
   * Returns the Widget specific element.
   * @param name the (relative) name of the element.
   * @returns the element for this specific widget instance
   */
  getElement: function getElement(name) {
    return document.getElementById( "UC_" + name + "_for_" + this.getName() );
  },
  
  /**
   * Sets up the console element
   */
  setupConsole: function setupConsole() {
    this.console = this.getElement("console");
    if( this.console ) {
      this.model.console = this.console;
      this.model.log( "Widget: attached console : " + this.console.id );
    }
  },

  /**
   * Sets up the (static) source element
   */
  setupSource: function setupSource() {
    this.source = document.getElementById(this.getName() + "Source") 
                  || this.getElement("source");
    if( this.source ) {
      this.model.log( "Widget: attached source : " + this.source.id );
    }
  },

  /**
   * Sets up the generated (source) element
   */
  setupGeneratedSource: function setupGeneratedSource() {
    this.generated = document.getElementById(this.id + "Generated") 
                     || this.getElement("generated");
    if( this.generated ) {
      this.model.log( "Widget: attached generated : " + this.generated.id );
    }
  },

  /**
   * Sets up the editor element
   */
  setupEditor: function setupEditor() {
    this.editor = this.getElement("editor");
    if( this.editor ) {
      this.editor.onkeydown = this.handleInput.scope(this);
      this.model.on( "sourceUpdated", function(newSource) {
        if(!this.updatingCanvas && !this.updatedCanvas) {
          this.setSource(newSource);
        }
        this.updatedCanvas = false;
      }.scope(this) );
      this.updatingCanvas = false;
      this.autoSave();

      this.model.log( "Widget: attached editor : " + this.editor.id );
    }

    this.load();
  },
  
  /**
   * Sets up the errors element
   */
  setupErrors: function setupErrors() {
    this.errors = this.getElement("errors");
    if( this.errors ) {
      this.model.log( "Widget: attached errors : " + this.errors.id );
    }

  },
  
  /**
   * Shows error messages in the errors element
   * @param errors a string representing the errors to be shown
   */
  showErrors: function showErrors(errors) {
    if( ! this.errors ) { return; }
    this.errors.value = errors;
  },
  
  /**
   * Sets up the about element
   */
  setupAbout: function setupAbout() {
    this.about = this.getElement("about");
    
    if( this.about ) {
      var libraries = "";
      Canvas2D.extensions.iterate(function(library) {
          libraries += "\n<hr>\n";
          libraries += "<b>Library: " + 
            library.name + " " + library.version + "</b> " + 
            "by " + library.author + "<br>" + library.info;
      });
      this.about.innerHTML = '<b>Canvas2D ' + Canvas2D.version  + 
          '</b><br>Copyright &copy 2009, ' +
          '<a href="http://christophe.vg" target="_blank">Christophe VG</a>'+ 
          ' & <a href="http://thesoftwarefactory.be" ' +
          'target="_blank">The Software Factory</a><br>' + 
          'Visit <a href="http://thesoftwarefactory.be/wiki/Canvas2D" ' +
          'target="_blank">http://thesoftwarefactory.be/wiki/Canvas2D</a> ' +
          'for more info. Licensed under the ' +
          '<a href="http://thesoftwarefactory.be/wiki/BSD_License" ' + 
          'target="_blank">BSD License</a>.' + 
          libraries;
     }
  },
  
  /**
   * Gets the source from the editor and updates the UmlCanvas
   * Only does so when the source is valid (not empty) and "dirty". 
   * Guards against updates to the source by the UmlCanvas.
   */
  updateCanvas: function updateCanvas() {
    var src = this.getEditorSource();
    if( src && this.isInputDirty()) {
      if( src.replace( /^\s+|\s+$/g,"") != "" ) {
        this.updatingCanvas = true;
        this.load(src);
        this.showErrors(this.model.errors);
        if( this.model.errors == "" ) {
          this.updatedCanvas  = true;
          this.updatingCanvas = false;
        }
      }
      // canvas updated, so mark undirty
      this.handleInput();
    }
  },
  
  /**
   * Automagically saves the changes by the user in the editor to the 
   * actual canvas.
   */
  autoSave: function autoSave() {
    this.updateCanvas();
    setTimeout( this.autoSave.scope(this), 100 );
  },
  
  /**
   * Handle changes to the (editor) input
   */
  handleInput: function handleInput() {
    this.oldValue = this.editor.value;
  },
  
  /**
   * Check whether the input is dirty.
   * @return true if the editor is not in sync with the UmlCanvas.
   */
  isInputDirty: function isInputDirty() {
    return this.oldValue != this.editor.value;
  },

  /**
   * Sets the value of the editor.
   * @param src the src to set
   */
  setSource: function setSource(src) {
    this.editor.value = src;
    this.handleInput();
  },
  
  /**
   * Loads source into the model.
   * @param src Optional source, if omitted, the source is fetched
   */  
  load: function load(src) {
    src = src || this.getSource();
    // TODO: parsing an empty source causes havoc. this should be handled 
    //       more gracefully in Cavnas2D
    if( src != "" ) {
      this.model.load(src);
    }
  },

  /**
   * Fetches the source from either the editor or the source element
   * @return the source in the editor or in the source element or "empty"
   */
  getSource: function getSource() {
    return this.getEditorSource() || this.getLocalSource() || "";
  },

  /**
   * Provides the source in the editor.
   * @return the source in the editor or null
   */
  getEditorSource: function getEditorSource() {
    return this.editor ? this.editor.value : null;
  },
  
  /**
   * Provides the source in the source element.
   * @return the source in the source element or null
   */
  getLocalSource : function getLocalSource() {
    return this.source ?  (this.source.value || this.source.innerHTML) : null;
  }
});

/**
 * Static Factory method to setup a widget for a UmlCanvas.
 */
UmlCanvas.Widget.setup = function UmlCanvas_Widget_setup( model ) {
  model.Widget = new UmlCanvas.Widget( model ); 
};
