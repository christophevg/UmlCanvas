// TODO koen - refactor: Editor/toolbar should be extracted to its own class

UmlCanvas.KickStart.plugins.HuC = Class.extend( {

  init: function init(umlcanvas, pluginManagerRepository) {
    this.umlcanvas = umlcanvas;
    this.pluginManagerRepository = pluginManagerRepository;

    this.initSheets();
    
    this.setupSource();
  },
  
  initSheets: function initSheets() {
    if (this.isInspectorAvailable()) {
      if( inspector = this.getInspector() ) {
        with(inspector) {
          addSheet(0, 'editor', this.createEditorSheet());
	        addSheet(1, 'properties', this.createPropertiesSheet());
	        removeSheet('source');
	        on( 'changeContentSize', this.handleInspectorResize.scope(this) );
	      }
      }
    }
  },
  
  handleInspectorResize: function handleInspectorResize(geo) {
    if( geo.h > 24 + 75 ) {
      this.editor.style.height = ( geo.h - 24 - 75 ) + "px";
    }
  },
  
  /**
   * Gets the umlcanvas element for the given name.
   * @param name the name of a component
   * @return an element
   * TODO koen - refactor : Widget.js has identical functions
   */
  getElement: function getElement(name) {
      return document.getElementById( 
	      "UC_" + name + "_for_" + this.umlcanvas.name );
  },
  
  /**
   * Provides the editor element.
   * @return the editor element
   */
  getEditor: function getEditor() {
      return this.editor;
  },
  
  /**
   * Creates the editor element.
   * @return the editor element
   */
  createEditorSheet: function createEditorSheet() {
      var container = document.createElement('div');
      
      container.style.overflow = 'hidden';
      
      container.appendChild(this.createEditorToolbar());
      container.appendChild(this.createEditorTextPane());
      container.appendChild(this.createErrorTextPane());

      return container;
  },
  
  /**
   * Creates the properties element.
   * @return the properties element
   */
  // TODO koen - refactor: extract class
  createPropertiesSheet: function createPropertiesSheet() {
      var container = document.createElement('div');
      this.propertiesForm = document.createElement('form');
      this.propertiesForm.id = "UC_propertiesForm_for_" + this.umlcanvas.name;
      var table = document.createElement('table');
      table.className = "UC_inspector_properties";
      this.setupProperties();
      this.propertyFields = {};
      
      this.props.iterate(function (prop) {
        var tb = document.createElement('tbody');
        var tr = document.createElement('tr');
        var th = document.createElement('th');
	var td = document.createElement('td');

	var field;
	if ('string' == prop.type && 100 < prop.maxlength) {
	    field = document.createElement('textarea');
	} else if ('string' == prop.type || 'integer' == prop.type) {
	    field = document.createElement('input');
	    field.name = "text";
	} else if ('author' == prop.id) {
	    field = document.createElement('a');
	    field.href = 'http://hosted.umlcanvas.org';
	    field.target = '_blank';
	}
	  
	// FIXME: find other solution for setAttribute (eg onkeypress)
	// field.setAttribute('maxlength', prop.maxlength);
	  
	th.innerHTML = prop.label;
	field.id = "UC_" + prop.id + "_for_" + this.umlcanvas.name;
	ProtoJS.Event.observe(field, 'blur', function() {
	    this.validateField(field, prop);
	    this.updateDiagram();
	}.scope(this) );
	  
	td.appendChild(field);
	tr.appendChild(th);
	tr.appendChild(td);
	tb.appendChild(tr);
	table.appendChild(tb);
	      
    	this.propertyFields[prop.id] = field;
      }.scope(this) );
      
      this.propertiesForm.appendChild(table);

      container.appendChild(this.createEditorToolbar());
      container.appendChild(this.propertiesForm);
      
      return container;
  },

  /**
   * Initializes diagram properties.
   */
  setupProperties : function setupProperties() {
      /*
       * array of (form) properties, consisting out of id, name, type, 
       * min length, max length
       */ 
      this.props = [
        { id : 'name', label : 'Name', type : 'string', minlength : 1, maxlength : 25 },
        { id : 'descr', label : 'Description', type : 'string', minlength : 1, maxlength : 1000 },
        { id : 'width', label : 'Width', type : 'integer', minlength : 2, maxlength : 3 },
        { id : 'height', label : 'Height', type : 'integer', minlength : 2, maxlength : 3 },
        { id : 'notes', label : 'Notes', type : 'string' , minlength : 0, maxlength : 1000 },
        { id : 'author', label : 'Author', type : 'link' , minlength : 0, maxlength : 1000 }
      ];
  },
  
  /**
   * Validates all fields.
   */
  validateFields : function validateFields() {
      var valid = true;
      this.props.iterate(function (prop) {
        valid = this.validateField(this.getElement(prop.id), prop) && valid;
      }.scope(this) );
      return valid;
  },
   
  /**
   * Validates whether the field fulfills its specification.
   * @param field the field element
   * @param prop the specification of the field
   */
  validateField : function validateField(field, prop) {
      var valid = true;
      
      if (field.type != 'link') {
        field.style.backgroundColor = '#FFF';
        if ('integer' == prop.type) {
	    if (isNaN(parseInt(field.value, 10))) {
	        field.value = 0;
  	    } else {
	        field.value = parseInt(field.value, 10);
	    }
        }
        if (field.value.length > prop.maxlength) {
          field.value = field.value.substring(0, prop.maxlength);
        }
        if (field.value.length < prop.minlength) {
	  field.style.backgroundColor = '#faa';
	  valid = false;
        }
      }
      
      return valid;
  },
  
  /**
   * Creates the editor toolbar.
   * @return the editor toolbar
   */
  createEditorToolbar: function createEditorToolbar() {
      var toolbar = new UmlCanvas.KickStart.plugins.HuC.Toolbar();
      
      toolbar.addAction(
	      UmlCanvas.Config.Inspector.Icons.save,
	      "Save",
	      function() {
		  return function() {
		    if (this.validateFields()) {
		      this.saveDiagram( {
			id: this.umlcanvas.name,
			src: this.getEditor().value,
			name: this.getElement('name').value,
			descr: this.getElement('descr').value,
			width: this.getElement('width').value,
			height: this.getElement('height').value,
			notes: this.getElement('notes').value
		      } );
		    } else {
			this.getInspector().gotoTab('properties'); 
		    }
		  }.scope(this);
	      }.scope(this)());
      
      toolbar.addAction(
	      UmlCanvas.Config.Inspector.Icons.reload, 
	      "Reload",
	      function() { 
		  return function() { 
		    var reload = confirm(
	              "Do you want to reload this diagram? \n\n" + 
		      "If you reload this diagram, all changes made after your " + 
		      "last save action will be lost.");
		    if (reload) {
	              this.loadDiagram();
		    }
		  }.scope(this);
	      }.scope(this)());
      
      return toolbar.getToolbar();
  },
  
  /**
   * Creates the editor text pane.
   * @return the editor text pane
   */
  createEditorTextPane: function createEditorTextPane() {
      this.editor = document.createElement('textarea');
      
      this.editor.id = "UC_editorPane_for_" + this.umlcanvas.name;
      // TODO koen - style via css file
      this.editor.style.resize = "none";
      //editor.style.height = "70%";
      this.editor.style.border = "0px solid white";
      
      return this.editor;
  },
  
  createErrorTextPane: function createErrorTextPane() {
      var errorPane = document.createElement('textarea');
      
      errorPane.id = "UC_errors_for_" + this.umlcanvas.name;
      // TODO koen - style via css file
      errorPane.style.resize = "none";
      errorPane.style.height = "75px";
      
      return errorPane;
  },
  
  /**
   * Checks whether the Inspector plugin manager is present.
   * @return true if the Inspector plugin manager is present
   */
  isInspectorAvailable: function isInspectorAvailable() {
      return this.pluginManagerRepository.getManager('Inspector') != null;
  },
  
  /**
   * Gets the manager of the Inspector plugin.
   * @return the Inspector plugin manager
   */
  getInspector: function getInspector() {
      return this.pluginManagerRepository.getManager('Inspector')
	    .getInspector(this.umlcanvas.name);
  },
  
  /**
   * Loads the diagram from HuC if the UmlCanvas has no local source.
   */
  setupSource: function setupSource() {
      if (!this.hasLocalSource()) {
	  this.loadDiagram();
      }
  },

  /**
   * Checks whether the UmlCanvas has local source.
   * @return true if the UmlCanvas has local source, false otherwise
   */
  hasLocalSource : function hasLocalSource() {
      return document.getElementById(this.umlcanvas.name + "Source") != null;
  },
  
  /**
   * Provides the UmlCanvas element of the document.
   * @return the UmlCanvas element
   */
  getCanvasElement: function getCanvasElement() {
      return this.umlcanvas;
  },

  decodeHTMLSpecialCharacters: function decodeHTMLSpecialCharacters(str) {
    return str.replace( /&quot;/g, '"' );
  },

  /**
   * Loads the diagram from HuC.
   */
  loadDiagram: function loadDiagram() {
    if( this.umlcanvas.name == "" ) { return this.loadProperties(); }
    new ProtoJS.Ajax()
    	.fetch( UmlCanvas.Config.HuC.repository_url + this.umlcanvas.name + ':json', 
    	function(properties) {
    	    this.umlcanvas.load(this.decodeHTMLSpecialCharacters(properties.src));
    	    this.loadProperties(properties);
    	    this.updateDiagram();
    	}.scope(this));
  },
  
  /**
   * Loads the properties of the diagram.
   * @param props the props to load
   */
  loadProperties: function loadProperties(props) {
    props = props || { width: this.getCanvasElement().getWidth(),
                       height: this.getCanvasElement().getHeight() };
    this.propertiesForm.reset();
    $H(props).iterate(function(name) {
	    if ( this.propertyFields[name] != null) {
	      //FIXME encapsulate when properties sheet is extracted to its own class
	      if ('author' == name) {
		  this.propertyFields[name].innerHTML = props[name];
		  this.propertyFields[name].href = 
		      UmlCanvas.Config.HuC.repository_url + '~'  + props[name];
	      }
	      this.propertyFields[name].value = props[name];
	    }
    }.scope(this) );
  },
  
  /**
   * Updates the diagram.
   */
  updateDiagram: function updateDiagram() {
      this.getCanvasElement()
       .setSize( this.propertyFields['width'].value,
                 this.propertyFields['height'].value );
  },
  
  /**
   * Saves the given diagram
   */
  saveDiagram: function saveDiagram(params) {
      var form = document.getElementById('submitForm');
      
      if (!form) {
	  form = document.createElement("form");
	  form.id = 'submitForm'; 
	  form.method = 'post';
	  form.action = UmlCanvas.Config.HuC.repository_submit_url;
	  form.target = "formresult";

	  this.submitFields = {};
	  for(var key in params) {
	      var hiddenField = document.createElement("input");
	      this.submitFields[key] = hiddenField;
	      
	      hiddenField.type = "hidden";
	      hiddenField.name = key;
	      
	      form.appendChild(hiddenField);
	  }

	  document.body.appendChild(form);
      }      

      for(var key in params) {
	  this.submitFields[key].value = params[key];
      }
      
      window.open('', 'formresult');

      form.submit();
  }
  
} );

/**
 * Toolbar for the HuC editor pane.
 */
UmlCanvas.KickStart.plugins.HuC.Toolbar = Class.extend( {
    
    /**
     * Creates a toolbar.
     */
    init: function init() {
    	this.toolbar = document.createElement('div');
    	this.toolbar.className = "UC_toolbar";
    },
    
    /**
     * Provides the toolbar element.
     * @return an element
     */
    getToolbar: function getToolbar() {
	return this.toolbar;
    },
    
    /**
     * Adds an action to the toolbar.
     * @param src the (img) src for the action
     * @param alt alternative text for the image
     * @param command the command that should be executed when the toolbar icon 
     * is clicked
     */
    addAction: function addAction(src, alt, command) {
	var action = document.createElement('img');

	action.src = src;
	action.alt = alt;
	action.onclick = command;
	    
	this.toolbar.appendChild(action);
    }
    
} );

UmlCanvas.KickStart.plugins.HuC.Manager = Class.extend( {
  /**
   * Creates a new HuC plugin.
   * @param umlcanvas the umlcanvas
   * @param pluginManagerRepository the PluginManagerRepository
   * @return a HuC plugin
   */
  setup: function setup(umlcanvas, pluginManagerRepository) {
    return new UmlCanvas.KickStart.plugins.HuC(
      umlcanvas, pluginManagerRepository);
  }
} );
