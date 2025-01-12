import { HunterXHunter } from './HunterXHunter'
import { GetSearchAnimeOutput } from '../../../src/routes/GetSearchAnime'
import { Naruto } from './naruto'
import { OnePiece } from './onePiece'

export const GetSearchData: Record<string, GetSearchAnimeOutput> = {
    'hunter x hunter': HunterXHunter,
    naruto: Naruto,
    'one piece': OnePiece,
}
