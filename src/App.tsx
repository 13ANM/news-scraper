import { useEffect, useState } from 'react'

interface NewsItem {
	title: string
	link: string
	source: string
}

const App = () => {
	const [news, setNews] = useState<NewsItem[]>([])

	useEffect(() => {
		fetch('/scraped-data.json')
			.then((res) => res.json())
			.then((data) => setNews(data))
			.catch(console.error)
	}, [])

	return (
		<div className='p-4'>
			{news.map((item, idx) => (
				<div key={idx} className='mb-6'>
					<a
						className='text-xl font-bold text-blue-500 underline'
						href={item.link}
					>
						{item.title}
					</a>

					<p className='text-gray-600'>{item.source}</p>
				</div>
			))}
		</div>
	)
}

export default App
