---
publishDate: 2026-01-20T00:00:00Z
author: FSharp WasmGC Team
title: Getting Started with FSharp WasmGC
excerpt: The first version of this guide described a command that no longer exists. The current one was run as written against nuget.org on 2026-11-27.
image: ~/assets/images/blog-getting-started.png
category: Tutorials
tags:
  - getting-started
  - fsharp
  - wasmgc
  - tutorial
---

# Getting Started with FSharp WasmGC

This post, written in January 2026 for the first prototype, told you to run `dotnet fsharpwasmgc build`. **That command does not exist any more** (the compiler is `fsharp-wasm`, a .NET tool on NuGet), so its steps no longer work and we removed them rather than leave them to mislead.

The guide to follow is [Getting started](/docs/getting-started). It takes you from an empty machine to an F# program running as WebAssembly GC, and then to one that uses a library from NuGet:

```bash
dotnet tool install -g FSharp.Wasm.Cli --prerelease
dotnet new install FSharp.Wasm.Templates
dotnet new fsharp-wasm -o hello && cd hello
fsharp-wasm . --outDir out
node run.mjs
```

Those commands were run in an empty `HOME` against nuget.org on 2026-11-27; the guide says what was not checked (macOS and Windows).

Read the [architecture docs](/docs/architecture) to understand how the compiler works under the hood, or browse the [blog](/blog) for deep-dives into specific features.
