import type { Logger } from "../utils/logger";
import { getPluginTitle } from "../plugin-info";

/**
 * Tool Execution Hooks
 * 
 * Purpose: Intercept and modify tool execution lifecycle
 * 
 * These hooks demonstrate how plugins can:
 * - Monitor tool usage
 * - Log tool calls for debugging
 * - Modify tool outputs
 * - Add metadata to tool results
 * - Implement cross-cutting concerns (logging, analytics, etc.)
 * 
 * Hook Types:
 * - tool.execute.before: Called before tool execution
 * - tool.execute.after: Called after tool execution
 * 
 * Use Cases:
 * - Logging and debugging
 * - Performance monitoring
 * - Output formatting
 * - Error tracking
 * - Usage analytics
 */

/**
 * Function: interceptToolExecutionBefore()
 * 
 * Purpose: Logs tool calls before they execute
 * Hook: tool.execute.before
 * 
 * This function runs before any tool executes and:
 * - Logs the tool name
 * - Logs the arguments passed to the tool
 * - Helps with debugging and monitoring
 */
export const interceptToolExecutionBefore = (getLogger: (sessionID: string) => Logger) => {
  return async (input: any, output: any) => {
    if (input.sessionID) {
      getLogger(input.sessionID).log(`🔧 Tool called: ${input.tool}`, { 
        args: output.args 
      });
    }
  };
};

/**
 * Function: interceptToolExecutionAfter()
 * 
 * Purpose: Logs tool completion and enhances output
 * Hook: tool.execute.after
 * 
 * This function runs after any tool executes and:
 * - Logs successful completion
 * - Adds emoji titles to tool outputs
 * - Enhances user experience with visual feedback
 */
export const interceptToolExecutionAfter = (getLogger: (sessionID: string) => Logger) => {
  return async (input: any, output: any) => {
    // Log completion
    if (input.sessionID) {
      getLogger(input.sessionID).log(`✅ Tool completed: ${input.tool}`, { 
        hasOutput: !!output.output 
      });
    }
    
    // Modify output titles with contextual emojis
    if (output.output) {
      if (input.tool === "say_hello") {
        output.title = `👋 ${output.output.slice(0, 50)}`;
      } else if (input.tool === "plugin_info") {
        output.title = getPluginTitle();
      } else if (input.tool === "view_logs") {
        output.title = "📋 Plugin Logs";
      }
    }
  };
};
