# Implementation Pattern: Using Event Hooks

## Overview

This document explains how to implement event hooks in your OpenCode plugin. The Skills Plugin demonstrates this pattern with `tool.execute.before` and `tool.execute.after` hooks.

---

## What Are Event Hooks?

Event hooks are functions that run at specific points in the tool execution lifecycle:

- **`tool.execute.before`** - Runs before a tool executes
- **`tool.execute.after`** - Runs after a tool completes

They allow you to:
- Inject context before execution
- Enhance output after execution
- Log tool usage
- Validate inputs
- Transform results

---

## Basic Hook Structure

### Before Hook

```typescript
const beforeHook = async (input: any, output: any) => {
  // input.tool - tool name
  // input.sessionID - session ID
  // input.agent - agent name
  // output.args - tool arguments
  
  if (input.tool === "my_tool") {
    // Do something before tool runs
  }
}
```

### After Hook

```typescript
const afterHook = async (input: any, output: any) => {
  // input.tool - tool name
  // input.sessionID - session ID
  // output.output - tool result
  // output.title - can be modified
  
  if (input.tool === "my_tool") {
    // Do something after tool runs
  }
}
```

---

## Skills Plugin Example

### Skill Lookup Map

First, create a map for fast access to your data:

```typescript
const skillMap = new Map<string, Skill>()
for (const skill of skills) {
  skillMap.set(skill.toolName, skill)
}
```

**Why?** O(1) lookup instead of O(n) search.

### Tool Definition

Keep tools simple and focused:

```typescript
tools[skill.toolName] = tool({
  description: skill.description,
  args: {},
  async execute() {
    return `Skill activated: ${skill.name}`
  },
})
```

### Before Hook: Inject Skill Content

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
          parts: [
            {
              type: "text",
              text: `📚 Skill: ${skill.name}\n\n${skill.content}`,
            },
          ],
        },
      })
    }
  }
}
```

**What it does:**
- Checks if tool is a skill
- Looks up skill in map
- Injects skill content into conversation
- `noReply: true` prevents AI response

### After Hook: Enhance Output

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

**What it does:**
- Checks if tool is a skill
- Looks up skill in map
- Adds emoji title to output
- Provides visual feedback

### Register Hooks

```typescript
return {
  tool: tools,
  "tool.execute.before": beforeHook,
  "tool.execute.after": afterHook,
}
```

---

## Common Patterns

### Pattern 1: Tool-Specific Hooks

```typescript
const beforeHook = async (input, output) => {
  switch (input.tool) {
    case "skill_1":
      // Handle skill 1
      break
    case "skill_2":
      // Handle skill 2
      break
    default:
      // Skip other tools
  }
}
```

### Pattern 2: Prefix-Based Filtering

```typescript
const beforeHook = async (input, output) => {
  if (input.tool.startsWith("skills_")) {
    // Handle all skill tools
  }
}
```

### Pattern 3: Conditional Processing

```typescript
const beforeHook = async (input, output) => {
  if (input.tool.startsWith("skills_")) {
    const skill = skillMap.get(input.tool)
    if (skill && skill.enabled) {
      // Process only if enabled
    }
  }
}
```

### Pattern 4: Logging

```typescript
const beforeHook = async (input, output) => {
  console.log(`[BEFORE] Tool: ${input.tool}`)
  console.log(`[BEFORE] Args:`, output.args)
}

const afterHook = async (input, output) => {
  console.log(`[AFTER] Tool: ${input.tool}`)
  console.log(`[AFTER] Result:`, output.output)
}
```

### Pattern 5: Error Handling

```typescript
const beforeHook = async (input, output) => {
  try {
    if (input.tool === "my_tool") {
      const data = dataMap.get(input.tool)
      if (!data) {
        throw new Error(`Data not found: ${input.tool}`)
      }
      // Process
    }
  } catch (error) {
    console.error(`Hook error:`, error)
    // Don't rethrow - let tool execute anyway
  }
}
```

---

## Hook Execution Flow

```
┌─────────────────────────────────────────┐
│ 1. Agent calls tool                     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 2. tool.execute.before hook fires       │
│    - Inject context                     │
│    - Validate inputs                    │
│    - Preprocess arguments               │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 3. Tool.execute() runs                  │
│    - Execute core logic                 │
│    - Return result                      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 4. tool.execute.after hook fires        │
│    - Format output                      │
│    - Add visual feedback                │
│    - Log completion                     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 5. Result returned to agent             │
└─────────────────────────────────────────┘
```

---

## When to Use Each Hook

### Use `tool.execute.before` for:
- ✅ Input validation
- ✅ Context injection (like skills)
- ✅ Argument preprocessing
- ✅ Security checks
- ✅ Logging tool calls

### Use `tool.execute.after` for:
- ✅ Output formatting
- ✅ Visual feedback (emoji titles)
- ✅ Logging completion
- ✅ Analytics
- ✅ Result transformation

---

## Performance Considerations

### Lookup Map: O(1) vs O(n)

**Inefficient (O(n)):**
```typescript
const beforeHook = async (input, output) => {
  const skill = skills.find(s => s.toolName === input.tool)
  // With 100 skills: 100 comparisons
  // With 1000 skills: 1000 comparisons
}
```

**Efficient (O(1)):**
```typescript
const skillMap = new Map<string, Skill>()
for (const skill of skills) {
  skillMap.set(skill.toolName, skill)
}

const beforeHook = async (input, output) => {
  const skill = skillMap.get(input.tool)
  // With 100 skills: 1 lookup
  // With 1000 skills: 1 lookup
}
```

**Impact:**
- 100 items: 100x faster
- 1000 items: 1000x faster

---

## Testing Hooks

### Testing Before Hook

```typescript
describe("beforeHook", () => {
  it("should inject context for matching tools", async () => {
    const input = { tool: "skills_test", sessionID: "test" }
    const output = { args: {} }

    const mockPrompt = jest.fn()
    ctx.client.session.prompt = mockPrompt

    await beforeHook(input, output)

    expect(mockPrompt).toHaveBeenCalled()
  })

  it("should skip non-matching tools", async () => {
    const input = { tool: "other_tool", sessionID: "test" }
    const output = { args: {} }

    const mockPrompt = jest.fn()
    ctx.client.session.prompt = mockPrompt

    await beforeHook(input, output)

    expect(mockPrompt).not.toHaveBeenCalled()
  })
})
```

### Testing After Hook

```typescript
describe("afterHook", () => {
  it("should enhance output for matching tools", async () => {
    const input = { tool: "skills_test" }
    const output = { output: "result" }

    await afterHook(input, output)

    expect(output.title).toBeDefined()
  })

  it("should skip non-matching tools", async () => {
    const input = { tool: "other_tool" }
    const output = { output: "result" }

    await afterHook(input, output)

    expect(output.title).toBeUndefined()
  })
})
```

---

## Key Takeaways

1. **Hooks are middleware** - Intercept at specific execution points
2. **Before hook** - For preprocessing and context injection
3. **After hook** - For output enhancement and logging
4. **Lookup maps** - Enable O(1) access instead of O(n)
5. **Keep tools simple** - Let hooks handle side effects
6. **Composability** - Hooks can be combined with other plugins
7. **Testability** - Each component can be tested independently
8. **Performance** - Use efficient data structures

---

## Next Steps

1. Study `index.ts` - See the full implementation
2. Review `hook-lifecycle-and-patterns.md` - Visual guide
3. Check `context/capabilities/events_skills.md` - Practical examples
4. Implement in your own plugin
5. Test thoroughly

---

## References

- **OpenCode Events:** `context/capabilities/events.md`
- **Hook Lifecycle:** `hook-lifecycle-and-patterns.md`
- **Practical Examples:** `context/capabilities/events_skills.md`
- **Reference Implementation:** `my-little-ui/src/hooks/`

---

**Status:** ✅ Implementation Guide  
**Quality:** ✅ Production Ready  
**Documentation:** ✅ Comprehensive  

Use this pattern when implementing hooks in your plugins.

