---
title: Getting Started
description: Install FSharp WasmGC and compile your first F# project to WebAssembly GC in five minutes.
order: 1
tags:
  - getting-started
  - installation
---

# Getting Started

FSharp WasmGC compiles F# source code to [WebAssembly GC](https://github.com/WebAssembly/gc) — a modern, typed extension to WebAssembly. This guide gets you from zero to a running `.wasm` file.

## Prerequisites

| Tool                                                         | Version | Purpose                                       |
| ------------------------------------------------------------ | ------- | --------------------------------------------- |
| [.NET SDK](https://dotnet.microsoft.com/download)            | 10.0+   | Build and run the compiler                    |
| [Node.js](https://nodejs.org/)                               | 22+     | Run `.wasm` output in tests                   |
| [wasm-tools](https://github.com/bytecodealliance/wasm-tools) | 1.245+  | Validate `.wasm` binaries and Component Model |

Install wasm-tools via Cargo (Rust):

```bash
cargo install wasm-tools
```

Or grab a prebuilt binary from the [releases page](https://github.com/bytecodealliance/wasm-tools/releases).

> **Note:** wasm-tools is optional — the compiler works without it, but the test harness uses it for binary validation and Component Model assembly.

## Installation

FSharp WasmGC is a .NET tool. Install it globally or as a project-local tool:

```bash
# Global install (available anywhere)
dotnet tool install -g FSharp.WasmGc

# Project-local install
dotnet new tool-manifest  # only needed once per repo
dotnet tool install FSharp.WasmGc
```

## Your first project

### 1. Create an F# console project

```bash
dotnet new console -lang F# -o hello-wasm
cd hello-wasm
```

### 2. Write F#

Edit `Program.fs`:

```fsharp
let greet (name: string) : string =
    "Hello, " + name + "!"

let add (a: int) (b: int) : int = a + b
```

### 3. Compile

```bash
dotnet fsharpwasmgc build hello-wasm.fsproj
```

Output files:

- `output/hello_wasm.wasm` — the binary Wasm module
- `output/hello_wasm.wat` — human-readable WebAssembly Text Format (great for debugging)

### 4. Run

```javascript
// test.mjs
const { instance } = await WebAssembly.instantiate(
  await Blob([]).arrayBuffer() // replace with readFileSync('./output/hello_wasm.wasm')
);

console.log(instance.exports.add(1, 2)); // 3
```

## Project structure conventions

FSharp WasmGC compiles `.fsproj` files. Multi-file projects are supported:

```
my-project/
  MyProject.fsproj
  Types.fs          ← compiled first (ordered in .fsproj)
  Functions.fs
  Program.fs
  output/
    myproject.wasm
    myproject.wat
```

Files are compiled in `.fsproj` order, matching the standard F# compilation order guarantee.

## Cross-module imports

To call functions from another Wasm module, use the `[<Import>]` attribute:

```fsharp
// Reference external Wasm exports
[<Import("add", "math-module")>]
let externalAdd (a: int) (b: int) : int = nativeOnly
```

At runtime, provide the import when instantiating:

```javascript
const imports = {
  'math-module': mathModuleInstance.exports,
};
WebAssembly.instantiate(wasm, imports);
```

## Next steps

- [Architecture](/docs/architecture) — how the compiler works inside
- [Roadmap](/docs/roadmap) — what is coming next
- [Blog](/blog) — tutorials and deep dives
- [GitHub](https://github.com/fsharp-wasm/fsharp-wasm) — source code and issues
