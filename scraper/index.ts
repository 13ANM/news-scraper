import axios from 'axios'
import * as cheerio from 'cheerio'
import fs from 'fs'

interface NewsItem {
  title: string
  link: string
  source: string
}

const REACT_NEWS_URL = import.meta.env.REACT_NEWS_URL as string
const TAILWIND_NEWS_URL = import.meta.env.TAILWIND_NEWS_URL as string

const REACT_SELECTOR = import.meta.env.REACT_SELECTOR as string
const TAILWIND_SELECTOR = import.meta.env.TAILWIND_SELECTOR as string
const REACT_SOURCE = import.meta.env.REACT_SOURCE as string
const TAILWIND_SOURCE = import.meta.env.TAILWIND_SOURCE as string

if (
  !REACT_NEWS_URL ||
  !TAILWIND_NEWS_URL ||
  !REACT_SELECTOR ||
  !TAILWIND_SELECTOR ||
  !REACT_SOURCE ||
  !TAILWIND_SOURCE
) {
  throw new Error('Missing required environment variables')
}

async function scrapeNews(
  blogUrl: string,
  selector: string,
  source: string
): Promise<NewsItem[]> {
  const { data } = await axios.get(blogUrl)
  const $ = cheerio.load(data)
  const news: NewsItem[] = []

  $(selector).each((_, el) => {
    const title = $(el).text().trim()
    const link = $(el).closest('a').attr('href')
    if (title && link) {
      news.push({
        title,
        link: new URL(link, blogUrl).toString(),
        source
      })
    }
  })

  return news
}

async function main() {
  try {
    const [reactNews, tailwindNews] = await Promise.all([
      scrapeNews(REACT_NEWS_URL, REACT_SELECTOR, REACT_SOURCE),
      scrapeNews(TAILWIND_NEWS_URL, TAILWIND_SELECTOR, TAILWIND_SOURCE)
    ])

    const allNews: NewsItem[] = [...reactNews, ...tailwindNews]
    fs.writeFileSync('scraped-data.json', JSON.stringify(allNews, null, 2))
    console.log('Scraped data saved.')
  } catch (error) {
    console.error('Error scraping news:', error)
    process.exit(1)
  }
}

main()
