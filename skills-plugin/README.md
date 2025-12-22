# Skills Plugin with Event Hooks

## Overview

This is an **example implementation** of the OpenCode Skills Plugin that demonstrates how to use **event hooks** (`tool.execute.before` and `tool.execute.after`) to deliver skill content to agents.

## Purpose

This folder shows how to:
- ✅ Implement skills using event hooks
- ✅ Inject skill content before tool execution
- ✅ Enhance output after tool execution
- ✅ Use lookup maps for efficient access
- ✅ Keep tools focused and minimal

## Files

```
skills-plugin/
├── index.ts (315 lines)
│   ├── Skill interface definition
│   ├── Validation schema (Zod)
│   ├── Tool name generation
│   ├── Skill parsing and discovery
│   ├── Skill lookup map creation
│   ├── Minimal tool definitions
│   ├── tool.execute.before hook
│   ├── tool.execute.after hook
│   └── Plugin return object
└── README.md (this file)
```

## Key Features

### 1. Skill Lookup Map
```typescript
const skillMap = new Map<string, Skill>()
for (const skill of skills) {
  skillMap.set(skill.toolName, skill)
}
```
- **Performance:** O(1) access instead of O(n) search
- **Efficiency:** Enables fast hook execution
- **Scalability:** Works with any number of skills

### 2. Minimal Tool Definition
```typescript
async execute() {
  return `Skill activated: ${skill.name}`
}
```
- **Focused:** Only returns confirmation
- **No side effects:** Delivery happens in hooks
- **Testable:** Easy to unit test

### 3. Before Hook: Skill Delivery
```typescript
const beforeHook = async (input: any) => {
  if (input.tool.startsWith("skills_")) {
    const skill = skillMap.get(input.tool)
    if (skill) {
      await ctx.client.session.prompt({
        path: { id: input.sessionID },
        body: {
          agent: input.agent,
          noReply: true,
          parts: [{ type: "text", text: `📚 Skill: ${skill.name}...` }],
        },
      })
    }
  }
}
```
- **Purpose:** Inject skill content
- **When:** Before tool execution
- **Effect:** Skill content persists in conversation

### 4. After Hook: Output Enhancement
```typescript
const afterHook = async (input: any, output: any) => {
  if (input.tool.startsWith("skills_")) {
    const skill = skillMap.get(input.tool)
    if (skill && output.output) {
      output.title = `📚 ${skill.name}`
    }
  }
}
```
- **Purpose:** Add visual feedback
- **When:** After tool execution
- **Effect:** Enhanced output with emoji title

## Architecture Pattern

```
┌─────────────────────────────────────────┐
│ 1. Tool called by agent                 │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 2. tool.execute.before hook fires       │
│    - Inject skill content               │
│    - Skill content persists             │
│    - No AI response triggered           │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 3. Tool.execute() runs                  │
│    - Return confirmation                │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 4. tool.execute.after hook fires        │
│    - Add emoji title                    │
│    - Could add logging/analytics        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 5. Result returned to agent             │
└─────────────────────────────────────────┘
```

## How Skills Work with Hooks

### Tool Definition

The skill tool is simple and focused:

```typescript
async execute() {
  return `Skill activated: ${skill.name}`
}
```

The tool just confirms activation. All skill delivery happens in hooks.

### Before Hook: Skill Delivery

When a skill tool is called, the `tool.execute.before` hook fires first:

```typescript
const beforeHook = async (input) => {
  if (input.tool.startsWith("skills_")) {
    const skill = skillMap.get(input.tool)
    if (skill) {
      // Inject skill content into conversation
      await ctx.client.session.prompt({
        path: { id: input.sessionID },
        body: {
          agent: input.agent,
          noReply: true,  // Don't trigger AI response
          parts: [{ type: "text", text: skill.content }],
        },
      })
    }
  }
}
```

**What happens:**
- Skill content is added to the conversation
- Agent can now see and use the skill
- No AI response is triggered (silent insertion)

### After Hook: Output Enhancement

After the tool executes, the `tool.execute.after` hook fires:

```typescript
const afterHook = async (input, output) => {
  if (input.tool.startsWith("skills_")) {
    const skill = skillMap.get(input.tool)
    if (skill && output.output) {
      output.title = `📚 ${skill.name}`
    }
  }
}
```

**What happens:**
- Output is enhanced with visual feedback
- User sees which skill was activated
- Could add logging or analytics here

## How to Use This Example

### 1. Understand the Implementation
- Read `index.ts` - See how skills are implemented
- Review comments - Understand each section
- Study the hooks - See how they work together

### 2. Learn the Key Components
- **Skill lookup map:** Fast O(1) access to skills
- **Minimal tools:** Tools only return confirmation
- **Before hook:** Injects skill content
- **After hook:** Enhances output with feedback

### 3. Adapt for Your Use Case
1. Create tools for your features
2. Build a lookup map for your data
3. Use `tool.execute.before` to inject context
4. Use `tool.execute.after` to enhance output
5. Keep tools simple and focused

## Related Documentation

### In This Project
- `hook-lifecycle-and-patterns.md` - Visual guide to hook lifecycle
- `implementation-pattern.md` - How to implement hooks in your plugin
- `context/capabilities/events_skills.md` - Practical event hook examples

### In Context Library
- `context/capabilities/events.md` - All available events
- `context/capabilities/tools.md` - Tool definition guide
- `context/reference/best-practices.md` - Best practices

### Reference Implementation
- `my-little-ui/src/hooks/` - Working reference with hooks

## Key Takeaways

1. **Hooks are middleware** - Intercept at specific points
2. **Separation of concerns** - Tools do one thing, hooks do another
3. **Lookup maps** - Enable O(1) access instead of O(n)
4. **Minimal tools** - Keep tools focused and testable
5. **SOLID principles** - Maintain Single Responsibility
6. **Composability** - Hooks can be combined with other plugins
7. **Testability** - Each component can be tested independently
8. **Maintainability** - Changes are isolated to specific hooks

## Code Quality

- ✅ SOLID principles compliant
- ✅ Single Responsibility Principle maintained
- ✅ Loose coupling (hooks separate from tools)
- ✅ High cohesion (related logic grouped)
- ✅ Well-documented with comments
- ✅ Performance optimized (O(1) lookup)

## Next Steps

### Optional Enhancements
1. Extract hooks to separate `hooks.ts` file
2. Add logging to skill delivery
3. Add unit tests for hooks
4. Add error handling
5. Create skills plugin package

### Learning Path
1. Study `index.ts` - Understand the code
2. Read `implementation-pattern.md` - Understand the pattern
3. Review `hook-lifecycle-and-patterns.md` - Learn best practices
4. Study `my-little-ui/src/hooks/` - See working reference
5. Implement in your own plugin

## Questions?

Refer to:
- `implementation-pattern.md` - For detailed explanations
- `hook-lifecycle-and-patterns.md` - For visual guides
- `context/capabilities/events_skills.md` - For practical examples
- `my-little-ui/src/hooks/` - For reference implementation

---

**Status:** ✅ Example Implementation  
**Quality:** ✅ SOLID Compliant  
**Documentation:** ✅ Comprehensive  

This is an example of how to implement skills with event hooks.

