/**
 * Moves the entry matching `id` one slot up (-1) or down (1).
 *
 * Returns the original array unchanged when the entry is missing or the move
 * would fall off either end, so React can skip the re-render.
 */
export function moveById<T extends { id: string }>(list: T[], id: string, dir: -1 | 1): T[] {
  const index = list.findIndex((item) => item.id === id);
  if (index === -1) return list;

  const target = index + dir;
  if (target < 0 || target >= list.length) return list;

  const next = [...list];
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  return next;
}
