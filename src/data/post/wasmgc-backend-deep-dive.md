---
publishDate: 2025-11-10T00:00:00Z
author: FSharp WasmGC Team
title: Why WebAssembly GC Is the Right Target for F#
excerpt: A technical deep dive into how WasmGC's type system aligns with F# semantics — and why compiling F# to WasmGC produces cleaner output than any JS-based approach.
image: ~/assets/images/blog-deep-dive.png
category: Technical
tags:
  - wasmgc
  - fsharp
  - compiler
  - webassembly
---

# Why WebAssembly GC Is the Right Target for F#

WebAssembly GC (WasmGC) is the most significant evolution in the WebAssembly specification since its initial release. It adds first-class support for garbage-collected heap types to the Wasm type system — and it changes everything about what is possible for functional language compilation to the browser.

This post explains why WasmGC is not just a good target for F# — it is the _right_ target.

## The problem with JavaScript-based transpilation

Most "compile F# to the browser" approaches today go through JavaScript. Fable itself targets JavaScript. While this works remarkably well, it has inherent limitations:

- **No type information at runtime**: JavaScript erases types. F# discriminated unions become plain objects with a `tag` field. Pattern matching becomes if-else chains operating on untyped values.
- **Boxing overhead**: F# value types like `int` and `float` get boxed when stored in generic containers like `List<'T>`.
- **No control over memory**: The garbage collector is JavaScript's, not the application's. You cannot reason about allocation pressure programmatically.
- **Runtime bloat**: Most F#-to-JS compilers need a runtime library to emulate F# semantics.

WasmGC solves all of these problems at the specification level.

## How WasmGC types map to F# constructs

### Records → Struct types

F# records are immutable product types:

```fsharp
type Point = { X: float; Y: float }
```

In WasmGC, this becomes a struct type:

```wat
(type $Point (struct
  (field $X f64)
  (field $Y f64)
))
```

The mapping is direct. No boxing, no object, no `tag` field. Just a typed struct.

### Discriminated unions → Struct hierarchies

F# discriminated unions are sum types:

```fsharp
type Shape =
  | Circle of radius: float
  | Rectangle of width: float * height: float
```

WasmGC supports abstract struct types and concrete subtypes:

```wat
(type $Shape (struct))  ;; abstract base
(type $Circle (sub $Shape (struct (field $radius f64))))
(type $Rectangle (sub $Shape (struct (field $width f64) (field $height f64))))
```

Pattern matching compiles to `ref.test` and `ref.cast` — typed, zero-overhead dispatch.

### Closures → Typed function references

F# closures capture their environment. WasmGC gives us `funcref` and typed function references (`ref.func`). A closure becomes a struct pairing a function reference with its captured environment:

```wat
(type $Closure_int_int (struct
  (field $env (ref $SomeEnv))
  (field $fn (ref $FnType_int_int))
))
```

No boxing, no dynamic dispatch overhead, no indirection through a JavaScript object.

### Lists → Linked structs

```fsharp
let xs = [1; 2; 3]
```

Compiles directly to a chain of WasmGC structs: a nil sentinel and cons cells with typed fields. No JavaScript arrays, no runtime list class.

## The result

The output of FSharp WasmGC is:

1. **Smaller** — no runtime library, no JS emulation overhead
2. **Faster to start** — no JS parsing or JIT warm-up for the runtime layer
3. **More predictable** — GC behavior is defined by the Wasm GC, not a hidden V8 heuristic
4. **Type-safe at the Wasm level** — the Wasm type system tracks F# types

We are still early in development, but even now our QuickTest suite shows that idiomatic F# compiles cleanly to idiomatic WasmGC — structure preserved, semantics respected.

## What's still to solve

WasmGC is not a silver bullet. Open challenges include:

- **Generics**: F# generics require either monomorphization or a vtable dispatch strategy. We are implementing fat-pointer vtables.
- **BCL coverage**: The .NET Base Class Library is enormous. We are building a minimal WasmGC BCL from scratch.
- **Interop**: Calling JavaScript from WasmGC and vice versa still requires care. We use `[<Import>]` attributes for explicit, safe FFI.

These are engineering challenges, not fundamental mismatches. The type system alignment is sound.

## Try it

The project is on [GitHub](https://github.com/fsharp-wasm/fsharp-wasm). The getting started guide is available in the [docs](/docs/getting-started). We welcome contributors, bug reports, and discussions.
