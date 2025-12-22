/**
 * Plugin Information Module
 * 
 * Purpose: Provides metadata and status information about the plugin
 * 
 * This module contains functions that help users understand:
 * - What version of the plugin they're using
 * - Whether the plugin is working correctly
 * - What features are available
 * - How to use the plugin
 * 
 * These functions are used by:
 * - The plugin_info tool
 * - Toast notifications
 * - Status checks
 * - Documentation
 */

/**
 * Function: getPluginVersion()
 * Returns: The current version of the plugin
 */
export const getPluginVersion = (): string => {
  return "1.0.0";
};

/**
 * Function: getPluginName()
 * Returns: The display name of the plugin
 */
export const getPluginName = (): string => {
  return "My UI Plugin";
};

/**
 * Function: getPluginDescription()
 * Returns: A brief description of what the plugin does
 */
export const getPluginDescription = (): string => {
  return "A demonstration OpenCode plugin showcasing core plugin capabilities";
};

/**
 * Function: isPluginActive()
 * Returns: Always true (if this code runs, plugin is active!)
 * 
 * This function confirms the plugin is loaded and working.
 * If you can call this function, the plugin is active.
 */
export const isPluginActive = (): boolean => {
  return true;
};

/**
 * Function: getPluginFeatures()
 * Returns: List of all features the plugin provides
 * 
 * This helps users understand what the plugin can do.
 */
export const getPluginFeatures = (): string[] => {
  return [
    "✅ Session-scoped logging (.tmp/my-little-plugin/)",
    "✅ Custom tool registration (4 tools)",
    "✅ Config modification (custom agents)",
    "✅ Event handling (toast notifications)",
    "✅ Tool execution hooks (output modification)",
  ];
};

/**
 * Function: getPluginTools()
 * Returns: List of all tools provided by the plugin
 */
export const getPluginTools = (): Array<{ name: string; description: string }> => {
  return [
    {
      name: "say_hello",
      description: "Greets someone with optional enthusiasm",
    },
    {
      name: "quick_shell",
      description: "Executes shell commands via Bun's shell API",
    },
    {
      name: "view_logs",
      description: "View the plugin's session logs and recent entries",
    },
    {
      name: "plugin_info",
      description: "Shows information about the plugin",
    },
  ];
};

/**
 * Function: getPluginAgents()
 * Returns: List of custom agents provided by the plugin
 */
export const getPluginAgents = (): Array<{ name: string; description: string }> => {
  return [
    {
      name: "my-helper",
      description: "A friendly demo agent (Claude Sonnet 4)",
    },
  ];
};

/**
 * Function: getPluginStatus()
 * Returns: Overall status information about the plugin
 * 
 * This provides a comprehensive status check showing:
 * - Version
 * - Active status
 * - Feature count
 * - Tool count
 * - Agent count
 */
export const getPluginStatus = () => {
  return {
    name: getPluginName(),
    version: getPluginVersion(),
    description: getPluginDescription(),
    active: isPluginActive(),
    features: getPluginFeatures(),
    tools: getPluginTools(),
    agents: getPluginAgents(),
    emoji: "🚀",
    message: "Plugin is active and working! Enjoy using My Little Plugin! 🎉",
  };
};

/**
 * Function: getWelcomeMessage()
 * Returns: A friendly welcome message for users
 * 
 * This is shown in the toast notification when a session starts.
 */
export const getWelcomeMessage = (logDir: string): string => {
  return `🎉 ${getPluginName()} v${getPluginVersion()} is active! Session logging enabled at: ${logDir}`;
};

/**
 * Function: getPluginTitle()
 * Returns: Formatted title for tool outputs
 */
export const getPluginTitle = (): string => {
  return `ℹ️  ${getPluginName()} v${getPluginVersion()}`;
};
