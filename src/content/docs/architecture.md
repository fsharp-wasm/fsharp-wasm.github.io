---
title: Architecture
description: How the FSharp WasmGC compiler works — from F# source to WebAssembly GC binary.
order: 2
tags:
  - architecture
  - compiler
  - internals
---

# Compiler Architecture

FSharp WasmGC is a code generation backend for [Fable](https://fable.io). It replaces Fable's JavaScript emitter with a WasmGC emitter — leaving the F# parsing, type-checking, and optimization pipeline untouched.

## Pipeline overview

```
F# source (.fs, .fsproj)
         │
         ▼
  ┌─────────────┐
  │   Fable      │  Parsing, type-checking, F# AST → Fable AST
  │  front-end   │  (unchanged from upstream Fable)
  └──────┬──────┘
         │  Fable.File (typed F# declarations)
         ▼
  ┌─────────────┐
  │  WasmGC     │  Fable.File → WasmGC IR (WExpr / WFunc / WModule)
  │  back-end   │  (FSharp WasmGC — this project)
  └──────┬──────┘
         │  WasmGC IR
         ▼
  ┌─────────────┐
  │  WAT emitter│  WasmGC IR → WebAssembly Text Format (.wat)
  └──────┬──────┘
         │  .wat file
         ▼
  ┌─────────────┐
  │  wasm-tools │  .wat → .wasm binary (Bytecode Alliance wasm-tools)
  └──────┬──────┘
         │
         ▼
    .wasm binary
```

## Source layout

```
src/
  WasmGc.AST.fs          ← WasmGC type definitions (WType, WExpr, WFunc, WModule)
  WasmGcPipeline.fs      ← Top-level pipeline, .fsproj orchestration

  Runtime/
    WasmGcTypes.fs       ← Pre-registered WasmGC types (AnyFn, WasmStr, ListBase)
    WasmGcBuilder.fs     ← CE builder for linear WasmGC IR construction
    WasmGcLoopHelpers.fs ← Loop sugar: whileLoop, countLoop, loopWithResult
    WasmGcFreeVars.fs    ← Closure free-variable analysis
    WasmGcRuntime.fs     ← Runtime helpers: makeFunc, string ops, list ops

  Transforms/
    WasmGcReplacements.fs ← BCL function implementations (List.map, String.concat…)
    Fable2WasmGc.fs       ← Fable AST → WasmGC IR translation (main transform)

  Emit/
    WasmGcOptimize.fs    ← Dead-code elimination, peephole optimizations
    WasmGcWat.fs         ← WasmGC IR → WAT text emission
    WasmGcEmit.fs        ← File-level output coordination
    WasmGcEncoder.fs     ← Binary .wasm encoding (future: direct emit)
```

## Key design decisions

### Pre-registered WasmGC types

Three types are registered at the beginning of every module (order matters for Wasm type indices):

| Index | Type        | Description                       |
| ----- | ----------- | --------------------------------- |
| 0     | `$AnyFn`    | Base struct for all closures      |
| 1     | `$WasmStr`  | String as `(array i32)` — UTF-16  |
| 2     | `$ListBase` | Abstract base struct for F# lists |

### CE Builder for IR construction

WasmGC IR is constructed using a custom F# computation expression (`wasm { ... }`). This prevents a class of bugs where the wrong local variable scope is referenced:

```fsharp
let compiled = wasm {
  let! x = compileExpr lhs    // x is a LocalGet expression — use directly
  let! y = compileExpr rhs
  return WExpr.BinOp(Add, x, y)
}
```

`do!` is used for side-effectful void expressions:

```fsharp
wasm {
  do! compileEffect expr
  return someValue
}
```

### Multi-file pipeline

Files are processed in `.fsproj` order. Each file gets its own `Compiler` instance (for correct entity resolution) but shares a single `Ctx` (accumulates declarations). Key rule: library files get a `fileStem_` prefix on exported function names; the main project file does not.

### Cross-file calls

Fable generates `Import` nodes (not `IdentExpr`) for calls to functions defined in other files of the same project. The compiler resolves these via `KnownFuncsByPath` — a map from file path to compiled function name.

## Type mapping reference

| F# type                       | WasmGC type                              |
| ----------------------------- | ---------------------------------------- |
| `int`                         | `i32`                                    |
| `float`                       | `f64`                                    |
| `bool`                        | `i32` (0/1)                              |
| `string`                      | `(ref $WasmStr)`                         |
| `unit`                        | `i32` (always 0)                         |
| Record `{ X: int; Y: float }` | `(struct (field $X i32) (field $Y f64))` |
| DU case                       | Sub-struct of abstract base struct       |
| `List<'T>`                    | Linked `$ListBase` structs               |
| `'T[]`                        | `(array (ref $T))` or typed array        |
| `'a -> 'b`                    | `(ref $Closure)` struct with funcref     |

## BCL implementation

The Base Class Library for WasmGC is implemented in F# and compiled with our own compiler (`FSharp.Wasm.Core`, the repository [fsharp-wasm-core](https://github.com/fsharp-wasm/fsharp-wasm-core)). This means the BCL implementation validates the compiler itself — a virtuous cycle.

Current BCL modules:

- `Core/Interop.fs` — minimal Fable.Core stubs (not compiled, type-checking only)
- `Collections/Map.fs` — immutable Map via AVL tree
- `Collections/Set.fs` — stub (in progress)

## Component Model integration

The pipeline optionally generates WIT files and invokes `wasm-tools` to create WasmGC components:

1. Scan exported F# functions with primitive-typed signatures
2. Generate a `.wit` file (kebab-case identifiers, quoted when necessary)
3. Call `wasm-tools component embed` + `wasm-tools component new` if available
4. Output: `output/mymodule-component.wasm`

This enables F# modules to be linked as Wasm components without any JavaScript glue.
