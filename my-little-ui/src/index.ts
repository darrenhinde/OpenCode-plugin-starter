import type { Plugin } from "@opencode-ai/plugin";
import { Logger } from "./utils/logger";
import { registerPluginTools } from "./tools";
import { registerCustomAgents } from "./agents";
import { setupLifecycleHandlers } from "./lifecycle";
import { setupToolExecutionHooks } from "./hooks";
import { getPluginName, getPluginVersion, getPluginDescription } from "./plugin-info";

/**
 * My Little Plugin
 * 
 * Version: 1.0.0
 * Description: A demonstration OpenCode plugin showcasing core plugin capabilities
 * 
 * ============================================================================
 * PLUGIN ARCHITECTURE
 * ============================================================================
 * 
 * This plugin is organized into clear, modular components:
 * 
 * 1. 📦 UTILS (src/utils/)
 *    - logger.ts: Session-scoped logging utility
 *    Purpose: Provides logging for debugging and monitoring
 * 
 * 2. 🛠️  TOOLS (src/tools/)
 *    - say-hello.ts: Greeting tool with enthusiasm option
 *    - quick-shell.ts: Shell command execution
 *    - view-logs.ts: Log viewing and management
 *    - plugin-info.ts: Self-documentation tool
 *    Purpose: Custom tools that agents can use
 *    Function: registerPluginTools()
 * 
 * 3. 🤖 AGENTS (src/agents/)
 *    - my-helper-agent.ts: Custom agent definition
 *    Purpose: Registers custom AI agents into OpenCode
 *    Function: registerCustomAgents()
 * 
 * 4. 🔄 LIFECYCLE (src/lifecycle/)
 *    - on-session-created.ts: Session creation handler
 *    Purpose: Handles OpenCode lifecycle events
 *    Function: setupLifecycleHandlers()
 * 
 * 5. 🪝 HOOKS (src/hooks/)
 *    - tool-hooks.ts: Before/after execution hooks
 *    Purpose: Intercepts tool execution for logging and enhancement
 *    Function: setupToolExecutionHooks()
 * 
 * 6. ℹ️  PLUGIN INFO (src/plugin-info.ts)
 *    - Version management
 *    - Status checks
 *    - Feature documentation
 *    Purpose: Centralized plugin metadata and status
 *    Functions: getPluginVersion(), getPluginStatus(), etc.
 * 
 * ============================================================================
 * PLUGIN FEATURES
 * ============================================================================
 * 
 * ✅ Session-scoped logging (.tmp/my-little-plugin/)
 * ✅ Custom tool registration (4 tools)
 * ✅ Custom agent registration (my-helper)
 * ✅ Lifecycle event handling (toast notifications)
 * ✅ Tool execution hooks (logging & output modification)
 * ✅ Version tracking and status reporting
 * 
 * ============================================================================
 * BENEFITS OF THIS ARCHITECTURE
 * ============================================================================
 * 
 * 📁 Clear separation of concerns - Each module has one job
 * 🔍 Easy to understand - File names match their purpose
 * 🧪 Testable - Each module can be tested independently
 * 📈 Scalable - Easy to add new features without complexity
 * 🛠️  Maintainable - Changes are isolated to specific modules
 * 📚 Self-documenting - Function names describe what they do
 * 
 * ============================================================================
 */

const MyLittlePlugin: Plugin = async ({ client, directory, $ }) => {
  // ============================================================================
  // LOGGER SETUP
  // ============================================================================
  // Initialize session-scoped logger management
  // Each session gets its own logger instance for isolated logging
  
  const loggers = new Map<string, Logger>();
  
  const getLogger = (sessionID: string): Logger => {
    if (!loggers.has(sessionID)) {
      loggers.set(sessionID, new Logger(directory, sessionID));
    }
    return loggers.get(sessionID)!;
  };

  // ============================================================================
  // COMPONENT INITIALIZATION
  // ============================================================================
  // Create all plugin components using factory functions
  // Each function returns configured handlers for OpenCode
  
  const tools = registerPluginTools({ getLogger, directory, $ });
  const hooks = setupToolExecutionHooks(getLogger);
  const lifecycleHandler = setupLifecycleHandlers(directory, client);

  // ============================================================================
  // PLUGIN DEFINITION
  // ============================================================================
  // Return the plugin object that OpenCode will use
  // This defines all the plugin's capabilities and hooks
  
  return {
    /**
     * FEATURE 1: Custom Tools
     * 
     * Function: registerPluginTools()
     * Location: src/tools/index.ts
     * 
     * Registers 4 custom tools that agents can use:
     * - say_hello: Greet users
     * - quick_shell: Execute shell commands
     * - view_logs: View session logs
     * - plugin_info: Show plugin information
     */
    tool: tools,

    /**
     * FEATURE 2: Custom Agents
     * 
     * Function: registerCustomAgents()
     * Location: src/agents/index.ts
     * 
     * Registers custom AI agents:
     * - my-helper: Friendly demo agent (Claude Sonnet 4)
     */
    config: async (config) => {
      return registerCustomAgents(config);
    },

    /**
     * FEATURE 3: Lifecycle Events
     * 
     * Function: setupLifecycleHandlers()
     * Location: src/lifecycle/index.ts
     * 
     * Handles OpenCode lifecycle events:
     * - session.created: Shows welcome toast with version
     */
    event: lifecycleHandler,

    /**
     * FEATURE 4: Tool Execution Hooks
     * 
     * Function: setupToolExecutionHooks()
     * Location: src/hooks/index.ts
     * 
     * Intercepts tool execution:
     * - tool.execute.before: Logs tool calls
     * - tool.execute.after: Logs completion, adds emoji titles
     */
    "tool.execute.before": hooks.before,
    "tool.execute.after": hooks.after,
  };
};

// ============================================================================
// EXPORT
// ============================================================================
// Export the plugin for OpenCode to load

export default MyLittlePlugin;
