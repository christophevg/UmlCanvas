UmlCanvas.widgetCount = 0;

UmlCanvas.Widget = Class.extend( {
  init : function initialize(properties) {
    this.hosted   = false;
    this.editable = false;

    this.initProperties(properties);

    this.setupCanvas();
    this.setupFramework();
    this.setupSource();
    this.setupGeneratedSource();
    this.setupEditor();
    this.setupErrors();
    this.setupInfo();
    this.setupAbout();

    this.setupMouseEventHandlers();
    this.setupActionHandlers();
    
    // we can only continue/start once UmlCanvas is ready
    UmlCanvas.on("ready", this.start.scope(this) );
  },
  
  getElement: function getElement(name) {
    return document.getElementById( "UC_" + name + "_for_" + this.id );
  },
  
  setupCanvas: function setupCanvas() {
    this.canvas = document.getElementById(this.id);
  },

  setupFramework: function setupFramework() {
    this.container    = this.getElement("container");
    this.sheets       = this.getElement("sheets");
    this.resizeHandle = this.getElement("resizer");

    this.nameLabel    = this.getElement("name");
    this.authorLabel  = this.getElement("author");
  },
  
  setupSource: function setupSource() {
    this.UmlCanvasSource = 
      document.getElementById(this.id + "Source") ||
      this.getElement("source");
    if( this.UmlCanvasSource ) {
      this.src = this.UmlCanvasSource.value || this.UmlCanvasSource.innerHTML;
    }
  },

  setupGeneratedSource: function setupGeneratedSource() {
    this.UmlCanvasGenerated = 
      document.getElementById(this.id + "Generated") ||
      this.getElement("generated");
  },

  setupEditor: function setupEditor() {
    this.UmlCanvasEditor = this.getElement("editor");
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

  setupInfo: function setupInfo() {
    this.UmlCanvasInfo = this.getElement("info");
    
    if( this.UmlCanvasInfo ) {
      var html = '<table>';
      
      UmlCanvas.Widget.allProperties.iterate( function(prop, validator) {
        html += '<tr><th>' + prop + '</th><td>';
        if( validator ) {
          html += '<input id="UC_info-' + prop + '_for_' + this.id + '" ' +
                  'type="text" name="' + prop + '">' +
                  '<span id="UC_info-error-' + prop + '_for_' + this.id + '"' +
                       ' class="message"></span>';
        } else {
          html += '<span id="UC_info-' + prop + '_for_' + this.id + '"></span>';
        }
        html += '</td></tr>';
        
      }.scope(this) );
      
      this.UmlCanvasInfo.innerHTML = html;
      this.UmlCanvasProperties = {};
      
      UmlCanvas.Widget.allProperties.iterate( function(prop, validator) {
        this.UmlCanvasProperties[prop] = this.getElement( "info-" + prop ); 
        if( validator ) {
          validator.setLogger("UC_info-error-" + prop + "_for_" + this.id);
          this.UmlCanvasProperties[prop].onchange = validator.getFunction();
        }
      }.scope(this) );
    }
  },
  
  updateInfo: function updateInfo() {
    if( this.UmlCanvasInfo ) {
      UmlCanvas.Widget.allProperties.iterate( function(prop, validator) {
        if(validator) {
          this.UmlCanvasProperties[prop].value = this[prop];
        } else {
          this.UmlCanvasProperties[prop].innerHTML = this[prop];
        }
      }.scope(this) );
    }
    if( this.nameLabel && this.authorLabel ) {
      this.nameLabel.innerHTML   = this.name;
      this.authorLabel.innerHTML = this.author;
    }
  },

  updateCanvas: function updateCanvas() {
    var src = this.UmlCanvasEditor.value;
    if( this.inputIsDirty ) {
      if( src.replace( /^\s+|\s+$/g,"") != "" ) {
        this.updatingCanvas = true;
        this.UmlCanvas.load(src);
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
    if( this.UmlCanvasEditor  && this.UmlCanvasGenerated ) {
      this.UmlCanvasEditor.onkeydown = this.markDirty.scope(this);
      this.UmlCanvas.on( "sourceUpdated", function() {
        if(!this.updatingCanvas) {
          this.UmlCanvasEditor.value = this.UmlCanvasGenerated.value;
          this.inputIsDirty = false;
        }
        this.updatingCanvas = false;
      }.scope(this) );
      this.inputIsDirty = true;
      this.updatingCanvas = false;
      this.autoSave();
    }    
    this.load();
    this.mode = this.mode ? this.mode : 
                  (this.id == "new" || (this.role == "owner" ) ? 
                    "editor" : "viewer" );
    this.gotoTab("diagram");
    this.resizeTo(this.width,this.height);
    this.show();
  },

  getXY: function getXY(event) {
	  if( event == null ) { event = window.event; }
	  if( event == null ) { return null;          }
	  if( event.pageX || event.pageY ) {
      return { x: event.pageX - this.getLeft(), 
		           y: event.pageY - this.getTop()  };
	  }
	  return null;
  },
  
  getLeft: function getLeft() {
    var elem = this.canvas;
    var left = 0;
    while( elem != null ) {
      left += elem.offsetLeft;
      elem = elem.offsetParent;
    }
    return left;
  },

  getTop: function getTop() {
    var elem = this.canvas;
    var top = 0;
    while( elem != null ) {
      top += elem.offsetTop;
      elem = elem.offsetParent;
    }
    return top;
  },

  handleMouseDown : function handleMouseDown(event) {
    event.preventDefault();
    this.currentPos = this.getXY(event);
    this.resizing = true;
  },

  handleMouseMove : function handleMouseMove(event) {
    if( this.resizing ) {
      var pos = this.getXY(event);
      this.resizeBy( pos.x - this.currentPos.x, pos.y - this.currentPos.y );
      this.currentPos = pos;
    }
  },

  handleMouseUp : function handleMouseMove(event) {
    this.resizing = false;
  },

  setupMouseEventHandlers: function setupMouseEventHandlers() {
    if( this.resizeHandle ) {
      ProtoJS.Event.observe( this.resizeHandle, 'mousedown', 
		                         this.handleMouseDown.scope(this) );
  	  ProtoJS.Event.observe( document, 'mouseup', 
		                         this.handleMouseUp.scope(this) );
	    ProtoJS.Event.observe( document, 'mousemove', 
		                         this.handleMouseMove.scope(this) );
		}
  },
  
  resizeBy: function resizeBy(dx, dy) {
    if( !this.resizeHandle ) { return; }
    this.resizeTo( this.canvas.width + dx, this.canvas.height + dy );
  },

  resizeTo: function resizeTo(w, h) {
    this.canvas.width  = w;
    if( this.canvas.width < 350 )  {
      this.container.style.width = 362;
      this.canvas.style.left = ( 350 - this.canvas.width ) / 2;
    } else {
      this.container.style.width = "auto";      
      this.canvas.style.left = 0;
    }
    this.canvas.height = h;
    
    if( this.sheets ) {
      this.sheets.style.width = ( this.canvas.width >= 350 ? 
        this.canvas.width : 350 ) + 12;
      this.sheets.style.height = this.canvas.height + 12;
    }
    this.UmlCanvas.rePublish();
    this.width  = this.canvas.width;
    this.height = this.canvas.height;
    this.updateInfo();
  },
    
  setupActionHandlers : function setupActionHandlers() {
    this.viewAction = this.getElement("action_view");
    this.editAction = this.getElement("action_edit");

    if( this.viewAction ) {
      this.viewAction.onclick = this.showAsViewer.scope(this);
    }
    if( this.editAction ) {
      this.editAction.onclick = this.showAsEditor.scope(this);
    }
      
    this.tabs = {};
    for( var tab in UmlCanvas.Widget.allTabs ) {
      this.tabs[tab] = this.getElement( "tab_" + tab);
      if( this.tabs[tab] ) {
        this.tabs[tab].onclick = function(t) { 
          return function() { this.gotoTab(t); }
        .scope(this) }.scope(this)(tab);
      }
    }
  },
  
  showAsViewer: function showAsViewer(event) {
    this.gotoTab("diagram");
    this.mode = "viewer";
    this.show();
    return this;
  },
  
  showAsEditor: function showAsEditor(event) {
    this.mode = "editor";
    this.show();
    return this;
  },
  
  load: function load() {
    if( this.src == "" ) {
      if( this.hasLocalSource() ) {
        this.loadLocal();
      } else {
        this.loadRemote();
      }
    } else {
      this.UmlCanvas.load(this.src);
    }
  },
  
  loadLocal: function loadLocal() {
    this.hosted = false;
    this.getLocalSource();
    this.UmlCanvas.load( this.src );
  },
  
  hasLocalSource : function hasLocalSource() {
    return document.getElementById(this.id + "Source") != null;
  },
  
  getLocalSource : function getLocalSource() {
    this.src = document.getElementById(this.id + "Source").innerHTML;
  },
  
  loadRemote: function loadRemote() {
    this.hosted = true;    
    this.getHostedDiagram(this.id);
  },
  
  getHostedDiagram : function getRemoteDiagram(id) {
    new ProtoJS.Ajax().fetch( 'http://hosted.umlcanvas.org/' + id + ':json',
                              function(properties) {
                                this.initProperties(properties);
                                this.UmlCanvas.load(this.src);
                                this.resizeTo(this.width,this.height);
                                this.show();
                              }.scope(this) );
  },
  
  initProperties : function initProperties(properties) {
      this.id          = properties.id      || "new" + UmlCanvas.widgetCount++;
      this.name        = properties.name    || "New properties";
      this.description = properties.descr   || "";
      this.author      = properties.author ? properties.author.username : "you";
      this.src         = properties.src     || "";
      this.role        = properties.role    || "anon";
      this.width       = properties.width   || 350;
      this.height      = properties.height  || 200;
  },
  
  showTabs : function showTabs(tabs) {
    for(var tab in tabs) {
      document.getElementById( "UC_action_" + tab + "_for_" + this.id )
        .className = "tab";
    }
  },

  gotoTab : function gotoTab(tab) {
    if( this.currentTab   ) { this.currentTab.className   = "tab";   }
    if( this.currentSheet ) { this.currentSheet.className = "sheet hidden"; }
    this.currentTab = 
      document.getElementById( "UC_tab_" + tab + "_for_" + this.id );
    this.currentSheet = 
      document.getElementById( "UC_sheet_" + tab + "_for_" + this.id );
    if( this.currentTab   ) { this.currentTab.className   = "tab selected"; }
    if( this.currentSheet ) { this.currentSheet.className = "sheet";}
  },
  
  makeEditable : function makeEditable() {
    this.editable = true;
    this.show();
    return this;
  },
  
  makeStatic : function makeStatic() {
    this.editable = false;
    this.show();
    return this;
  },
  
  show: function show() {
    if( !this.mode ) { return; }
    this.container.className = "UC_container" +
     ( this.editable || ( this.hosted && this.role != "anon" ) ? 
        " UC_editable" : "" ) +     
     " UC_" + this.mode +
     (this.hosted   ? " UC_hosted" : "" ) +
     " UC_" + this.role;

    this.updateInfo();
     
    console.log( this.id + " : " + this.container.className );
  }
});

ProtoJS.Validators = {};

ProtoJS.Validators.BaseValidator = Class.extend( {
  setLogger: function setLogger(logElem) {
    this.logElem = document.getElementById(logElem);
  },
  
  reset: function reset() { 
    if(this.logElem) { 
      this.logElem.innerHTML = ""; 
      this.logElem.className = "message";
    } 
  },
  
  log: function set(msg) {
    if(this.logElem) {
      this.logElem.innerHTML = msg; 
      this.logElem.className = "message invalid";
    }
  },
  
  getFunction: function getFunction(logElem) {
    var logger = {
      
    }
    var validation = this;
    return function() {
      validation.reset();
      this.className = "";
      if(validation.failsFor(this.value)) {
        this.className = "invalid";
      }
    };
  },
  
  fails: function fails(value) {
    return true;
  }
} );

ProtoJS.Validators.String = ProtoJS.Validators.BaseValidator.extend( {
  init: function init(chars, min, max) {
    this.chars = chars;
    this.test  = new RegExp("^[" + chars + "]*$");
    this.min   = min;
    this.max   = max;
  },
  
  failsFor: function fails(value) {
    if(!this.test.test(value)) {
      this.log("Allowed characters: " + this.chars);
      return true;
    } else if(value.length < this.min) {
      this.log("Minimal length " + this.min)
      return true;
    } else if(value.length > this.max) {
      this.log("Maximal length " + this.max);
      return true;
    }
    return false;
  }
} );

ProtoJS.Validators.Number = ProtoJS.Validators.BaseValidator.extend( {
  init: function init(min, max) {
    this.min   = min;
    this.max   = max;
  },
  
  failsFor: function fails(value) {
    if( parseFloat(value) != value ) {
      this.log("Not a number.");
      return true;
    } else if(value < this.min) {
      this.log("Lower limit " + this.min);
      return true;
    } else if(value > this.max) {
      this.log("Upper limit " + this.max);
      return true;
    }
    return false;
  }
} );

UmlCanvas.Widget.allProperties = $H(
  { "id"          : new ProtoJS.Validators.String( 'a-zA-Z0-9_ -', 3, 25 ),
    "name"        : new ProtoJS.Validators.String( 'a-zA-Z0-9_ -', 3, 25 ),
    "description" : new ProtoJS.Validators.String( 'a-zA-Z0-9_ -', 0, 4000 ),
    "author"      : false,
    "height"      : new ProtoJS.Validators.Number( 100, 1024 ),
    "width"       : new ProtoJS.Validators.Number( 100, 1024 ) } );

UmlCanvas.Widget.allTabs =
  { "diagram":0, "source":1, "info":2, "notes":3, "console":4, "about":5 };

UmlCanvas.Widget.activate = function UmlCanvas_Widget_insert( diagram ) {
  return new UmlCanvas.Widget( typeof diagram == "object" ? 
                               diagram : { id: diagram } ); 
};

UmlCanvas.Widget.insert = function UmlCanvas_Widget_insert( id ) {
  // TODO: document.write( widgetHTML );
  return UmlCanvas.Widget.activate(id);
};
