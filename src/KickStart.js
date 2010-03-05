UmlCanvas.KickStart = { plugins: {} };

UmlCanvas.KickStart.Starter = Canvas2D.KickStart.Starter.extend( {
  init: function init() {
    this.manager = new UmlCanvas.Manager();
    this.pluginManagerRepository = 
      new UmlCanvas.KickStart.plugins.PluginManagerRepository();
    this.setupPluginsFactories();
  },

  setupPluginsFactories : function setupPluginsFactories() {
    $H(UmlCanvas.KickStart.plugins).iterate(function(name, plugin) {
      if( plugin["Manager"] ) {
        var manager = new (plugin.Manager)();
        this.pluginManagerRepository.setManager(name, manager);
      }
    }.scope(this) );
  },

  getTag: function() {
    return "UmlCanvas";
  },

  makeInstance: function( name ) {
    var umlcanvas = this.manager.setupModel(name);
    var ps = [];
    this.pluginManagerRepository.getManagers().iterate(function(plugin) {
      var instance = plugin.setup(umlcanvas, this.pluginManagerRepository);
      if( typeof instance != "undefined" ) { ps.push(instance); }
    }.scope(this) );
    // TODO: move to event driven approach ;-)
    ps.iterate(function(plugin) {
      if (plugin.activate) {
        plugin.activate(umlcanvas);
      }
    }.scope(this) );
    return umlcanvas;
  }
} );

ProtoJS.Event.observe(window, 'load', function() { 
  UmlCanvas.KickStarter = new UmlCanvas.KickStart.Starter();
  UmlCanvas.KickStarter.on("ready",function(){UmlCanvas.fireEvent("ready");});
  UmlCanvas.KickStarter.start(); 
} );
