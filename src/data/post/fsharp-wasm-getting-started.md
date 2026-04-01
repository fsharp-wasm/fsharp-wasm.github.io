---
publishDate: 2026-01-20T00:00:00Z
author: FSharp WasmGC Team
title: Getting Started with FSharp WasmGC
excerpt: A practical step-by-step guide to compiling your first F# project to WebAssembly GC using FSharp WasmGC.
image: ~/assets/images/blog-getting-started.png
category: Tutorials
tags:
  - getting-started
  - fsharp
  - wasmgc
  - tutorial
---

# Getting Started with FSharp WasmGC

This tutorial walks you through compiling your first F# project to WebAssembly GC using FSharp WasmGC.

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) or later
- [Node.js 22+](https://nodejs.org/) (for running the output)
- [wasm-tools](https://github.com/bytecodealliance/wasm-tools) — validates `.wasm` binaries and enables Component Model assembly (`cargo install wasm-tools`)

## Step 1: Create a new F# project

```bash
dotnet new console -lang F# -o MyWasmProject
cd MyWasmProject
```

## Step 2: Write your F# code

Edit `Program.fs`:

```fsharp
let add (a: int) (b: int) : int = a + b

let fibonacci (n: int) : int =
    let rec fib a b count =
        if count = 0 then a
        else fib b (a + b) (count - 1)
    fib 0 1 n

[<EntryPoint>]
let main _ =
    let result = add 21 21
    let fib10 = fibonacci 10
    printfn "add(21, 21) = %d" result
    printfn "fibonacci(10) = %d" fib10
    0
```

## Step 3: Build with FSharp WasmGC

```bash
# Build the project
dotnet fsharpwasmgc build MyWasmProject.fsproj

# Output: output/mywasmproject.wasm + output/mywasmproject.wat
```

## Step 4: Run in Node.js

```javascript
// run.mjs
import { readFileSync } from 'fs';

const wasm = readFileSync('./output/mywasmproject.wasm');
const { instance } = await WebAssembly.instantiate(wasm, {});

console.log('add:', instance.exports.add(21, 21));
console.log('fibonacci:', instance.exports.fibonacci(10));
```

```bash
node run.mjs
# add: 42
# fibonacci: 55
```

## Step 5: Inspect the WAT output

The compiler also emits a human-readable `.wat` file. Open `output/mywasmproject.wat` to see exactly what Wasm your F# compiled to:

```wat
(module
  (type $FnType_i32_i32_i32 (func (param i32 i32) (result i32)))

  (func $add (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add
  )

  ;; ... fibonacci ...

  (export "add" (func $add))
  (export "fibonacci" (func $fibonacci))
)
```

Notice: no JavaScript runtime, no runtime library imports, pure Wasm.

## What to try next

- **Component Model**: Export your F# functions as a WIT component using by adding WIT metadata
- **Multi-module linking**: Link two F# WasmGC modules together at the Wasm level
- **Pattern matching**: Try discriminated unions — they compile to WasmGC struct hierarchies
- **BCL functions**: Use `List.map`, `Array.filter`, `String.concat` and more

Read the [architecture docs](/docs/architecture) to understand how the compiler works under the hood, or browse the [blog](/blog) for deep-dives into specific features.
