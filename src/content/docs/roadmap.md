---
title: Roadmap
description: The FSharp WasmGC development roadmap — where we have been and where we are going.
order: 3
tags:
  - roadmap
  - planning
---

# Roadmap

FSharp WasmGC is developed in focused sprints, each with documented goals and outcomes. This page summarises the major milestones — past, present, and future.

## Completed

### Sprints 1–3: Core WasmGC infrastructure

- WasmGC AST types (`WType`, `WExpr`, `WFunc`, `WModule`)
- WAT emitter — human-readable text output
- Basic arithmetic, let bindings, conditionals
- `wasm-tools` integration (binary encoding + validation)

### Sprints 4–6: F# semantics

- Closures via typed struct + funcref pairs
- Discriminated unions — struct type hierarchies
- Pattern matching compilations via `ref.test` / `ref.cast`
- F# lists — linked WasmGC struct chains
- Tail call support

### Sprints 7–9: Multi-file & BCL foundation

- Multi-file `.fsproj` pipeline
- Cross-file import resolution via `KnownFuncsByPath`
- BCL project structure (`fable-library-wasmgc/`)
- String operations — UTF-16 as `i32` arrays
- Array operations — typed WasmGC arrays
- 353 QuickTests passing

### Sprints 10–12: CE builder & architecture

- Custom computation expression builder (`wasm { }`)
- `wasmIf` with correct type inference (diverging branch handling)
- Loop helpers: `whileLoop`, `countLoop`, `loopWithResult`
- Subfolder source layout (`Runtime/`, `Transforms/`, `Emit/`)

### Sprints 13–15: Component Model

- WIT file generation from F# primitive exports
- `wasm-tools` integration for component assembly
- Component linking examples (`examples/component-linking/`)
- Cross-module `[<Import>]` FFI — 22/22 linking tests pass

### Sprints 16–17: Collections & Showcase

- `Map<'K,'V>` — AVL tree implementation in WasmGC F#
- `List.sortBy` / `List.sortByDescending`
- `Array.toList`, `List.ofArray`
- Showcase application — 26/26 Showcase tests pass
- Vtable design document for generics

---

## In progress

### Sprint 18: Generics foundation

- Fat-pointer vtable strategy for `'T` type parameters
- Interface dispatch tables
- Monomorphization for value-type generics

---

## Planned

### Sprint 19–20: Generics completion

- Full `List<'T>`, `Array<'T>`, `Option<'T>` with type parameters
- Generic functions with type constraints
- `IComparable<'T>` dispatch for collections

### Sprint 21–22: BCL expansion

- `String`: split, trim, format, interpolation
- `Seq<'T>` / `IEnumerable<'T>` via lazy lists
- `Result<'T,'E>` standard operators
- `Option<'T>` standard operators
- `Dictionary<'K,'V>`, `HashSet<'T>`

### Sprint 23–24: Optimization

- Dead-code elimination (function-level)
- Constant folding and propagation
- Inlining of single-use functions
- Wasm module size benchmarks

### Sprint 25: Developer experience

- Source maps (F# → WAT line mapping)
- Error messages with F# source locations
- `--watch` mode for iterative development

---

## v1.0 goals

A `v1.0` release requires:

- [ ] Full generics support (List, Array, Map, Set, Option, Result)
- [ ] BCL coverage sufficient for real applications
- [ ] Wasm binary size competitive with equivalent JS/TS output
- [ ] Stable public API (compiler flags, output format)
- [ ] Published benchmark suite
- [ ] Production-quality documentation
- [ ] At least one real-world application built with FSharp WasmGC

---

## Contributing to the roadmap

The roadmap is community-driven. If you have a use-case or feature that is important to you, open an [issue on GitHub](https://github.com/fsharp-wasm/fsharp-wasm/issues) or start a [discussion](https://github.com/fsharp-wasm/fsharp-wasm/discussions). We read everything.
