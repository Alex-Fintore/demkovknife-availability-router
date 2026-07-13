import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const outputRoot = new URL("../gh-pages/", import.meta.url);

test("builds a standalone GitHub Pages entrypoint", async () => {
  const html = await readFile(new URL("index.html", outputRoot), "utf8");

  assert.match(html, /DemkovKnife — распределение диалогов/);
  assert.match(html, /\/demkovknife-availability-router\/assets\//);
});

test("bundles the routing screen and its interactions", async () => {
  const assets = await readdir(new URL("assets/", outputRoot));
  const scripts = assets.filter((file) => file.endsWith(".js"));
  assert.ok(scripts.length > 0, "expected at least one JavaScript bundle");

  const source = await readFile(new URL(`assets/${scripts[0]}`, outputRoot), "utf8");
  assert.match(source, /Распределение диалогов/);
  assert.match(source, /Распределение по каналам/);
  assert.match(source, /Выберите одного или нескольких менеджеров/);
  assert.match(source, /Назначить/);
  assert.match(source, /На обеде/);
});
