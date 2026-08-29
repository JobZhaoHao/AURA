export type RandomDomain = "card" | "orientation";

export interface DeterministicRandomStep {
  readonly state: number;
  readonly uint32: number;
  readonly value: number;
}

export function fnv1a32Ascii(text: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    const byte = text.charCodeAt(index);
    hash = Math.imul((hash ^ byte) >>> 0, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

export function mulberry32Step(state: number): DeterministicRandomStep {
  const nextState = (state + 0x6d2b79f5) >>> 0;
  let mixed = nextState;
  mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1) >>> 0;
  mixed =
    (mixed ^ ((mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61)) >>> 0)) >>>
    0;
  const uint32 = (mixed ^ (mixed >>> 14)) >>> 0;
  return { state: nextState, uint32, value: uint32 / 0x100000000 };
}

export function sampleRandomDomain(
  seed: string,
  domain: RandomDomain,
): DeterministicRandomStep {
  return mulberry32Step(fnv1a32Ascii(`${seed}:${domain}`));
}
