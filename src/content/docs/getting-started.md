---
title: Getting Started
description: From nothing to an F# program running as WebAssembly GC, in two minutes and four commands.
order: 1
tags:
  - getting-started
  - tutorial
---

# Getting started

Four commands take you from nothing to an F# function running as WebAssembly GC. You need the **.NET 10 SDK** (the compiler runs on .NET) and **Node.js 22 or later**
(to run the result; any engine with WebAssembly GC works: Chrome and Edge 119+, Firefox 120+, Safari 18.2+).

```bash
dotnet tool install -g FSharp.Wasm.Cli --prerelease     # the compiler, once
dotnet new install FSharp.Wasm.Templates                # the starter, once
dotnet new fsharp-wasm -n hello && cd hello             # a folder with an F# file, a Node runner and a web page
fsharp-wasm . --outDir out && node run.mjs              # hello.fs -> out/hello.wasm, run by Node
```

```
fibonacci 10          = 55
isPrime 97, 100       = 1 0
sum of odd squares 9  = 165
```

`out/hello.wasm` is a few hundred bytes, `out/hello.wat` is the same module as text (read it), and `out/wit/` is the WIT world of its exports.
To see it in a browser: `python3 -m http.server` in the folder and open <http://localhost:8000/>; the DevTools show the module.

## Without the .NET tool: a release binary

For Linux and macOS the compiler is also a self-contained binary (with the F# base library beside it; the .NET 10 SDK is still what reads your project):

```bash
curl -fsSL https://raw.githubusercontent.com/fsharp-wasm/fsharp-wasm/main/scripts/install.sh | sh
```

It downloads the archive for your machine, checks it against `SHA256SUMS` of the release and links `~/.fsharp-wasm/bin/fsharp-wasm`. Windows: take
`fsharp-wasm-win-x64.zip` from the [releases page](https://github.com/fsharp-wasm/fsharp-wasm/releases).

## What is in the folder

`hello.fs` is an ordinary F# module; its public top-level functions are the exports:

```fsharp
module hello

let fibonacci (n: int) : int =
    let mutable a, b = 0, 1
    for _ in 1 .. n do
        let t = a + b
        a <- b
        b <- t
    a

let isPrime (n: int) : bool = ...       // a bool is an i32 on the other side (0 or 1)

let sumOfSquaresOfOdds (n: int) : int =
    [ 1 .. n ] |> List.filter (fun x -> x % 2 = 1) |> List.map (fun x -> x * x) |> List.sum
```

`run.mjs` is the whole host: `WebAssembly.instantiate(readFileSync("out/hello.wasm"), {})` and a call. A module that draws, talks to the DOM or serves HTTP needs a host with imports: that is what the
runtime, the graphics stack and the edge host are for (below).

## What compiles, and what does not

This is an experimental compiler: a lot of F# compiles (records, unions, closures, collections, pattern matching, generics, object expressions, interfaces, sequences) and some does not. The
[status page](https://github.com/fsharp-wasm/fsharp-wasm/blob/main/docs/STATUS.md) lists the programs that do not compile yet, each with the smallest program that shows it; the [tests](/tests) page lists what is checked.
If your program is not in the list, that is worth an issue.

## Build the compiler from source

For the current `develop` branch, or to work on the compiler:

```bash
git clone https://github.com/fsharp-wasm/fsharp-wasm.git && cd fsharp-wasm
git submodule update --init --depth 1 vendor/Fable vendor/fsharp core

# the patched F# compiler the front end uses (once; a few minutes; it pins the 10.0.3xx SDK band)
(cd vendor/fsharp && mkdir -p artifacts && ./build/build.sh -c Release)
export FSHARP_COMPILER=$PWD/vendor/fsharp/artifacts/bin/fsc/Release/net10.0/fsc.dll

dotnet run -c Release --project tools/FSharp.Wasm.Cli -- examples/hello-wasm --outDir out
```

## Where to go next

- **See what is possible:** the [live demos](/demos): an operating system in one F# program, charts of ten million samples, an accounting grid, a widget editor.
- **Talk to the browser:** [fsharp-wasm-runtime](https://github.com/fsharp-wasm/fsharp-wasm-runtime) has typed bindings (`Browser.*`) and the Elmish-style runtime the demos use.
- **Draw on a canvas:** [fsharp-wasm-graphics](https://github.com/fsharp-wasm/fsharp-wasm-graphics) is a scene graph with widgets, layout and charts.
- **Run on a server:** [fsharp-wasm-edge](https://github.com/fsharp-wasm/fsharp-wasm-edge) runs a module on Node, Bun, Deno, Cloudflare Workers, Vercel and Netlify ([backend](/backend)), still in progress.
- **How it works:** [architecture](/docs/architecture).
