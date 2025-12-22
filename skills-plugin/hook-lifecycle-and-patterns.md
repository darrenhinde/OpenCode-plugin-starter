# OpenCode Hook Architecture Guide

## Visual Overview

### Tool Execution Lifecycle with Hooks

```
┌─────────────────────────────────────────────────────────────────┐
│                    AGENT CALLS SKILL TOOL                       │
│                  (e.g., skills_brand_guidelines)                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  HOOK: tool.execute.before                      │
│                                                                 │
│  Purpose: Preprocessing & Context Injection                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. Check if tool is a skill (starts with "skills_")    │   │
│  │ 2. Look up skill in skillMap (O(1) access)             │   │
│  │ 3. Inject skill content via silent prompt              │   │
│  │ 4. Skill content persists in conversation              │   │
│  │ 5. No AI response triggered (noReply: true)            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Code:                                                          │
│  const beforeHook = async (input, output) => {                 │
│    if (input.tool.startsWith("skills_")) {                     │
│      const skill = skillMap.get(input.tool)                    │
│      if (skill) {                                              │
│        await ctx.client.session.prompt({                       │
│          path: { id: input.sessionID },                        │
│          body: {                                               │
│            agent: input.agent,                                 │
│            noReply: true,                                      │
│            parts: [{ type: "text", text: skill.content }]      │
│          }                                                      │
│        })                                                       │
│      }                                                          │
│    }                                                            │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    TOOL.EXECUTE() RUNS                          │
│                                                                 │
│  Purpose: Core Tool Logic (Minimal)                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ async execute(args, toolCtx) {                          │   │
│  │   return `Skill activated: ${skill.name}`               │   │
│  │ }                                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Why minimal?                                                   │
│  - No side effects                                              │
│  - Easy to test                                                 │
│  - Delivery happens in hooks, not here                          │
│  - Single responsibility                                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  HOOK: tool.execute.after                       │
│                                                                 │
│  Purpose: Output Enhancement & Monitoring                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. Check if tool is a skill                            │   │
│  │ 2. Look up skill in skillMap                           │   │
│  │ 3. Add emoji title to output                           │   │
│  │ 4. Could add logging/analytics here                    │   │
│  │ 5. Modify output.title for visual feedback             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Code:                                                          │
│  const afterHook = async (input, output) => {                  │
│    if (input.tool.startsWith("skills_")) {                     │
│      const skill = skillMap.get(input.tool)                    │
│      if (skill && output.output) {                             │
│        output.title = `📚 ${skill.name}`                       │
│      }                                                          │
│    }                                                            │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  RESULT RETURNED TO AGENT                       │
│                                                                 │
│  - Tool confirmation message                                    │
│  - Skill content in conversation history                        │
│  - Enhanced output with emoji title                             │
│  - Agent can now use skill content in reasoning                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Architecture Comparison

### ❌ OLD: Embedded Delivery (Anti-Pattern)

```
┌──────────────────────────────────────────┐
│         Tool Definition                  │
├──────────────────────────────────────────┤
│ async execute(args, toolCtx) {           │
│   // Parse arguments                     │
│   // Validate inputs                     │
│   // Execute core logic                  │
│   // ❌ Inject skill content             │
│   // ❌ Format output                    │
│   // ❌ Add visual feedback              │
│   return result                          │
│ }                                        │
└──────────────────────────────────────────┘
         ↓
    PROBLEMS:
    - Tight coupling
    - Hard to test
    - Violates SOLID
    - No reusability
    - Difficult to monitor
```

### ✅ NEW: Hook-Based Delivery (Best Practice)

```
┌──────────────────────────────────────────┐
│    tool.execute.before Hook              │
├──────────────────────────────────────────┤
│ - Inject skill content                   │
│ - Validate inputs                        │
│ - Preprocess arguments                   │
└──────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────┐
│      Tool Definition (Minimal)           │
├──────────────────────────────────────────┤
│ async execute(args, toolCtx) {           │
│   // Parse arguments                     │
│   // Validate inputs                     │
│   // Execute core logic                  │
│   return result                          │
│ }                                        │
└──────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────┐
│    tool.execute.after Hook               │
├──────────────────────────────────────────┤
│ - Format output                          │
│ - Add visual feedback                    │
│ - Log completion                         │
└──────────────────────────────────────────┘

    BENEFITS:
    ✅ Loose coupling
    ✅ Easy to test
    ✅ SOLID compliant
    ✅ Highly reusable
    ✅ Easy to monitor
```

---

## Hook Types & Use Cases

### tool.execute.before

**When it fires:** Before the tool function runs

**What you can do:**
- ✅ Inject context (like skill content)
- ✅ Validate inputs
- ✅ Preprocess arguments
- ✅ Log tool calls
- ✅ Implement security checks
- ✅ Modify arguments before execution

**What you can't do:**
- ❌ Modify tool output (tool hasn't run yet)
- ❌ Access tool results

**Example:**
```typescript
const beforeHook = async (input, output) => {
  // input.tool: tool name
  // input.sessionID: session ID
  // input.agent: agent name
  // output.args: tool arguments
  
  if (input.tool.startsWith("skills_")) {
    const skill = skillMap.get(input.tool)
    if (skill) {
      // Inject skill content
      await ctx.client.session.prompt({...})
    }
  }
}
```

---

### tool.execute.after

**When it fires:** After the tool function completes

**What you can do:**
- ✅ Modify output
- ✅ Add titles/formatting
- ✅ Log completion
- ✅ Add analytics
- ✅ Transform results
- ✅ Add visual feedback

**What you can't do:**
- ❌ Modify tool arguments (already executed)
- ❌ Prevent tool execution (already happened)

**Example:**
```typescript
const afterHook = async (input, output) => {
  // input.tool: tool name
  // input.sessionID: session ID
  // output.output: tool result
  // output.title: can be modified
  
  if (input.tool.startsWith("skills_")) {
    const skill = skillMap.get(input.tool)
    if (skill && output.output) {
      output.title = `📚 ${skill.name}`
    }
  }
}
```

---

## Skill Lookup Map: Why It Matters

### Problem: O(n) Search

```typescript
// ❌ OLD: Search through array every time
const beforeHook = async (input, output) => {
  if (input.tool.startsWith("skills_")) {
    // Search through all skills
    const skill = skills.find(s => s.toolName === input.tool)
    if (skill) {
      // Use skill
    }
  }
}

// Performance: O(n) where n = number of skills
// With 100 skills: 100 comparisons per hook call
```

### Solution: O(1) Lookup

```typescript
// ✅ NEW: Direct map lookup
const skillMap = new Map<string, Skill>()
for (const skill of skills) {
  skillMap.set(skill.toolName, skill)
}

const beforeHook = async (input, output) => {
  if (input.tool.startsWith("skills_")) {
    // Direct lookup
    const skill = skillMap.get(input.tool)
    if (skill) {
      // Use skill
    }
  }
}

// Performance: O(1) constant time
// With 100 skills: 1 lookup per hook call
```

**Impact:**
- 100 skills: 100x faster
- 1000 skills: 1000x faster
- Scales linearly with number of skills

---

## Plugin Return Object

```typescript
return {
  // Custom tools that agents can call
  tool: tools,

  // Hook: Runs before tool execution
  // Used for: Context injection, validation, preprocessing
  "tool.execute.before": beforeHook,

  // Hook: Runs after tool execution
  // Used for: Output enhancement, logging, analytics
  "tool.execute.after": afterHook,
}
```

**Key points:**
- `tool`: Object with tool definitions
- `"tool.execute.before"`: Function that runs before each tool
- `"tool.execute.after"`: Function that runs after each tool
- Hooks apply to ALL tools, so use `if` statements to filter

---

## Real-World Example: Skills Plugin

### Setup

```typescript
// 1. Discover skills
const skills = await discoverSkills([...paths])

// 2. Create lookup map
const skillMap = new Map<string, Skill>()
for (const skill of skills) {
  skillMap.set(skill.toolName, skill)
}

// 3. Create minimal tools
const tools: Record<string, any> = {}
for (const skill of skills) {
  tools[skill.toolName] = tool({
    description: skill.description,
    args: {},
    async execute(args, toolCtx) {
      return `Skill activated: ${skill.name}`
    },
  })
}
```

### Before Hook: Skill Delivery

```typescript
const beforeHook = async (input: any, output: any) => {
  // Only process skill tools
  if (input.tool.startsWith("skills_")) {
    const skill = skillMap.get(input.tool)
    if (skill) {
      // Inject skill content as silent prompt
      await ctx.client.session.prompt({
        path: { id: input.sessionID },
        body: {
          agent: input.agent,
          noReply: true,  // Don't trigger AI response
          parts: [
            {
              type: "text",
              text: `📚 Skill: ${skill.name}\nBase directory: ${skill.fullPath}\n\n${skill.content}`,
            },
          ],
        },
      })
    }
  }
}
```

### After Hook: Output Enhancement

```typescript
const afterHook = async (input: any, output: any) => {
  // Only process skill tools
  if (input.tool.startsWith("skills_")) {
    const skill = skillMap.get(input.tool)
    if (skill && output.output) {
      // Add emoji title for visual feedback
      output.title = `📚 ${skill.name}`
    }
  }
}
```

### Plugin Return

```typescript
return {
  tool: tools,
  "tool.execute.before": beforeHook,
  "tool.execute.after": afterHook,
}
```

---

## Testing Hooks

### Testing Before Hook

```typescript
describe("beforeHook", () => {
  it("should inject skill content for skill tools", async () => {
    const input = { tool: "skills_brand_guidelines", sessionID: "test" }
    const output = { args: {} }
    
    const mockPrompt = jest.fn()
    ctx.client.session.prompt = mockPrompt
    
    await beforeHook(input, output)
    
    expect(mockPrompt).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          noReply: true,
        }),
      })
    )
  })

  it("should skip non-skill tools", async () => {
    const input = { tool: "read_file", sessionID: "test" }
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
  it("should add emoji title for skill tools", async () => {
    const input = { tool: "skills_brand_guidelines" }
    const output = { output: "Skill activated" }
    
    await afterHook(input, output)
    
    expect(output.title).toBe("📚 brand-guidelines")
  })

  it("should skip non-skill tools", async () => {
    const input = { tool: "read_file" }
    const output = { output: "File content" }
    
    await afterHook(input, output)
    
    expect(output.title).toBeUndefined()
  })
})
```

---

## Common Patterns

### Pattern 1: Tool-Specific Hooks

```typescript
const beforeHook = async (input, output) => {
  switch (input.tool) {
    case "skills_brand_guidelines":
      // Handle brand guidelines
      break
    case "skills_api_reference":
      // Handle API reference
      break
    default:
      // Skip non-skill tools
  }
}
```

### Pattern 2: Conditional Processing

```typescript
const beforeHook = async (input, output) => {
  if (input.tool.startsWith("skills_")) {
    const skill = skillMap.get(input.tool)
    if (skill && skill.allowedTools?.includes(input.agent)) {
      // Process only if allowed
    }
  }
}
```

### Pattern 3: Logging & Monitoring

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

### Pattern 4: Error Handling

```typescript
const beforeHook = async (input, output) => {
  try {
    if (input.tool.startsWith("skills_")) {
      const skill = skillMap.get(input.tool)
      if (!skill) {
        throw new Error(`Skill not found: ${input.tool}`)
      }
      // Process skill
    }
  } catch (error) {
    console.error(`Hook error:`, error)
    // Don't rethrow - let tool execute anyway
  }
}
```

---

## Key Takeaways

1. **Hooks are middleware**: They intercept tool execution at specific points
2. **Before hook**: For preprocessing, validation, context injection
3. **After hook**: For output enhancement, logging, analytics
4. **Lookup maps**: Enable O(1) access instead of O(n) search
5. **Separation of concerns**: Tools do one thing, hooks do another
6. **Composability**: Multiple plugins can register hooks without conflict
7. **Testability**: Each component can be tested independently
8. **Maintainability**: Changes are isolated to specific hooks

---

## References

- **OpenCode Events**: `context/capabilities/events.md`
- **Best Practices**: `context/reference/best-practices.md`
- **Skills Plugin**: `index.ts`
- **my-little-ui Plugin**: `my-little-ui/src/hooks/`

