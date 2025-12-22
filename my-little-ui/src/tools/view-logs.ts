import { tool } from "@opencode-ai/plugin";
import { Logger } from "../utils/logger";

/**
 * View Logs Tool
 * 
 * Purpose: Provides visibility into plugin logging system
 * Features:
 * - Shows current session ID
 * - Displays log directory location
 * - Lists all session logs
 * - Shows recent log entries (configurable number of lines)
 * - Provides helpful commands for log management
 */
export const createViewLogsTool = (
  getLogger: (sessionID: string) => Logger,
  directory: string
) => {
  return tool({
    description: "Show the log file location and recent log entries for the current session",
    args: {
      lines: tool.schema.number().optional().describe("Number of recent lines to show (default 50)"),
    },
    async execute(args, context) {
      const logger = getLogger(context.sessionID);
      const linesToShow = args.lines || 50;
      const logContent = logger.readLogs(linesToShow);
      const allSessions = Logger.getAllSessions(directory);
      
      return `# 📋 Plugin Logs

**Current Session:** \`${context.sessionID}\`
**Log Directory:** \`${logger.getLogDir()}\`
**All Sessions:** ${allSessions.length} session log(s) found

**Recent Entries (last ${linesToShow} lines):**
\`\`\`
${logContent}
\`\`\`

**Log Files Location:**
- Current: \`${logger.getLogPath()}\`
- All logs: \`${logger.getLogDir()}\`

To view live logs: \`tail -f ${logger.getLogPath()}\`
To clean up: Delete the \`.tmp/my-little-plugin\` folder in your project`;
    },
  });
};
