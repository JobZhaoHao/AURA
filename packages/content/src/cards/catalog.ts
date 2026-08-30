import type { CardId, Suit } from "@aura/contracts";

const MAJORS = [
  ["fool", "愚人"],
  ["magician", "魔术师"],
  ["high-priestess", "女祭司"],
  ["empress", "皇后"],
  ["emperor", "皇帝"],
  ["hierophant", "教皇"],
  ["lovers", "恋人"],
  ["chariot", "战车"],
  ["strength", "力量"],
  ["hermit", "隐士"],
  ["wheel-of-fortune", "命运之轮"],
  ["justice", "正义"],
  ["hanged-man", "倒吊人"],
  ["death", "死神"],
  ["temperance", "节制"],
  ["devil", "恶魔"],
  ["tower", "高塔"],
  ["star", "星星"],
  ["moon", "月亮"],
  ["sun", "太阳"],
  ["judgement", "审判"],
  ["world", "世界"],
] as const;

const SUITS = [
  ["wands", "权杖"],
  ["cups", "圣杯"],
  ["swords", "宝剑"],
  ["pentacles", "星币"],
] as const;

const RANKS = [
  ["ace", "王牌"],
  ["two", "二"],
  ["three", "三"],
  ["four", "四"],
  ["five", "五"],
  ["six", "六"],
  ["seven", "七"],
  ["eight", "八"],
  ["nine", "九"],
  ["ten", "十"],
  ["page", "侍从"],
  ["knight", "骑士"],
  ["queen", "王后"],
  ["king", "国王"],
] as const;

interface MajorCardMetadata {
  readonly id: CardId;
  readonly arcana: "major";
  readonly nameZh: string;
  readonly ordinal: number;
  readonly suit?: never;
  readonly rank?: never;
}

type MinorRank = (typeof RANKS)[number][0];

interface MinorCardMetadata {
  readonly id: CardId;
  readonly arcana: "minor";
  readonly nameZh: string;
  readonly suit: Suit;
  readonly rank: MinorRank;
  readonly ordinal?: never;
}

export type CardMetadata = MajorCardMetadata | MinorCardMetadata;

const toCardId = (value: string): CardId => value as CardId;

const majorCards: MajorCardMetadata[] = MAJORS.map(
  ([slug, nameZh], ordinal) => ({
    id: toCardId(`major.${slug}`),
    arcana: "major",
    nameZh,
    ordinal,
  }),
);

const minorCards: MinorCardMetadata[] = SUITS.flatMap(([suit, suitZh]) =>
  RANKS.map(([rank, rankZh]) => ({
    id: toCardId(`minor.${suit}.${rank}`),
    arcana: "minor" as const,
    suit,
    rank,
    nameZh: `${suitZh}${rankZh}`,
  })),
);

export const CARD_CATALOG = [
  ...majorCards,
  ...minorCards,
] as readonly CardMetadata[];
export const ALL_CARD_IDS = CARD_CATALOG.map(
  ({ id }) => id,
) as readonly CardId[];

export function getCardMetadata(cardId: CardId): CardMetadata {
  const card = CARD_CATALOG.find(({ id }) => id === cardId);
  if (!card) throw new RangeError(`Unknown card id: ${cardId}`);
  return card;
}
