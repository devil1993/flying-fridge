/**
 * Tiny classNames helper: joins truthy string parts with a space and drops any
 * falsy values. Kept deliberately small and pure so it doubles as the reference
 * example for the TDD workflow (see src/lib/utils/cx.test.ts).
 */
export function cx(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(' ')
}
