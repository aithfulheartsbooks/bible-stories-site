import { PEEKS_A } from "./peeks-a";
import { PEEKS_B } from "./peeks-b";

export type PeekPage = {
  kicker: string;
  text: string;
};

export const PEEKS = { ...PEEKS_A, ...PEEKS_B };

export function peekFor(slug: string, _blurb?: string) {
  return PEEKS[slug];
}
