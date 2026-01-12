# OpenCode Plugin Starter & Demo
 Tutorial Video:
https://youtu.be/Wu3G1QwM81M

This repository is a comprehensive starter kit and demonstration of OpenCode's extensibility. It includes a modular demo plugin and a structured library of context files for AI-assisted development.

## 📁 Repository Structure

- `my-little-ui/`: A fully functional, modular OpenCode plugin.
  - Custom tools, agents, lifecycle hooks, and tool interception.
- `context/`: A library of Markdown files designed to provide LLMs with the knowledge needed to build OpenCode plugins.
- `.opencode/`: OpenCode configuration and custom agents for this repository.
  - `opencode.json`: Project-level configuration.
  - `agent/codebase-agent.md`: A specialized agent for building and maintaining this plugin, pre-configured with access to the `context/` library.
- `config.json`: Example OpenCode configuration for local plugin development.
- `package.json`: Root configuration referencing the local plugin.

## 🚀 Local Development

OpenCode makes local plugin development easy. This repo is set up so you can work on `my-little-ui` and see changes immediately.

1. **Build the plugin**:
   ```bash
   bun build my-little-ui/src/index.ts --outdir my-little-ui/dist --target bun --format esm
   ```
   Or using the root script:
   ```bash
   bun run build:plugin
   ```
   This bundles everything into a single file (e.g., `my-little-ui/dist/index.js`) that OpenCode can execute.
2. **Configure OpenCode**:
   The root `config.json` tells OpenCode to load the `my-little-ui` plugin.
3. **Reference local plugin**:
   The root `package.json` uses a local file reference: `"my-little-ui": "file:./my-little-ui"`.

## 📚 AI Context Library

The `context/` folder is organized as a library. You can provide these files to an AI coding assistant to help it build features for you:

- [Context Overview](./context/context-overview.md) - **Start here!**
- **Architecture**: [Overview](./context/architecture/overview.md), [Lifecycle](./context/architecture/lifecycle.md)
- **Capabilities**: [Events](./context/capabilities/events.md), [Tools](./context/capabilities/tools.md), [Agents](./context/capabilities/agents.md)
- **Reference**: [Best Practices](./context/reference/best-practices.md)

## 🛠️ Key Plugin Features

- **Interception Hooks**: Log or block tool executions before/after they happen.
- **Custom Agents**: Register specialized AI personalities with scoped toolsets.
- **Autonomous Tools**: Add logic (shell scripts, API calls) that agents can call.
- **Session Logging**: Isolated logging for every conversation.

Happy building! 🚀
