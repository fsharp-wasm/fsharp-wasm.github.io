---
title: Getting Started
description: Compile your first F# program to WebAssembly GC and run it — every step below was run as written.
order: 1
tags:
  - getting-started
  - tutorial
---

# Getting started

This page takes you from nothing to an F# function running as WebAssembly GC on Node. The steps were run as written on 2026-11-14.

## What you need

- the **.NET 10 SDK** (the compiler runs on .NET),
- **Node.js 22 or later** to run the result (any engine with WebAssembly GC works: Chrome and Edge 119+, Firefox 120+, Safari 18.2+),
- [`wasm-tools`](https://github.com/bytecodealliance/wasm-tools) to validate the output and for the Component Model (optional).

## 1. Get the compiler

**From source** — this is the current compiler:

```bash
git clone https://github.com/fsharp-wasm/fsharp-wasm.git
cd fsharp-wasm
git submodule update --init --depth 1 vendor/Fable vendor/fsharp core

# the patched F# compiler the front end uses (once; a few minutes; it pins the 10.0.3xx SDK band)
(cd vendor/fsharp && mkdir -p artifacts && ./build/build.sh -c Release)
export FSHARP_COMPILER=$PWD/vendor/fsharp/artifacts/bin/fsc/Release/net10.0/fsc.dll

dotnet build tools/FSharp.Wasm.Cli -c Release
```

**Or a release** — a self-contained binary for Linux, macOS (x64, arm64) and Windows with the F# base library beside it, from the
[releases page](https://github.com/fsharp-wasm/fsharp-wasm/releases). The latest one, `v0.1.24-experimental`, is from April 2026 and predates most of the work described on this
site; build from source for the current compiler.

## 2. Write a program

`Hello.fs`:

```fsharp
module Hello

let fibonacci n =
    let mutable a, b = 0, 1
    for _ in 1..n do
        let t = a + b
        a <- b
        b <- t
    a

let isPrime n =
    if n < 2 then false
    else
        let mutable i = 2
        let mutable result = true
        while i * i <= n && result do
            if n % i = 0 then result <- false
            i <- i + 1
        result
```

`Hello.fsproj`:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net10.0</TargetFramework>
  </PropertyGroup>
  <ItemGroup>
    <Compile Include="Hello.fs" />
  </ItemGroup>
</Project>
```

## 3. Compile it

```bash
dotnet run -c Release --project tools/FSharp.Wasm.Cli -- path/to/Hello --outDir out
# out/Hello.wasm   (419 bytes)
# out/Hello.wat    (the same module as text: read it)
# out/wit/         (the WIT world of its exports)
wasm-tools validate out/Hello.wasm --features gc
```

The compiler takes a project or a directory (`--outDir`, `--noCache`, `--verbose`, `--silent`). Public top-level functions become exports.

## 4. Run it

```javascript
// run.mjs — node run.mjs
import { readFileSync } from "node:fs";
const { instance } = await WebAssembly.instantiate(readFileSync("out/Hello.wasm"), {});
const { fibonacci, isPrime } = instance.exports;
console.log(fibonacci(10), isPrime(97), isPrime(100));   // 55 1 0   (a bool is an i32)
```

## Where to go next

- **See what is possible:** the [live demos](/demos) and the [examples](/examples) — a counter and a todo list, a Web Worker actor, a canvas scene gallery, a server module.
- **Talk to the browser:** [fsharp-wasm-runtime](https://github.com/fsharp-wasm/fsharp-wasm-runtime) has typed bindings (`Browser.*`) and the Elmish-style runtime the demos use.
- **Run on a server:** [fsharp-wasm-edge](https://github.com/fsharp-wasm/fsharp-wasm-edge) runs a module on Node, Bun, Deno, Cloudflare Workers, Vercel and Netlify ([backend](/backend)).
- **Know what is covered:** the [tests](/tests) page lists every suite, and the [status page](https://github.com/fsharp-wasm/fsharp-wasm/blob/main/docs/STATUS.md) lists the programs that do not compile yet.
- **How it works:** [architecture](/docs/architecture).
