import { tool } from "@opencode-ai/plugin";
import type { Logger } from "../utils/logger";

/**
 * Say Hello Tool
 * 
 * Purpose: Demonstrates a simple custom tool that greets users
 * Features:
 * - Takes a name parameter
 * - Optional enthusiasm flag for extra excitement
 * - Logs all interactions
 */
export const createSayHelloTool = (getLogger: (sessionID: string) => Logger) => {
  return tool({
    description: "Says hello to someone with a custom message",
    args: {
      name: tool.schema.string().describe("The name of the person to greet"),
      enthusiastic: tool.schema
        .boolean()
        .optional()
        .describe("Whether to add extra enthusiasm"),
    },
    async execute(args, context) {
      const logger = getLogger(context.sessionID);
      logger.log("say_hello called", { name: args.name, enthusiastic: args.enthusiastic });
      
      const greeting = args.enthusiastic
        ? `HELLO ${args.name.toUpperCase()}! 🎉🎉🎉`
        : `Hello, ${args.name}!`;
      
      logger.log("say_hello greeting generated", { greeting });
      
      return greeting;
    },
  });
};
