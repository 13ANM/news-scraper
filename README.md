# News Scraper

This is a simple web scraper that fetches the latest frontend development news from React and Tailwind CSS blogs.

## ⚠️ Disclaimer

This project was built **only for learning purposes** and will not be published or used commercially.

## 🚀 How to Run Locally

### 1️⃣ Install Dependencies

Ensure you have **Bun** installed. If not, install it first:

```bash
curl -fsSL https://bun.sh/install | bash
```

Then, install project dependencies:

```bash
bun install
```

### 2️⃣ Set Up Environment Variables

This project uses **GitHub Secrets** for URLs, so they are **not in the code**. To run locally, create a `.env.local` file in the project root:

```plaintext
REACT_BLOG_URL=https://react.dev/blog
TAILWIND_BLOG_URL=https://blog.tailwindcss.com/
REACT_NEWS_URL=https://react.dev/blog
TAILWIND_NEWS_URL=https://tailwindcss.com/blog
REACT_SELECTOR='a[href^="/blog/"] h2'
TAILWIND_SELECTOR='a.font-semibold:not(.inline-block)'
REACT_SOURCE='react.dev/blog'
TAILWIND_SOURCE='blog.tailwind.css'
```

### 3️⃣ Run the Scraper

Execute the scraper using:

```bash
bun run scraper/index.ts
```

If successful, you should see `scraped-data.json` populated with the latest news.
