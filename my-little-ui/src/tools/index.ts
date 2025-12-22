import type { Logger } from "../utils/logger";
import { createSayHelloTool } from "./say-hello";
import { createQuickShellTool } from "./quick-shell";
import { createViewLogsTool } from "./view-logs";
import { createPluginInfoTool } from "./plugin-info";

/**
 * Tools Module
 * 
 * Purpose: Registers all custom tools for the plugin
 * 
 * This module provides tools that agents can use:
 * - say_hello: Greet users with optional enthusiasm
 * - quick_shell: Execute shell commands
 * - view_logs: View session logs
 * - plugin_info: Show plugin information
 * 
 * Function: registerPluginTools()
 * - Takes dependencies (logger, directory, shell)
 * - Creates all tool instances
 * - Returns tool registry for OpenCode
 * 
 * Benefits:
 * - Clear separation of concerns
 * - Easy to test individual tools
 * - Simple to add new tools
 * - Dependencies are explicit
 */

export interface ToolFactoryDeps {
  getLogger: (sessionID: string) => Logger;
  directory: string;
  $: any;
}

export const registerPluginTools = ({ getLogger, directory, $ }: ToolFactoryDeps) => {
  return {
    say_hello: createSayHelloTool(getLogger),
    quick_shell: createQuickShellTool(getLogger, $),
    view_logs: createViewLogsTool(getLogger, directory),
    plugin_info: createPluginInfoTool(getLogger, directory),
  };
};
