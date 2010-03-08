UmlCanvas.KickStart.PluginManagerRepository = Class.extend( {

  /**
  * Creates a PluginManagerRepository.
  */
  init: function() {
    this.managers = {};
  },

  /**
  * Sets the Manager of a plugin.
  * @param plugin the name of a plugin
  * @param manager the manager
  */
  setManager: function setManager(plugin, manager) {
    this.managers[plugin] = manager;
  },

  /**
  * Gets the manager.
  * @param plugin the name of the plugin
  * @return the manager of the plugin 
  */
  getManager: function getManager(plugin) {
    return this.managers[plugin];
  },

  /**
  * Provides all managers.
  * @return all managers
  */
  getManagers: function getManagers() {
    return $H(this.managers).values();
  }
} );
