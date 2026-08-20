#!/usr/bin/env node
// Screenshot an animated graphic at multiple points in its timeline so an
// agent can verify motion, not just the first frame.
//
// Usage: node screenshot.mjs <file.html|url> [--at 0,1500,3000] [--out dir] [--width 900] [--dark]
//
// Requires playwright ("npm i -D playwright" once, anywhere on NODE_PATH, or
// run via "npx -y playwright@latest" fallback below). Writes frame-<ms>.png
// files and prints their paths.

import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const target = args.find((argument) => !argument.startsWith('--'));
if (!target) {
    console.error('usage: node screenshot.mjs <file.html|url> [--at 0,1500,3000] [--out dir] [--width 900] [--dark]');
    process.exit(1);
}

function flag(name, fallback) {
    const index = args.indexOf(`--${name}`);
    return index === -1 ? fallback : args[index + 1];
}

const timestamps = flag('at', '0,1500,3000').split(',').map(Number);
const outDir = resolve(flag('out', 'frames'));
const width = Number(flag('width', '900'));
const dark = args.includes('--dark');

let chromium;
try {
    ({ chromium } = await import('playwright'));
} catch {
    console.error('playwright not found. Install it once with: npm i -g playwright && npx playwright install chromium');
    process.exit(1);
}

const url = /^https?:/.test(target) ? target : pathToFileURL(resolve(target)).href;
if (!/^https?:/.test(target) && !existsSync(resolve(target))) {
    console.error(`file not found: ${target}`);
    process.exit(1);
}

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({
    viewport: { width, height: Math.round(width * 0.75) },
    colorScheme: dark ? 'dark' : 'light',
});
await page.goto(url, { waitUntil: 'networkidle' });

let elapsed = 0;
for (const timestamp of timestamps.sort((a, b) => a - b)) {
    await page.waitForTimeout(timestamp - elapsed);
    elapsed = timestamp;
    const path = `${outDir}/frame-${timestamp}${dark ? '-dark' : ''}.png`;
    await page.screenshot({ path, fullPage: true });
    console.log(path);
}

await browser.close();
