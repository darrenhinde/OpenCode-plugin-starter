import { tool } from "@opencode-ai/plugin";
import type { Logger } from "../utils/logger";

/**
 * Quick Shell Tool
 * 
 * Purpose: Executes shell commands using Bun's shell API
 * Features:
 * - Runs any shell command
 * - Returns trimmed output
 * - Logs execution and errors
 * - Uses Bun's $ template literal for safe execution
 * 
 * Security Note: This tool executes arbitrary commands.
 * In production, consider adding command validation/whitelisting.
 */
export const createQuickShellTool = (
  getLogger: (sessionID: string) => Logger,
  $: any
) => {
  return tool({
    description: "Executes a shell command and returns the output",
    args: {
      command: tool.schema.string().describe("The shell command to execute"),
    },
    async execute(args, context) {
      const logger = getLogger(context.sessionID);
      logger.log("quick_shell called", { command: args.command });
      
      try {
        const result = await $`${args.command}`.text();
        logger.log("quick_shell success", { command: args.command });
        return result.trim();
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        logger.log("quick_shell error", { command: args.command, error: errorMsg });
        throw error;
      }
    },
  });
};
