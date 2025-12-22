import type { Logger } from "../utils/logger";
import { interceptToolExecutionBefore, interceptToolExecutionAfter } from "./tool-hooks";

/**
 * Hooks Module
 * 
 * Purpose: Sets up OpenCode lifecycle hooks for tool execution
 * 
 * This module provides hooks that intercept tool execution:
 * - tool.execute.before: Runs before any tool executes
 * - tool.execute.after: Runs after any tool completes
 * 
 * Function: setupToolExecutionHooks()
 * - Creates before/after hook handlers
 * - Enables logging and monitoring
 * - Enhances tool outputs with emojis
 * - Returns hook handlers for OpenCode
 * 
 * Hooks allow plugins to:
 * - Monitor tool usage
 * - Log for debugging
 * - Modify tool outputs
 * - Add metadata to results
 */

export const setupToolExecutionHooks = (getLogger: (sessionID: string) => Logger) => {
  return {
    before: interceptToolExecutionBefore(getLogger),
    after: interceptToolExecutionAfter(getLogger),
  };
};
