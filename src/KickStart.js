UmlCanvas.KickStart = { plugins: {} };

UmlCanvas.KickStart.Starter = Canvas2D.KickStart.Starter.extend( {
  init: function init() {
    this.manager = new UmlCanvas.Manager();
    this.pluginManagerRepository = 
      new UmlCanvas.KickStart.PluginManagerRepository();
    this.setupPluginsFactories();
  },

  setupPluginsFactories : function setupPluginsFactories() {
    $H(UmlCanvas.KickStart.plugins).iterate(function(name, plugin) {
      if( plugin["Manager"] ) {
        this.pluginManagerRepository.setManager( name, new plugin.Manager() );
      }
    }.scope(this) );
  },

  getTag: function getTag() {
    return "UmlCanvas";
  },

  makeInstance: function makeInstance( modelId ) {
    // setup the Model
    var model = this.manager.setupModel( modelId );

    // activate the Widget Framework around the UmlCanvas
    UmlCanvas.Widget.setup(model);

    // create an instance of each plugin and add it to the UmlCanvas
    this.pluginManagerRepository.getManagers().iterate(function(manager) {
      if( manager.needsPlugin( model ) ) {
        model.addPlugin( manager.setup( model ) );
      }
    }.scope(this) );

    // activate all plugins on the UmlCanvas
    model.activatePlugins();

    return model;
  }
} );

ProtoJS.Event.observe(window, 'load', function() { 
  with( UmlCanvas.KickStarter = new UmlCanvas.KickStart.Starter() ) {
    on( "ready", function() { UmlCanvas.fireEvent("ready"); } );
    start(); 
  }
} );
