'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Calendar, User, Image, Save, X } from 'lucide-react';
import { BlogPost, BlogFormData, generateSlug } from '@/types/blog';
import { BlogApi } from '@/lib/blog-api-client';

export function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'Warrior Leap Team',
    featured_image: '',
    tags: [],
    read_time: 5,
    featured: false,
    status: 'draft'
  });

  // Fetch data from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const postsData = await BlogApi.getAllPosts();
        setPosts(postsData);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const postData = {
        ...formData,
        published_at: formData.status === 'published' ? new Date().toISOString() : new Date().toISOString()
      };

      if (editingPost) {
        // Update existing post
        const updatedPost = await BlogApi.updatePost(editingPost.id, postData);
        setPosts(posts.map(post =>
          post.id === editingPost.id ? updatedPost : post
        ));
      } else {
        // Create new post
        const newPost = await BlogApi.createPost(postData);
        setPosts([newPost, ...posts]);
      }

      resetForm();
    } catch (err) {
      console.error('Error saving post:', err);
      setError('Failed to save the post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: 'Warrior Leap Team',
      featured_image: '',
      tags: [],
      read_time: 5,
      featured: false,
      status: 'draft'
    });
    setEditingPost(null);
    setShowForm(false);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug || generateSlug(post.title),
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      featured_image: post.featured_image,
      tags: post.tags,
      read_time: post.read_time,
      featured: post.featured,
      status: post.status
    });
    setShowForm(true);
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        setLoading(true);
        await BlogApi.deletePost(postId);
        setPosts(posts.filter(post => post.id !== postId));
      } catch (err) {
        console.error('Error deleting post:', err);
        setError('Failed to delete the post. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim().toLowerCase();
      if (!formData.tags.includes(newTag)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, newTag]
        });
      }
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-brand-primary rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
            <Edit className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Blog Management</h2>
            <p className="text-xs sm:text-sm lg:text-base text-gray-400 hidden sm:block">Create, edit, and manage your blog posts</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-3 lg:p-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            <p className="text-red-800 font-medium text-xs sm:text-sm">Error</p>
          </div>
          <p className="text-red-700 mt-1 text-xs sm:text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700 text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* Header with Actions */}
      <div className="bg-brand-dark/30 rounded-lg lg:rounded-xl p-2 sm:p-3 lg:p-6 shadow-lg border border-white/10 backdrop-blur-md">
        <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 lg:py-3 bg-white/5 border-2 border-white/10 rounded-lg lg:rounded-xl focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all duration-300 placeholder-gray-500 text-white text-xs sm:text-sm lg:text-base"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 bg-white/5 border-2 border-white/10 rounded-lg lg:rounded-xl focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all duration-300 text-white text-xs sm:text-sm lg:text-base"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-brand-primary text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg lg:rounded-xl hover:bg-brand-primary/90 transition-all duration-300 shadow-lg shadow-brand-primary/25 text-xs sm:text-sm lg:text-base w-full sm:w-auto"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            New Post
          </button>
        </div>
      </div>

      {/* Blog Posts List */}
      <div className="bg-brand-dark/30 rounded-lg lg:rounded-xl shadow-lg border border-white/10 backdrop-blur-md overflow-hidden">
        {/* Mobile Card View */}
        <div className="lg:hidden p-2 sm:p-3 space-y-2 sm:space-y-3">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/10">
              <div className="flex gap-2 sm:gap-3 mb-2 sm:mb-3">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover bg-white/10 flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=64&h=64&fit=crop&crop=faces';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1.5 sm:gap-2">
                    <h3 className="text-xs sm:text-sm font-medium text-white line-clamp-2">{post.title}</h3>
                    <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium flex-shrink-0 ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                  </div>
                  {post.featured && (
                    <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium bg-yellow-500/20 text-yellow-400 mt-0.5 sm:mt-1">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <p className="text-[10px] sm:text-xs text-gray-400 line-clamp-2 mb-2 sm:mb-3">{post.excerpt}</p>

              <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
                {post.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs bg-white/10 text-gray-300">
                    {tag}
                  </span>
                ))}
                {post.tags.length > 2 && (
                  <span className="text-[10px] sm:text-xs text-gray-500">+{post.tags.length - 2}</span>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-white/10">
                <div className="flex items-center text-[10px] sm:text-xs text-gray-400">
                  <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                  <span className="truncate max-w-[60px] sm:max-w-none">{post.author}</span>
                  <span className="mx-1 sm:mx-2">·</span>
                  <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                  <span>{new Date(post.published_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => handleEdit(post)}
                    className="p-1.5 sm:p-2 text-brand-primary bg-brand-primary/10 rounded-lg hover:bg-brand-primary/20 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-1.5 sm:p-2 text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-16 h-16 rounded-lg object-cover bg-white/10"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=64&h=64&fit=crop&crop=faces';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-white truncate">
                            {post.title}
                          </h3>
                          {post.featured && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {post.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-white/10 text-gray-300">
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-white">{post.author}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(post.published_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-brand-primary hover:text-brand-light p-1 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-6 sm:py-8 lg:py-12">
            <div className="text-gray-500 mb-2 sm:mb-4">
              <Search className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto" />
            </div>
            <h3 className="text-sm sm:text-base lg:text-lg font-medium text-white mb-1 sm:mb-2">No posts found</h3>
            <p className="text-xs sm:text-sm text-gray-400 px-4">Try adjusting your search or filter criteria, or create a new post.</p>
          </div>
        )}
      </div>

      {/* Blog Post Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-1.5 sm:p-3 lg:p-4 animate-in fade-in duration-300">
          <div className="bg-brand-dark rounded-lg sm:rounded-xl lg:rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-white/10 animate-in slide-in-from-bottom-8 duration-500">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-brand-primary to-brand-primary/80 px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative flex justify-between items-center">
                <div>
                  <h2 className="text-base sm:text-lg lg:text-2xl font-bold text-white mb-0.5 sm:mb-1">
                    {editingPost ? 'Edit Post' : 'Create New Post'}
                  </h2>
                  <p className="text-white/90 text-[10px] sm:text-xs lg:text-sm hidden sm:block">
                    {editingPost ? 'Update your content' : 'Share your thoughts with the world'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 sm:p-2 rounded-full transition-all duration-200"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="overflow-y-auto max-h-[calc(95vh-60px)] sm:max-h-[calc(95vh-80px)] lg:max-h-[calc(95vh-120px)]">
              <form onSubmit={handleFormSubmit} className="p-2 sm:p-4 lg:p-8 space-y-3 sm:space-y-4 lg:space-y-8">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-8">
                  {/* Left Column - Main Content */}
                  <div className="lg:col-span-2 space-y-3 sm:space-y-4 lg:space-y-6">
                    {/* Title */}
                    <div className="group">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2 lg:mb-3 flex items-center gap-1.5 sm:gap-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-primary rounded-full"></div>
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => {
                          const newTitle = e.target.value;
                          // Auto-generate slug from title if not editing or if slug is empty
                          const newSlug = !editingPost || !formData.slug ? generateSlug(newTitle) : formData.slug;
                          setFormData({...formData, title: newTitle, slug: newSlug});
                        }}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl lg:rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/20 focus:border-brand-primary transition-all duration-300 text-sm sm:text-base lg:text-lg font-medium text-gray-900 placeholder-gray-500 hover:border-gray-300"
                        placeholder="Enter an amazing title..."
                      />
                    </div>

                    {/* URL Slug */}
                    <div className="group">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2 lg:mb-3 flex items-center gap-1.5 sm:gap-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-primary rounded-full"></div>
                        URL Slug *
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs sm:text-sm">/blog/</span>
                        <input
                          type="text"
                          required
                          value={formData.slug}
                          onChange={(e) => setFormData({...formData, slug: generateSlug(e.target.value)})}
                          className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-primary/20 focus:border-brand-primary transition-all duration-300 text-xs sm:text-sm font-mono text-gray-900 placeholder-gray-500 hover:border-gray-300"
                          placeholder="url-friendly-slug"
                        />
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Auto-generated from title. Edit if needed.</p>
                    </div>

                    {/* Excerpt */}
                    <div className="group">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2 lg:mb-3 flex items-center gap-1.5 sm:gap-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-primary rounded-full"></div>
                        Excerpt *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={formData.excerpt}
                        onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl lg:rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/20 focus:border-brand-primary transition-all duration-300 text-sm sm:text-base text-gray-900 placeholder-gray-500 hover:border-gray-300 resize-none"
                        placeholder="Write a compelling excerpt that hooks your readers..."
                      />
                    </div>

                    {/* Content */}
                    <div className="group">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2 lg:mb-3 flex items-center gap-1.5 sm:gap-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-primary rounded-full"></div>
                        Content *
                      </label>

                      {/* Formatting Guide */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 mb-2 sm:mb-3 lg:mb-4">
                        <h4 className="font-semibold text-blue-900 mb-1 sm:mb-2 text-[10px] sm:text-xs lg:text-sm">Formatting Options:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-1 sm:gap-2 text-[10px] sm:text-xs text-blue-800">
                          <div><code className="bg-blue-100 px-0.5 sm:px-1 rounded">**text**</code> = <strong>Bold</strong></div>
                          <div><code className="bg-blue-100 px-0.5 sm:px-1 rounded">*text*</code> = <em>Italic</em></div>
                          <div><code className="bg-blue-100 px-0.5 sm:px-1 rounded"># Heading</code> = Large heading</div>
                          <div><code className="bg-blue-100 px-0.5 sm:px-1 rounded">## Subheading</code> = Medium</div>
                          <div><code className="bg-blue-100 px-0.5 sm:px-1 rounded">- Item</code> = Bullet point</div>
                          <div><code className="bg-blue-100 px-0.5 sm:px-1 rounded">1. Item</code> = Numbered list</div>
                        </div>
                      </div>

                      <div className="relative">
                        <textarea
                          required
                          rows={8}
                          value={formData.content}
                          onChange={(e) => setFormData({...formData, content: e.target.value})}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl lg:rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/20 focus:border-brand-primary transition-all duration-300 text-sm text-gray-900 placeholder-gray-500 hover:border-gray-300 resize-none font-mono leading-relaxed sm:rows-[10] lg:rows-[14]"
                          placeholder="Share your amazing content here...

Tips:
• Use **bold text** for emphasis and larger font
• Use *italic* for subtle emphasis
• Use # for main headings
• Use ## for subheadings
• Keep paragraphs concise
• Add value for your readers"
                        />
                        <div className="absolute bottom-2 sm:bottom-3 lg:bottom-4 right-2 sm:right-3 lg:right-4 text-[10px] sm:text-xs text-gray-600 bg-white/95 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg border border-gray-200">
                          {formData.content.length} chars
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Settings */}
                  <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                    {/* Publication Settings Card */}
                    <div className="bg-white border-2 border-gray-100 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-all duration-300">
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 flex items-center gap-1.5 sm:gap-2">
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 bg-brand-primary rounded-full"></div>
                        Publication Settings
                      </h3>

                      <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                        {/* Status */}
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-2">
                            Status
                          </label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value as 'draft' | 'published' | 'archived'})}
                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all duration-200 font-medium text-gray-900 text-xs sm:text-sm"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>

                        {/* Featured Toggle */}
                        <div className="flex items-center justify-between p-2 sm:p-3 lg:p-4 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-brand-primary/10 rounded-full flex items-center justify-center">
                              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-brand-primary rounded-full"></div>
                            </div>
                            <div>
                              <label htmlFor="featured" className="block text-xs sm:text-sm font-semibold text-gray-900">
                                Featured Post
                              </label>
                              <p className="text-[10px] sm:text-xs text-gray-700">Highlight this post</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            id="featured"
                            checked={formData.featured}
                            onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                            className="h-4 w-4 sm:h-5 sm:w-5 text-brand-primary focus:ring-brand-primary border-gray-300 rounded transition-all duration-200 hover:scale-110"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Author & Details Card */}
                    <div className="bg-white border-2 border-gray-100 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-all duration-300">
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 flex items-center gap-1.5 sm:gap-2">
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 bg-brand-primary rounded-full"></div>
                        Author & Details
                      </h3>

                      <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                        {/* Author */}
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-2">
                            Author
                          </label>
                          <input
                            type="text"
                            value={formData.author}
                            onChange={(e) => setFormData({...formData, author: e.target.value})}
                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all duration-200 text-gray-900 placeholder-gray-500 text-xs sm:text-sm"
                            placeholder="Author name"
                          />
                        </div>

                        {/* Read Time */}
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-2">
                            Read Time (minutes)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={formData.read_time}
                            onChange={(e) => setFormData({...formData, read_time: parseInt(e.target.value)})}
                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all duration-200 text-gray-900 text-xs sm:text-sm"
                          />
                        </div>

                        {/* Featured Image Upload */}
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-2">
                            Featured Image
                          </label>

                          {/* Image Upload Area */}
                          <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 text-center hover:border-brand-primary transition-colors">
                            {formData.featured_image ? (
                              <div className="relative">
                                <img
                                  src={formData.featured_image}
                                  alt="Featured image preview"
                                  className="w-full h-20 sm:h-24 lg:h-32 object-cover rounded-lg mb-2 sm:mb-3"
                                />
                                <div className="flex gap-1.5 sm:gap-2">
                                  <label className="flex-1 cursor-pointer bg-brand-primary text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs lg:text-sm font-medium hover:bg-brand-primary/90 transition-colors inline-flex items-center justify-center gap-1 sm:gap-2">
                                    <Image className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Change
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const reader = new FileReader();
                                          reader.onload = (event) => {
                                            setFormData({...formData, featured_image: event.target?.result as string});
                                          };
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                    />
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => setFormData({...formData, featured_image: ''})}
                                    className="px-2 sm:px-3 py-1.5 sm:py-2 bg-red-500 text-white rounded-lg text-[10px] sm:text-xs lg:text-sm font-medium hover:bg-red-600 transition-colors"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <Image className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
                                <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mb-2 sm:mb-3">
                                  <p className="font-medium">Click to upload</p>
                                  <p className="hidden sm:block">or drag and drop</p>
                                </div>
                                <p className="text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-4">
                                  PNG, JPG, GIF up to 5MB
                                </p>
                                <label className="cursor-pointer bg-brand-primary text-white px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs lg:text-sm font-medium hover:bg-brand-primary/90 transition-colors inline-flex items-center gap-1 sm:gap-2">
                                  <Image className="w-3 h-3 sm:w-4 sm:h-4" />
                                  Choose Image
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        // Check file size (5MB limit)
                                        if (file.size > 5 * 1024 * 1024) {
                                          alert('File size must be less than 5MB');
                                          return;
                                        }
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                          setFormData({...formData, featured_image: event.target?.result as string});
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            )}
                          </div>

                          {/* URL Input as Alternative */}
                          <div className="mt-2 sm:mt-3">
                            <label className="block text-[10px] sm:text-xs text-gray-600 mb-0.5 sm:mb-1">
                              Or paste image URL:
                            </label>
                            <input
                              type="url"
                              value={formData.featured_image.startsWith('data:') ? '' : formData.featured_image}
                              onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all duration-200 text-[10px] sm:text-xs lg:text-sm text-gray-700 placeholder-gray-400"
                              placeholder="https://images.unsplash.com/..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tags Card */}
                    <div className="bg-white border-2 border-gray-100 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-all duration-300">
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 flex items-center gap-1.5 sm:gap-2">
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 bg-brand-primary rounded-full"></div>
                        Tags
                      </h3>

                      <div className="space-y-2 sm:space-y-3">
                        <input
                          type="text"
                          placeholder="Type a tag and press Enter"
                          onKeyDown={handleTagInput}
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all duration-200 text-gray-900 placeholder-gray-500 text-xs sm:text-sm"
                        />

                        {formData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {formData.tags.map(tag => (
                              <span key={tag} className="inline-flex items-center gap-1 sm:gap-2 bg-brand-primary text-white px-2 sm:px-3 py-1 sm:py-1.5 lg:py-2 rounded-full text-[10px] sm:text-xs lg:text-sm font-medium hover:bg-brand-primary/90 transition-all duration-200 hover:scale-105">
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => removeTag(tag)}
                                  className="hover:bg-white/20 rounded-full p-0.5 sm:p-1 transition-all duration-200"
                                >
                                  <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-3 pt-3 sm:pt-4 lg:pt-6 border-t-2 border-white/10">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 text-gray-300 bg-white/5 hover:bg-white/10 rounded-lg sm:rounded-xl lg:rounded-2xl font-medium transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 border border-white/10 text-xs sm:text-sm"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-3 bg-brand-primary hover:bg-brand-primary/90 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-lg sm:rounded-xl lg:rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white/30 border-t-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                        {editingPost ? 'Update Post' : 'Create Post'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}