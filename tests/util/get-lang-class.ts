import { enGB } from '../lang/en-gb'

export type LanguageClass = enGB

export default (langCode: string): LanguageClass => {
    switch (langCode) {
        case 'enGB':
            return new enGB()
        default:
            throw new Error(`Unsupported language code: ${langCode}`)
    }
}
