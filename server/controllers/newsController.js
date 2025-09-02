const axios = require('axios');

// Cache for news articles
let newsCache = {
  articles: [],
  lastFetch: null,
  cacheExpiry: 5 * 60 * 1000 // 5 minutes
};

const NewsController = {
  async getEnvironmentalNews(req, res) {
    try {
      const now = Date.now();
      
      // Check if cache is still valid
      if (newsCache.articles.length > 0 && 
          newsCache.lastFetch && 
          (now - newsCache.lastFetch) < newsCache.cacheExpiry) {
        return res.json({
          success: true,
          data: newsCache.articles,
          cached: true
        });
      }

      // Fetch fresh news
      const articles = await fetchEnvironmentalNews();
      
      // Update cache
      newsCache = {
        articles,
        lastFetch: now,
        cacheExpiry: 5 * 60 * 1000
      };

      res.json({
        success: true,
        data: articles,
        cached: false
      });
    } catch (error) {
      console.error('Error fetching news:', error);
      
      // Return cached data if available, otherwise fallback
      if (newsCache.articles.length > 0) {
        return res.json({
          success: true,
          data: newsCache.articles,
          cached: true,
          warning: 'Using cached data due to API error'
        });
      }
      
      // Fallback to mock data
      res.json({
        success: true,
        data: generateFallbackNews(),
        fallback: true
      });
    }
  }
};

async function fetchEnvironmentalNews() {
  const articles = [];
  
  try {
    // Try NewsAPI first (requires API key)
    if (process.env.NEWS_API_KEY) {
      const newsApiResponse = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: 'climate change OR environmental OR renewable energy OR sustainability',
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 10,
          apiKey: process.env.NEWS_API_KEY
        },
        timeout: 5000
      });
      
      if (newsApiResponse.data.articles) {
        articles.push(...newsApiResponse.data.articles.map(article => ({
          id: article.url,
          title: article.title,
          summary: article.description || article.content?.substring(0, 200) + '...',
          source: article.source.name,
          publishedAt: article.publishedAt,
          url: article.url,
          image: article.urlToImage || 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=300&h=200&fit=crop'
        })));
      }
    }
  } catch (error) {
    console.log('NewsAPI failed, trying alternative sources');
  }

  // If no articles from NewsAPI, try RSS feeds
  if (articles.length === 0) {
    try {
      // Try Guardian API (free, no key required for some endpoints)
      const guardianResponse = await axios.get('https://content.guardianapis.com/search', {
        params: {
          q: 'climate change',
          section: 'environment',
          'show-fields': 'headline,trailText,thumbnail',
          'page-size': 5,
          'api-key': process.env.GUARDIAN_API_KEY || 'test'
        },
        timeout: 5000
      });
      
      if (guardianResponse.data.response.results) {
        articles.push(...guardianResponse.data.response.results.map(article => ({
          id: article.id,
          title: article.webTitle,
          summary: article.fields?.trailText || 'Environmental news from The Guardian',
          source: 'The Guardian',
          publishedAt: article.webPublicationDate,
          url: article.webUrl,
          image: article.fields?.thumbnail || 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=300&h=200&fit=crop'
        })));
      }
    } catch (error) {
      console.log('Guardian API failed');
    }
  }

  // If still no articles, return curated environmental news
  if (articles.length === 0) {
    return generateCuratedNews();
  }

  return articles.slice(0, 8); // Limit to 8 articles
}

function generateCuratedNews() {
  const currentTime = Date.now();
  return [
    {
      id: 'curated-1',
      title: 'Global Climate Summit Announces Breakthrough Carbon Capture Technology',
      summary: 'Scientists unveil revolutionary direct air capture system that could remove 1 million tons of CO2 annually, marking a significant step in climate change mitigation.',
      source: 'Environmental Science Today',
      publishedAt: new Date(currentTime - 2 * 60 * 60 * 1000).toISOString(),
      url: 'https://example.com/climate-breakthrough',
      image: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=300&h=200&fit=crop'
    },
    {
      id: 'curated-2',
      title: 'Renewable Energy Surpasses Coal in Global Power Generation',
      summary: 'For the first time in history, renewable energy sources including solar, wind, and hydroelectric power have generated more electricity than coal worldwide.',
      source: 'Green Energy Report',
      publishedAt: new Date(currentTime - 4 * 60 * 60 * 1000).toISOString(),
      url: 'https://example.com/renewable-milestone',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300&h=200&fit=crop'
    },
    {
      id: 'curated-3',
      title: 'Ocean Cleanup Project Removes Record 200,000 Pounds of Plastic',
      summary: 'The Ocean Cleanup foundation announces its most successful mission yet, extracting massive amounts of plastic waste from the Great Pacific Garbage Patch.',
      source: 'Marine Conservation News',
      publishedAt: new Date(currentTime - 6 * 60 * 60 * 1000).toISOString(),
      url: 'https://example.com/ocean-cleanup-success',
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=200&fit=crop'
    },
    {
      id: 'curated-4',
      title: 'Students Lead Global Tree Planting Initiative Reaches 1 Million Trees',
      summary: 'Youth-led environmental movement achieves milestone of planting one million trees across 50 countries, inspiring a new generation of environmental activists.',
      source: 'Youth Climate Action',
      publishedAt: new Date(currentTime - 8 * 60 * 60 * 1000).toISOString(),
      url: 'https://example.com/student-tree-initiative',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&h=200&fit=crop'
    },
    {
      id: 'curated-5',
      title: 'Revolutionary Solar Panel Technology Achieves 50% Efficiency',
      summary: 'Breakthrough in perovskite-silicon tandem solar cells promises to revolutionize renewable energy with unprecedented efficiency rates.',
      source: 'Solar Technology Review',
      publishedAt: new Date(currentTime - 12 * 60 * 60 * 1000).toISOString(),
      url: 'https://example.com/solar-breakthrough',
      image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=300&h=200&fit=crop'
    }
  ];
}

function generateFallbackNews() {
  return generateCuratedNews();
}

module.exports = NewsController;