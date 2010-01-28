UmlCanvas.widgetCount = 0;

UmlCanvas.Widget = Class.extend( {
  init : function initialize(umlcanvas) {
    this.initProperties(umlcanvas);
    
    this.setupCanvas();
    this.setupConsole();
    this.setupSource();
    this.setupGeneratedSource();
    this.setupEditor();
    this.setupErrors();
    this.setupAbout();

    // we can only continue/start once UmlCanvas is ready
    UmlCanvas.on("ready", this.start.scope(this) );
  },
  
  initProperties : function initProperties(umlcanvas) {
      this.umlcanvas   = umlcanvas;
      this.id          = umlcanvas.id;
      this.src         = umlcanvas.src || "";
      this.width       = umlcanvas.width  || 350;
      this.height      = umlcanvas.height || 200;
  },
  
  getElement: function getElement(name) {
    return document.getElementById( "UC_" + name + "_for_" + this.id );
  },
  
  setupCanvas: function setupCanvas() {
    this.canvas = this.umlcanvas;
  },

  setupConsole: function setupConsole() {
    this.UmlCanvasConsole = this.getElement("console");
  },

  setupSource: function setupSource() {
    this.UmlCanvasSource = document.getElementById(this.id + "Source") 
                        || this.getElement("source");
    this.getLocalSource();
  },

  setupGeneratedSource: function setupGeneratedSource() {
    this.UmlCanvasGenerated = document.getElementById(this.id + "Generated") 
                           || this.getElement("generated");
  },

  setupEditor: function setupEditor() {
    this.UmlCanvasEditor = this.getElement("editorPane");
  },
  
  setupErrors: function setupErrors() {
    this.UmlCanvasErrors = this.getElement("errors");
  },
  
  setupAbout: function setupAbout() {
    this.UmlCanvasAbout = this.getElement("about");
    
    if( this.UmlCanvasAbout ) {
      var libraries = "";
      Canvas2D.extensions.iterate(function(library) {
          libraries += "\n<hr>\n";
          libraries += "<b>Library: " + 
            library.name + " " + library.version + "</b> " + 
            "by " + library.author + "<br>" + library.info;
      });
      this.UmlCanvasAbout.innerHTML = '<b>Canvas2D ' + Canvas2D.version  + 
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
  
  updateCanvas: function updateCanvas() {
    var src = this.getEditorValue();
    if( this.inputIsDirty ) {
      if( src.replace( /^\s+|\s+$/g,"") != "" ) {
        this.updatingCanvas = true;
        this.loadUmlCanvas(src);
        if( this.UmlCanvasErrors ) {
          this.UmlCanvasErrors.value = this.UmlCanvas.errors;
        }
      }
      this.inputIsDirty = false;
    }
  },
  
  autoSave: function autoSave() {
    this.updateCanvas();
    setTimeout( this.autoSave.scope(this), 100 );
  },
  
  markDirty: function markDirty() {
    this.inputIsDirty = true;
  },
  
  start: function start() {
    this.UmlCanvas = UmlCanvas.getModel(this.id);

    if( this.UmlCanvasConsole ) {
      this.UmlCanvas.console = this.UmlCanvasConsole;
    }

    if( this.UmlCanvasEditor ) {
      this.UmlCanvasEditor.onkeydown = this.markDirty.scope(this);
      this.UmlCanvas.on( "sourceUpdated", function(newSource) {
        if(!this.updatingCanvas) {
          this.setEditorValue(newSource);
          this.inputIsDirty = false;
        }
        this.updatingCanvas = false;
      }.scope(this) );
      this.inputIsDirty = true;
      this.updatingCanvas = false;
      this.autoSave();
    }    

    this.load();
  },
  
  /**
   * Sets the value of the editor.
   * @param src the src to set
   */
  setEditorValue: function setEditorValue(src) {
      /*
       * Other widget properties than src can be out of sync as well,
       * so we synchronize them here.
       */ 
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      
      this.UmlCanvasEditor.value = src;
  },
  
  /**
   * Provides the value of the editor.
   * @return the value of the editor
   */
  getEditorValue: function getEditorValue() {
      return this.UmlCanvasEditor.value;
  },
  
  load: function load() {
    if( this.src == "" && this.hasLocalSource() ) {
	this.getLocalSource();
    }
    this.loadUmlCanvas(this.src);
  },
  
  loadUmlCanvas: function loadUmlCanvas(src) {
    if (src) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      
      this.UmlCanvas.load(src);
    }
  },
   
  hasLocalSource : function hasLocalSource() {
    return document.getElementById(this.id + "Source") != null;
  },
  
  getLocalSource : function getLocalSource() {
    if( this.UmlCanvasSource ) {
      this.src = this.UmlCanvasSource.value || this.UmlCanvasSource.innerHTML;
    } 
  }
  
});

UmlCanvas.Widget.activate = 
    function UmlCanvas_Widget_insert( diagram ) {
  return new UmlCanvas.Widget( typeof diagram == "object" ? 
                               diagram : { id: diagram } ); 
};
