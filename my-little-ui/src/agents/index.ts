import { myHelperAgentDefinition } from "./my-helper-agent";

/**
 * Agents Module
 * 
 * Purpose: Registers custom agents into OpenCode
 * 
 * This module handles the registration of custom AI agents.
 * Custom agents extend OpenCode's capabilities by:
 * - Using specific AI models
 * - Having specialized prompts
 * - Accessing plugin-specific tools
 * - Operating as subagents
 * 
 * Function: registerCustomAgents()
 * - Takes the current OpenCode config
 * - Injects custom agent definitions
 * - Returns modified config with new agents
 */

export const registerCustomAgents = async (config: any) => {
  // Register the my-helper agent
  if (!config.agent) config.agent = {};
  
  config.agent["my-helper"] = myHelperAgentDefinition;
  
  // Future: Add more custom agents here
  // config.agent["another-agent"] = anotherAgentDefinition;
  
  return config;
};
