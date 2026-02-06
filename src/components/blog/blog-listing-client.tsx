'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface BlogListingClientProps {
  posts: BlogPost[];
  allTags: string[];
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function BlogListingClient({ posts, allTags }: BlogListingClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const sortedPosts = [...filteredPosts].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const regularPosts = sortedPosts.filter((p) => p.id !== featuredPost?.id);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Our Blog</h1>
          <p className="text-sm text-gray-500 mt-1">Tips and insights on cold therapy and recovery</p>

          <div className="mt-4 flex flex-col sm:flex-row gap-3 max-w-lg" style={{ colorScheme: 'light' }}>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-white transition-colors"
              />
            </div>
            {allTags.length > 0 && (
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-white transition-colors"
              >
                <option value="">All Topics</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Featured Post */}
      {featuredPost && !searchTerm && !selectedTag && (
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow block"
            >
              <div className="grid md:grid-cols-2 gap-0">
                <div className="h-56 md:h-72 bg-gray-100">
                  {featuredPost.featured_image && (
                    <img
                      src={featuredPost.featured_image}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <span className="text-xs bg-brand-primary text-white px-2 py-1 rounded w-fit mb-4">Featured</span>
                  <h2 className="text-xl md:text-2xl font-bold text-brand-dark mb-3 line-clamp-2">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(featuredPost.published_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredPost.read_time} min
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {regularPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow block"
                >
                  <div className="w-full h-44 bg-gray-100 relative">
                    {post.featured_image && (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.published_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.read_time} min
                      </span>
                    </div>
                    <h2 className="text-base md:text-lg font-semibold text-brand-dark mb-2 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {post.tags[0] || 'Article'}
                      </span>
                      <span className="text-brand-primary text-sm font-medium flex items-center gap-1">
                        Read <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            !featuredPost && (
              <div className="text-center py-16">
                <p className="text-gray-500 mb-4">No articles found</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTag('');
                  }}
                  className="text-brand-primary font-medium hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}
