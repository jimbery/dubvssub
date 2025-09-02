import { HunterXHunter } from './hunter-x-hunter'
import { GetSearchAnimeOutput } from '../../../src/api/get-search-anime'
import { Naruto } from './naruto'
import { OnePiece } from './one-piece'

export const GetSearchData: Record<string, GetSearchAnimeOutput> = {
    'hunter x hunter': HunterXHunter,
    naruto: Naruto,
    'one piece': OnePiece,
}
