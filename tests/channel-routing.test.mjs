import assert from "node:assert/strict";
import test from "node:test";

import {
  selectChannelManager,
  toggleChannelManager,
} from "../app/channel-routing.mjs";

test("adds and removes manager chips while keeping at least one recipient", () => {
  assert.deepEqual(
    toggleChannelManager(["panichkina", "popkov"], "turchina"),
    ["panichkina", "popkov", "turchina"],
  );
  assert.deepEqual(
    toggleChannelManager(["panichkina", "popkov"], "panichkina"),
    ["popkov"],
  );
  assert.deepEqual(toggleChannelManager(["popkov"], "popkov"), ["popkov"]);
});

test("routes every lead to the sole manager selected for a channel", () => {
  const managerId = selectChannelManager(
    ["popkov"],
    ["panichkina", "popkov", "turchina"],
    { panichkina: 639, popkov: 635, turchina: 631 },
  );

  assert.equal(managerId, "popkov");
});

test("uses round robin between selected managers who are currently free", () => {
  const managerId = selectChannelManager(
    ["panichkina", "popkov", "turchina"],
    ["panichkina", "popkov"],
    { panichkina: 639, popkov: 635, turchina: 631 },
  );

  assert.equal(managerId, "popkov");
});

test("keeps the lead queued when none of the selected managers are free", () => {
  const managerId = selectChannelManager(
    ["popkov"],
    ["panichkina", "turchina"],
    { panichkina: 639, popkov: 635, turchina: 631 },
  );

  assert.equal(managerId, null);
});
