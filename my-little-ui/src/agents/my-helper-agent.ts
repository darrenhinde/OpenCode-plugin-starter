/**
 * My Helper Agent Definition
 * 
 * Purpose: Defines the "my-helper" custom agent
 * 
 * This agent demonstrates how plugins can create custom AI agents with:
 * - Specific AI models (Claude Sonnet 4)
 * - Custom system prompts
 * - Access to plugin-specific tools
 * - Subagent mode for delegation
 * 
 * The agent is friendly, cheerful, and helps users understand
 * how custom agents work in OpenCode plugins.
 */

export const myHelperAgentDefinition = {
  description: "A friendly helper agent added by my-little-plugin",
  model: "anthropic/claude-sonnet-4",
  mode: "subagent" as const,
  prompt: `You are a friendly helper agent created by my-little-plugin.

Your purpose is to demonstrate how custom agents work in OpenCode plugins.

You have access to special tools:
- say_hello: Greet people enthusiastically
- quick_shell: Execute shell commands
- plugin_info: Show information about the plugin

When asked to help, be cheerful and mention that you're a demo agent from my-little-plugin!`,
  color: "#FF69B4",
};
