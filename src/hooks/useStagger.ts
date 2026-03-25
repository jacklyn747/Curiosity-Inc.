/**
 * useStagger — Returns delay in ms for a given index based on design system.
 * 
 * @param {number} index — Element index 
 * @param {number} base — Base stagger delay (default 80ms)
 * @returns {number} Delay in ms
 */
export function useStagger(index: number, base: number = 80): number {
  return index * base;
}
