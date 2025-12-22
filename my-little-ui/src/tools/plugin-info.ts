import { tool } from "@opencode-ai/plugin";
import type { Logger } from "../utils/logger";
import { 
  getPluginName, 
  getPluginVersion, 
  getPluginDescription,
  getPluginTools,
  getPluginAgents,
  getPluginFeatures,
  getPluginStatus
} from "../plugin-info";

/**
 * Plugin Info Tool
 * 
 * Purpose: Provides comprehensive information about the plugin
 * 
 * This tool is self-documenting - it shows users:
 * - Plugin version and status
 * - Current environment details
 * - All available tools with examples
 * - Custom agents
 * - Plugin features
 * 
 * Function: createPluginInfoTool()
 * - Returns formatted plugin information
 * - Uses plugin-info module for version/status
 * - Helps users understand plugin capabilities
 */
export const createPluginInfoTool = (
  getLogger: (sessionID: string) => Logger,
  directory: string
) => {
  return tool({
    description: `Get information about the ${getPluginName()}`,
    args: {},
    async execute(args, context) {
      const logger = getLogger(context.sessionID);
      const status = getPluginStatus();
      const info: string[] = [];
      
      info.push(`# ℹ️  ${getPluginName()} v${getPluginVersion()}`);
      info.push("");
      info.push(getPluginDescription());
      info.push("");
      info.push(`**Status:** ${status.emoji} ${status.message}`);
      info.push("");
      
      info.push("## 📍 Current Environment");
      info.push("```");
      info.push(`Working Directory: ${directory}`);
      info.push(`Session ID: ${context.sessionID.slice(0, 8)}...`);
      info.push(`Active Agent: ${context.agent}`);
      info.push(`Message ID: ${context.messageID}`);
      info.push(`Log Directory: ${logger.getLogDir()}`);
      info.push("```");
      info.push("");
      
      info.push("## 🛠️ Available Tools");
      info.push("");
      getPluginTools().forEach((tool, index) => {
        info.push(`### ${index + 1}. ${tool.name}`);
        info.push(tool.description);
        info.push("");
      });
      
      info.push("## 🤖 Custom Agents");
      getPluginAgents().forEach((agent) => {
        info.push(`- **${agent.name}** - ${agent.description}`);
      });
      info.push("");
      
      info.push("## ✨ Plugin Features");
      getPluginFeatures().forEach((feature) => {
        info.push(`- ${feature}`);
      });
      info.push("");
      
      info.push("---");
      info.push(`*Powered by ${getPluginName()} ${status.emoji}*`);
      
      return info.join("\n");
    },
  });
};
