import React, { useState, useEffect } from 'react';
import { FaNewspaper, FaExternalLinkAlt, FaClock } from 'react-icons/fa';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import apiService from '../../services/apiService';
import './News.css';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const response = await apiService.news.getNews();
      setNews(response.data || await generateMockNews());
    } catch (error) {
      console.error('Error loading news:', error);
      setNews(await generateMockNews());
    } finally {
      setLoading(false);
    }
  };

  const generateMockNews = async () => {
    try {
      // Try to fetch real news from a free API
      const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bbci.co.uk/news/science_and_environment/rss.xml');
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        return data.items.slice(0, 6).map((item, index) => ({
          id: Date.now() + index,
          title: item.title,
          summary: item.description?.replace(/<[^>]*>/g, '').substring(0, 200) + '...' || 'Environmental news from BBC',
          source: 'BBC News',
          publishedAt: item.pubDate,
          url: item.link,
          image: item.thumbnail || `https://images.unsplash.com/photo-${['1569163139394-de4e4f43e4e3', '1509391366360-2e959784a276', '1583212292454-1fe6229603b7', '1542601906990-b4d3fb778b09'][index % 4]}?w=300&h=200&fit=crop`
        }));
      }
    } catch (error) {
      console.log('RSS feed failed, using curated news');
    }
    
    // Fallback to curated news
    const newsItems = [
      {
        id: Date.now() + 1,
        title: "Global Climate Summit Announces New Green Initiatives",
        summary: "World leaders commit to reducing carbon emissions by 50% over the next decade through innovative green technologies.",
        source: "Environmental Times",
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        url: "https://www.bbc.com/news/science-environment",
        image: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=300&h=200&fit=crop"
      },
      {
        id: Date.now() + 2,
        title: "Revolutionary Solar Panel Technology Increases Efficiency by 40%",
        summary: "New perovskite-silicon tandem cells breakthrough could transform renewable energy adoption worldwide.",
        source: "Green Tech Daily",
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        url: "https://www.theguardian.com/environment",
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300&h=200&fit=crop"
      },
      {
        id: Date.now() + 3,
        title: "Ocean Cleanup Project Removes 100,000 Pounds of Plastic",
        summary: "The Ocean Cleanup's latest mission successfully extracts massive amounts of plastic waste from the Great Pacific Garbage Patch.",
        source: "Marine Conservation",
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        url: "https://www.reuters.com/business/environment/",
        image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=200&fit=crop"
      },
      {
        id: Date.now() + 4,
        title: "Students Lead Massive Tree Planting Campaign",
        summary: "Over 10,000 students across 50 schools participate in the largest youth-led reforestation effort in history.",
        source: "Youth Environmental Action",
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        url: "https://www.nationalgeographic.com/environment/",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&h=200&fit=crop"
      }
    ];
    return newsItems;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <div className="news-page">
      <Navbar />
      <div className="news-container">
        <div className="news-header">
          <h1><FaNewspaper /> Environmental News</h1>
          <p>Stay updated with the latest environmental developments</p>
        </div>

        <div className="news-content">
          {loading ? (
            <div className="loading">Loading latest news...</div>
          ) : (
            <div className="news-grid">
              {news.map((article) => (
                <div key={article.id} className="news-card">
                  <div className="news-image">
                    <img src={article.image} alt={article.title} />
                  </div>
                  <div className="news-content-area">
                    <h3>{article.title}</h3>
                    <p className="news-summary">{article.summary}</p>
                    <div className="news-meta">
                      <span className="news-source">{article.source}</span>
                      <span className="news-date">
                        <FaClock /> {formatDate(article.publishedAt)}
                      </span>
                    </div>
                    <a href={article.url} className="read-more" target="_blank" rel="noopener noreferrer">
                      Read More <FaExternalLinkAlt />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default News;