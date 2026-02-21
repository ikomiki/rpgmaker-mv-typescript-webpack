# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RPG Maker MV plugin development boilerplate using TypeScript + Webpack. Each plugin under `my_plugins/` is independently bundled into `js/plugins/[pluginName].js`.

## Build & Lint Commands

```bash
# Build a specific plugin
npm run plugin1-build
npm run plugin2-build

# Watch mode for development
npm run plugin1-watch
npm run plugin2-watch

# Lint (Biome)
npm run lint
npm run lint:fix
```

No test framework is configured.

## Architecture

### Plugin Structure

Each plugin in `my_plugins/` contains:
- `main.ts` — Entry point; handles RPG Maker MV prototype patching
- `myPlugin.ts` — Plugin logic classes
- `webpack.config.js` — Per-plugin Webpack config (output name derived from folder name)

### RPG Maker MV Prototype Aliasing Pattern

This is the critical pattern for extending RPG Maker MV classes. **Do not use class inheritance with prototype replacement** (`Game_Interpreter.prototype = subclass.prototype`), which breaks the prototype chain.

Correct pattern:
```typescript
import { MyPlugin } from "./myPlugin";

declare global {
    interface Game_Interpreter {
        myPlugin1: MyPlugin;
    }
}

const _Game_Interpreter_initialize = Game_Interpreter.prototype.initialize;

Game_Interpreter.prototype.initialize = function (
    this: Game_Interpreter,
    depth: number,
): void {
    _Game_Interpreter_initialize.call(this, depth);
    this.myPlugin1 = new MyPlugin();
};
```

Key points:
- Save original method with `_ClassName_methodName` prefix
- Replace on prototype using `function` (not arrow functions — `this` must bind dynamically)
- Call original via `.call(this, ...args)`
- Use `declare global` interface merging to add custom properties with type safety
- Type definitions come from `rpgmakermv_typescript_dts` (`/// <reference types="rpgmakermv_typescript_dts" />`)

## Conventions

- TypeScript strict mode enabled (`strict`, `noUnusedLocals`, `noUnusedParameters`)
- Target: ES2018
- Formatter: Biome with 4-space indentation
- camelCase for methods, PascalCase for classes
- Each plugin is self-contained with its own webpack config
