/**
 * The recorded reports of fsharp-wasm-runtime (`site/benchmarks`, copied here: see `runtime-bench/README.md`) turned into table rows at build time, the way the runtime's own page
 * does it in the browser.  Nothing is computed that the reports do not say; the page states what each number is.
 */
import type { Cell } from '~/components/ui/dataTable';
import node1 from './runtime-bench/node-24-run1.json';
import node2 from './runtime-bench/node-24-run2.json';
import node3 from './runtime-bench/node-24-run3.json';
import nodeNoInlining from './runtime-bench/node-24-no-wasm-inlining.json';
import deno from './runtime-bench/deno-2.json';
import bun from './runtime-bench/bun-1.json';
import chromium from './runtime-bench/chromium.json';
import size from './runtime-bench/size.json';
import network from './runtime-bench/network.json';
import liveHost from './runtime-bench/live-host.json';

type Stats = { median: number; p25: number; p75: number };
type Row = { id: string; label: string; what: string; fused: boolean; ratio: number; js: Stats; wasm: Stats };
type Report = {
  date: string;
  profile: string;
  env: { cpu?: string; cores?: number };
  wasm: { bytes: number; sha256?: string };
  summary: { geomean: number; geomeanVm: number; wasmFaster: number; kernels: number };
  rows: Row[];
};

// ── speed ──
export const speedColumns: Array<{ name: string; runs: Report[] }> = [
  { name: 'Node 24', runs: [node1, node2, node3] as Report[] },
  { name: 'Node 24, V8’s Wasm inlining off', runs: [nodeNoInlining] as Report[] },
  { name: 'Deno 2', runs: [deno] as Report[] },
  { name: 'Bun 1', runs: [bun] as Report[] },
  { name: 'Chromium 153', runs: [chromium] as Report[] },
];

const med = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const fx = (x: number) => (x >= 10 ? x.toFixed(0) : x.toFixed(2));
/** a run is "shaky" when the middle half of its samples spreads over more than a quarter of the median, for either side */
const shaky = (r: Row) => [r.js, r.wasm].some((s) => (s.p75 - s.p25) / s.median > 0.25);
const spread = (xs: number[], flag: boolean) => (xs.length === 1 ? fx(xs[0]) : `${fx(med(xs))} (${fx(Math.min(...xs))}–${fx(Math.max(...xs))})`) + (flag ? ' ⚠' : '');

const first = speedColumns[0].runs[0];
export const speedNote = `Recorded ${first.date.slice(0, 10)}, ${first.profile} profile, module of ${first.wasm.bytes} bytes (sha256 ${first.wasm.sha256 ?? '?'}…), ${first.env.cpu ?? 'a virtual machine'}${first.env.cores ? ` × ${first.env.cores}` : ''}.`;

/** the ratio is "JavaScript's time ÷ the module's time": above 1, the F# module is faster; it is accent-coloured then */
export const speedRows: Array<Array<string | Cell>> = [
  ...first.rows.map((row) => [
    { text: row.label + (row.fused ? ' †' : ''), title: row.what },
    ...speedColumns.map(({ runs }): Cell => {
      const rs = runs.map((r) => r.rows.find((x) => x.id === row.id)!);
      const v = rs.map((x) => x.ratio);
      return { text: spread(v, rs.some(shaky)), good: med(v) >= 1 };
    }),
  ]),
  ['geometric mean', ...speedColumns.map(({ runs }) => spread(runs.map((r) => r.summary.geomean), false))],
  ['geometric mean without †', ...speedColumns.map(({ runs }) => spread(runs.map((r) => r.summary.geomeanVm), false))],
];

// ── size ──
export const kb = (n: number) => `${(n / 1024).toFixed(n >= 10240 ? 0 : 1)} KB`;
const byRaw = <T extends { raw: number }>(xs: T[]) => [...xs].sort((a, b) => b.raw - a.raw);
type Module = { id: string; demo: string; file: string; raw: number; gzip: number; brotli: number };
const moduleCell = (m: { file: string; demo: string }): Cell => ({ text: m.file, sub: m.demo });

export const sizeDate = size.date.slice(0, 10);
export const sizeNote = size.note;
export const sizeRows: Array<Array<string | Cell>> = byRaw(size.modules as Module[]).map((m) => [
  moduleCell(m),
  kb(m.raw),
  kb(m.gzip),
  kb(m.brotli),
  `${Math.round((m.brotli / m.raw) * 100)} %`,
]);

type Page = { id: string; requests: Array<{ path: string; raw: number }>; total: { raw: number; gzip: number; brotli: number } };
export const pageRows: Array<Array<string | Cell>> = (size.pages as Page[]).map((p) => [
  p.id,
  String(p.requests.length),
  kb(p.total.raw),
  kb(p.total.gzip),
  kb(p.total.brotli),
  {
    text: p.requests
      .slice(0, 2)
      .map((r) => `${r.path.split('/').filter(Boolean).pop() || r.path} ${kb(r.raw)}`)
      .join(', '),
    muted: true,
  },
]);

// ── network ──
type Timing = { wireBytes: number; downloadMs: number; compileMs: number };
type NetModule = Module & { results: Record<string, Record<'identity' | 'gzip' | 'br', Timing>> };
export const networkDate = network.date.slice(0, 10);
export const networkProfiles = network.profiles as Array<{ id: string; label: string; mbps: number | null; rtt: number }>;
export const encodings = [
  { id: 'gzip' as const, label: 'gzip (what GitHub Pages sends)' },
  { id: 'br' as const, label: 'brotli' },
  { id: 'identity' as const, label: 'no compression' },
];
/** download plus compile, in ms, per profile; the first column is what travels */
export const networkRows = (enc: 'identity' | 'gzip' | 'br'): Array<Array<string | Cell>> =>
  byRaw(network.modules as NetModule[]).map((m) => [
    moduleCell(m),
    kb(m.results.local[enc].wireBytes),
    ...networkProfiles.map((p) => `${Math.round(m.results[p.id][enc].downloadMs + m.results[p.id][enc].compileMs)} ms`),
  ]);

// ── the real host ──
type HostModule = { id: string; raw: number; results: Record<'identity' | 'gzip' | 'br', { wireBytes: number; totalMs: number }> };
export const hostNote = `${liveHost.host}, asked with curl from one cloud VM (${liveHost.date.slice(0, 10)}): the median of three requests after a warm-up.`;
export const hostRows: Array<Array<string | Cell>> = byRaw(liveHost.modules as HostModule[]).map((m) => {
  const [demo, file] = m.id.split('/');
  const [n, g, b] = (['identity', 'gzip', 'br'] as const).map((e) => Math.round(m.results[e].totalMs));
  return [moduleCell({ file, demo }), kb(m.raw), kb(m.results.gzip.wireBytes), `${n} / ${g} / ${b} ms`];
});
