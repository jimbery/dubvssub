import { SitemapStream, streamToPromise } from 'sitemap'
import { mkdirSync, createWriteStream } from 'fs'
import { dirname } from 'path'

const BASE_URL = 'https://dubvssub.com'
const OUTPUT_PATH = './build/sitemap.xml'

// Create build directory if it doesn't exist
mkdirSync(dirname(OUTPUT_PATH), { recursive: true })
;(async () => {
    const stream = new SitemapStream({ hostname: BASE_URL })

    // Add URLs
    stream.write({ url: '/', changefreq: 'daily', priority: 1.0 })
    stream.write({ url: '/search', changefreq: 'weekly', priority: 0.8 })

    // Add anime pages (IDs 1-1000 as example)
    for (let id = 1; id <= 50000; id++) {
        stream.write({ url: `/anime/${id}`, changefreq: 'weekly' })
    }

    // Write to file
    const writeStream = createWriteStream(OUTPUT_PATH)
    stream.pipe(writeStream)
    await streamToPromise(stream)
    console.log(`Sitemap generated at ${OUTPUT_PATH}`)
})().catch(console.error)
