export type MorseMap = Record<string, string>;

export function buildReverseMap(map: MorseMap): Record<string,string> {
  const out: Record<string,string> = {};
  for (const [k,v] of Object.entries(map)) out[v]=k;
  return out;
}

export function textToMorse(text: string, map: MorseMap, sep=' '): string {
  return text.toUpperCase().split('').map(ch => map[ch] ?? ch).join(sep);
}

export function morseToText(morse: string, reverse: Record<string,string>, sep=' '): string {
  return morse.split(sep).map(code => reverse[code] ?? code).join('');
}
