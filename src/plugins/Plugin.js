/**
 * Plugin interface
 */
UmlCanvas.Plugin = Class.extend( {
  getName : function getName() {
    throw( "Plugin must implement getName()." );
  },

  activate : function activate() {
    throw( "Plugin must implement activate()." );
  }
} );

/**
 * Abstract PluginManager BaseClass
 */
UmlCanvas.PluginManager = Class.extend( {
  getPluginClass : function getPluginClass() {
    throw( "PluginManager must implement getPluginClass()." );
  },
  
  setup : function setup( model ) { 
    throw( "PluginManager must implement setup()." ) 
  },

  needsPlugin : function needsPlugin() { return false; },
  /**
   * Creates a new inspector.
   * @param model the UmlCanvas' model for which the Inspector is created.
   * @return an Inspector for the given model
   */
  setup: function setup(model) {
    return new (this.getPluginClass())(model);
  }
} );
