import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { moveById } from "./order";

type Entry = { id: string };

const list = (): Entry[] => [{ id: "a" }, { id: "b" }, { id: "c" }];
const ids = (entries: Entry[]) => entries.map((e) => e.id).join("");

describe("moveById", () => {
  it("moves an entry up", () => {
    assert.equal(ids(moveById(list(), "b", -1)), "bac");
    assert.equal(ids(moveById(list(), "c", -1)), "acb");
  });

  it("moves an entry down", () => {
    assert.equal(ids(moveById(list(), "b", 1)), "acb");
    assert.equal(ids(moveById(list(), "a", 1)), "bac");
  });

  it("is reversible", () => {
    const start = list();
    assert.equal(ids(moveById(moveById(start, "a", 1), "a", -1)), ids(start));
  });

  it("refuses to move the first entry up or the last one down", () => {
    const start = list();
    assert.equal(moveById(start, "a", -1), start, "should return the same array");
    assert.equal(moveById(start, "c", 1), start, "should return the same array");
  });

  it("ignores an id that is not in the list", () => {
    const start = list();
    assert.equal(moveById(start, "zzz", 1), start, "should return the same array");
  });

  it("leaves the input array untouched", () => {
    const start = list();
    moveById(start, "a", 1);
    assert.equal(ids(start), "abc", "input was mutated");
  });

  it("handles a single entry and an empty list", () => {
    const single = [{ id: "only" }];
    assert.equal(moveById(single, "only", -1), single);
    assert.equal(moveById(single, "only", 1), single);
    assert.deepEqual(moveById([], "a", 1), []);
  });

  it("keeps every entry when reordering", () => {
    const moved = moveById(list(), "a", 1);
    assert.equal(moved.length, 3);
    assert.deepEqual([...ids(moved)].sort(), ["a", "b", "c"]);
  });
});
