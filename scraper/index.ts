import axios from 'axios'
import * as cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'

interface NewsItem {
  title: string
  link: string
  source: string
}

const REACT_NEWS_URL = import.meta.env.REACT_NEWS_URL as string
const TAILWIND_NEWS_URL = import.meta.env.TAILWIND_NEWS_URL as string

if (!REACT_NEWS_URL || !TAILWIND_NEWS_URL) {
  throw new Error('Missing required environment variables')
}

const SCRAPED_DATA_PATH = path.resolve(process.cwd(), 'scraped-data.json')

async function scrapeReactNews(): Promise<NewsItem[]> {
  const url = REACT_NEWS_URL

  const { data } = await axios.get(url)

  const $ = cheerio.load(data)
  const news: NewsItem[] = []

  $('a[href^="/blog/"]').each((_, el) => {
    const title = $(el).find('h2').text().trim()
    const link = $(el).attr('href')

    if (title && link) {
      news.push({
        title,
        link: new URL(link, url).toString(),
        source: 'react.dev blog'
      })
    }
  })

  return news
}

async function scrapeTailwindNews(): Promise<NewsItem[]> {
  const url = TAILWIND_NEWS_URL

  const { data } = await axios.get(url)

  const $ = cheerio.load(data)
  const news: NewsItem[] = []

  $('a.font-semibold:not(.inline-block)').each((_, el) => {
    const title = $(el).text().trim()
    const link = $(el).attr('href')

    if (title && link) {
      news.push({
        title,
        link: new URL(link, url).toString(),
        source: 'blog.tailwind.com'
      })
    }
  })

  return news
}

async function main() {
  try {
    const [reactNews, tailwindNews] = await Promise.all([
      scrapeReactNews(),
      scrapeTailwindNews()
    ])

    const allNews: NewsItem[] = [...reactNews, ...tailwindNews]

    fs.writeFileSync(SCRAPED_DATA_PATH, JSON.stringify(allNews, null, 2))

    console.log('Scraped data saved to', SCRAPED_DATA_PATH)
  } catch (error) {
    console.error('Error scraping news:', error)

    process.exit(1)
  }
}

main()
