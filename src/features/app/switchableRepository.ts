/**
 * Wraps a repository behind a proxy whose target can be swapped at runtime.
 * Used so "demo mode" can point every board at seeded in-memory repositories
 * (never touching Firebase), then restore the real ones on exit — without any
 * component or hook needing to know. Consumers keep importing the same instance.
 *
 * Re-subscription happens naturally: entering/leaving demo changes the familyId,
 * so the board hooks tear down and re-subscribe against the now-current target.
 */
export function switchable<T extends object>(
  initial: T,
): { proxy: T; set: (next: T | null) => void } {
  let active: T = initial
  const proxy = new Proxy(initial, {
    get(_target, prop, receiver) {
      const value = Reflect.get(active as object, prop, receiver)
      return typeof value === 'function' ? value.bind(active) : value
    },
  }) as T
  return {
    proxy,
    // Passing null restores the original (real) repository.
    set: (next: T | null) => {
      active = next ?? initial
    },
  }
}
