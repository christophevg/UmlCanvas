/**
 * Inspector Plugin
 * Implementation of the Widget Framework.
 * Provides 
 *
 * @TODO Should be back-ported to Canvas2D.
 */
UmlCanvas.KickStart.plugins.Inspector = UmlCanvas.Plugin.extend( {
  init: function init(model) {
    this.model = model;

    this.initSheets();
  },
  
  getName: function getName() {
    return "inspector";
  },

  /**
  * Adds 3 default sheets to this inspector: source, console and about.
  * TODO when moved to Canvas2D, default should be set using defaults mechanism
  */
  initSheets: function initSheets() {
    this.sheets = {};
    this.sheetPositions = [];

    this.source = document.createElement('textarea');
    this.addSheet(0, 'source' , this.source );

    this.console = document.createElement('textarea');
    this.addSheet(1, 'console', this.console );

    this.addSheet(2, 'about');
  },

  activate: function activate() {
    this.insertInspector();
    this.wireActivation();
  },

  getElement : function getElement(name) {
    return document.getElementById( "UC_inspector_" + name + 
                                    "_for_" + this.model.getName() );
  },

  /**
  * Provides the sheet for the given label.
  * @param label a label
  * @return the sheet with the given label
  */
  getSheet: function getSheet(label) {
    return this.sheets[label];
  },

  /**
  * Adds a sheet to the inspector.
  * Shifts the element currently at that position (if any) and 
  * any subsequent elements to the right (adds one to their indices).
  * @param index at which the specified sheet is to be inserted
  * @param label a label for the sheet
  * @param element the html element representing the content of the sheet
  */
  addSheet: function addSheet(index, label, element) {
    var sheet = new UmlCanvas.KickStart.plugins.Inspector.Sheet(label, element);
    this.sheetPositions.splice(index, 0, sheet);
    this.sheets[sheet.getLabel()] = sheet;
  },

  /**
  * Removes the sheet with the given label.
  * @param label a label
  */
  removeSheet: function removeSheet(label) {
    this.sheetPositions.splice(
      this.sheetPositions.indexOf(this.getSheet(label)), 1);
    delete this.sheets[label];
  },
  
  getDefaultTab: function getDefaultTab() {
    return this.defaultTab || "source";
  },
  
  setDefaultTab: function setDefaultTab(tab) {
    this.defaultTab = tab || "source";
  },

  insertInspector: function insertInspector() {
    this.insertInspectorHTML();
    this.wireResizeAndDragHandling();

    this.setupSheets();
    this.gotoTab(this.getDefaultTab());

    this.resizeTo(0,0);
    this.moveTo( this.model.getLeft(), this.model.getTop() );
    this.shownBefore = false;

    UmlCanvas.Widget.setup(this.model);
  },

  insertInspectorHTML: function insertInspectorHTML() {
    this.inspector = document.createElement("DIV");
    this.inspector.id = "UC_inspector_for_" + this.model.getName();
    this.inspector.className = "UC_inspector";
    this.inspector.innerHTML = 
    '<table class="UC_inspector_header" width="100%" border="0" ' +
           'cellspacing="0" cellpadding="0"><tr>' +
    '<td class="UC_inspector_close" ' +
    'onclick="this.parentNode.parentNode.' +
    'parentNode.parentNode.style.display=\'none\';"></td>' +
    '<td><h1 id="UC_inspector_header_for_' + this.model.getName()  + '">' +
    'UmlCanvas Inspector</h1></td>' +
    '<td class="UC_inspector_corner"></td></tr></table>' +

    '<div id="UC_inspector_tabs_for_' + this.model.getName() + 
    '" class="UC_inspector_tabs"></div>' +
    '<div id="UC_inspector_content_for_' + this.model.getName() + 
    '"class="UC_inspector_content"></div>' +

    '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr>' +
    '<td class="UC_inspector_status">'+ UmlCanvas.version +'</td>' +
    '<td id="UC_inspector_resize_for_' + this.model.getName() + '"' +
    'class="UC_inspector_resize"></td>' +
    '</tr></table>';

    document.body.appendChild(this.inspector);
  },

  // TODO editor should be plugin
  // TODO generated source might be default
  setupSheets: function setupSheets() {
    this.tabs    = this.getElement( "tabs"    ) ;
    this.content = this.getElement( "content" );

    this.sheetPositions.iterate( function( sheet ) {
      var tab = document.createElement("A");
      tab.id = "UC_inspector_tab_" + sheet.getLabel() + 
      "_for_" + this.model.getName();
      tab.href = "javascript:";
      tab.className ="UC_inspector_tab";
      tab.onclick = function(tabName) { 
        return function() { this.gotoTab(tabName); }.scope(this) 
      }.scope(this)(sheet.getLabel());
      tab.appendChild(document.createTextNode(sheet.getLabel()));
      this.tabs.appendChild(tab);

      this.content.appendChild(sheet.getElement(this.model.getName()));
    }.scope(this) );
  },

  gotoTab: function gotoTab(tab) {
    if( this.currentTab   ) { 
      this.currentTab.className   = "UC_inspector_tab";   
    }
    if( this.currentSheet ) { 
      this.currentSheet.className = "UC_inspector_tab_content"; 
    }

    this.currentTab   = this.getElement( "tab_" + tab );
    this.currentSheet = 
    document.getElementById( "UC_" + tab + "_for_" + this.model.getName() );

    if( this.currentTab   ) { 
      this.currentTab.className = 
      "UC_inspector_tab_selected"; 
    }
    if( this.currentSheet ) { 
      this.currentSheet.className =  "UC_inspector_tab_content_selected";
    }
  },

  wireResizeAndDragHandling: function wireResizeAndDragHandling() {
    ProtoJS.Event.observe( this.getElement("resize"), 'mousedown', 
    function(event) {
      this.resizing = true; 
      this.handleMouseDown(event); 
    }.scope(this) );
    ProtoJS.Event.observe( this.getElement("header"), "mousedown",
    function(event) {
      this.handleMouseDown(event);
      this.dragging = true;
    }.scope(this) );
    ProtoJS.Event.observe( document, 'mouseup', 
    this.handleMouseUp.scope(this) );
    ProtoJS.Event.observe( document, 'mousemove', 
    this.handleMouseMove.scope(this) );
  },

  handleMouseDown : function handleMouseDown(event) {
    if( event.preventDefault ) { event.preventDefault(); }
    event.returnValue = false;
    this.currentPos = this.getXY(event);
  },

  handleMouseMove : function handleMouseMove(event) {
    if( this.resizing || this.dragging ) {
      var pos = this.getXY(event);
      if( this.resizing ) {
        this.resizeBy( pos.x - this.currentPos.x, pos.y - this.currentPos.y );
      } else if( this.dragging ) {
        this.moveBy( pos.x - this.currentPos.x, pos.y - this.currentPos.y );
      }
      this.currentPos = pos;
    }
  },

  handleMouseUp : function handleMouseMove(event) {
    this.resizing = false;
    this.dragging = false;    
  },

  // TODO: move this to ProtoJS and mix in (shared with Canvas2D)
  // maybe even whole resize/dragging code ?
  getXY: function getXY(e) {
    var x,y;
    if( ProtoJS.Browser.IE ) {
      x = event.clientX + document.body.scrollLeft;
      y = event.clientY + document.body.scrollTop;
    } else {
      x = e.pageX;
      y = e.pageY;
    }
    return { x: x, y: y };
  },

  resizeBy: function resizeBy(dx, dy) {
    this.resizeTo( parseInt(this.inspector.style.width) + dx, 
    parseInt(this.inspector.style.height) + dy );
  },

  resizeTo: function resizeTo(w, h) {
    this.inspector.style.width  = ( w >= 300 ? w : 300 ) + "px";
    this.inspector.style.height = ( h >= 150 ? h : 150 ) + "px";

    var widthDiff = ProtoJS.Browser.IE ? 0 : 10;

    this.content.style.width  = 
    ( parseInt(this.inspector.style.width) - widthDiff ) + "px";
    this.content.style.height = 
    ( parseInt(this.inspector.style.height) - 73 ) + "px";

    // FIXME
    if( ProtoJS.Browser.IE ) {
      this.console.style.height = this.content.style.height;
    }

    this.fireEvent( 'changeContentSize', 
    { w: parseInt(this.content.style.width),
      h: parseInt(this.content.style.height) } );
  },

  moveBy: function moveBy(dx, dy) {
    this.moveTo( parseInt(this.inspector.style.left) + dx, 
    parseInt(this.inspector.style.top ) + dy );
  },

  moveTo: function resizeTo(l, t) {
    this.inspector.style.left = (l >= 0 ? l : 0 ) + "px";
    this.inspector.style.top  = (t >= 0 ? t : 0 ) + "px";
  },

  getWidth: function getWidth() {
    return parseInt(this.inspector.style.width);
  },

  getHeight: function getHeight() {
    return parseInt(this.inspector.style.height);    
  },

  show: function show() {
    if( !this.shownBefore ) {
      this.resizeTo( this.model.getWidth(), this.model.getHeight() );
      this.shownBefore = true;
    }
    this.inspector.style.display = "block";
  },

  hide: function hide() {
    this.inspector.style.display = "none";
  },

  wireActivation: function wireActivation() {
    if (UmlCanvas.Config.Inspector.wireActivation) {
      Canvas2D.Keyboard.on( "keyup", 
      function(key) {
        if( this.model.canvas.mouseOver && key == "73" ) {
          this.show();
        }
      }.scope(this));
    }
  }
} );

// mix-in event handling to Canvas2D
ProtoJS.mix( Canvas2D.Factory.extensions.all.EventHandling, 
  UmlCanvas.KickStart.plugins.Inspector.prototype );

/**
 * Manager for Inspector
 */
UmlCanvas.KickStart.plugins.Inspector.Manager = 
  UmlCanvas.PluginManager.extend( 
{
  /**
   * checks whether the model needs this plugin
   * @return boolean true if the plugin needs this plugin, false otherwise
   */
  needsPlugin : function needsPlugin(model) {
    return ! model.canvas.canvas.className.contains("withoutInspector");
  },

  getPluginClass : function getPluginClass() {
    return UmlCanvas.KickStart.plugins.Inspector;
  }
} );
