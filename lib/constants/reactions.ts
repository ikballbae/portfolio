/**
 * Single source of truth for Blog Reactions
 * Database table `posts_metrics` has exactly 4 reaction columns:
 * - fire_count
 * - insightful_count
 * - rocket_count
 * - applause_count
 */

export const REACTIONS = ['fire', 'insightful', 'rocket', 'applause'] as const
export type ReactionType = (typeof REACTIONS)[number]

export const REACTION_COLUMN_MAP: Record<ReactionType, 'fire_count' | 'insightful_count' | 'rocket_count' | 'applause_count'> = {
  fire: 'fire_count',
  insightful: 'insightful_count',
  rocket: 'rocket_count',
  applause: 'applause_count',
}

export function isAllowedReaction(value: unknown): value is ReactionType {
  return typeof value === 'string' && (REACTIONS as readonly string[]).includes(value)
}

export interface ReactionConfig {
  id: ReactionType
  dbType: ReactionType
  dbField: 'fire_count' | 'insightful_count' | 'rocket_count' | 'applause_count'
  label: string
  tooltip: string
  icon: string
  legacyKeys: string[]
}

export const REACTION_ITEMS: ReactionConfig[] = [
  {
    id: 'fire',
    dbType: 'fire',
    dbField: 'fire_count',
    label: 'Keren',
    tooltip: 'Keren banget!',
    icon: '/emojis/fire.png',
    legacyKeys: ['🔥', 'fire'],
  },
  {
    id: 'insightful',
    dbType: 'insightful',
    dbField: 'insightful_count',
    label: 'Takjub',
    tooltip: 'Bikin takjub!',
    icon: '/emojis/mind_blown.png',
    legacyKeys: ['💡', 'insightful', 'mind_blown', '🤯'],
  },
  {
    id: 'rocket',
    dbType: 'rocket',
    dbField: 'rocket_count',
    label: 'Gas Pol',
    tooltip: 'Terbang tinggi!',
    icon: '/emojis/rocket.png',
    legacyKeys: ['🚀', 'rocket'],
  },
  {
    id: 'applause',
    dbType: 'applause',
    dbField: 'applause_count',
    label: 'Mantap',
    tooltip: 'Mantap!',
    icon: '/emojis/party.png',
    legacyKeys: ['👏', 'applause', 'party', '🎉'],
  },
]
