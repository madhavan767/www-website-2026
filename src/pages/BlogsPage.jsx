import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, Search, X, Sparkles, Filter } from 'lucide-react';
import { PageHero } from '../components/common/PageHero';
import { SubdomainLink } from '../components/common/SubdomainLink';
import { getBlogs, subscribeToBlogs } from '../services/blogService';
import { getCurrentSubdomain } from '../utils/subdomains';

export function BlogsPage() {
  const [posts, setPosts] = useState(() => getBlogs({ includeHidden: false }));
  const [categoryFilter, setCategoryFilter] = useState('');
  const currentSubdomain = getCurrentSubdomain();

  useEffect(() => {
    // Initial fetch and real-time subscription
    setPosts(getBlogs({ includeHidden: false }));
    const unsubscribe = subscribeToBlogs((updated) => {
      setPosts(updated.filter(p => !p.hidden));
    });
    return unsubscribe;
  }, []);

  // Collect all unique categories from all posts
  const allCategories = useMemo(() => {
    const cats = new Set();
    posts.forEach((p) => {
      if (p.category && typeof p.category === 'string' && p.category.trim()) {
        cats.add(p.category.trim());
      }
    });
    return Array.from(cats);
  }, [posts]);

  // Filter posts based on category input
  const filteredPosts = useMemo(() => {
    if (!categoryFilter.trim()) return posts;
    const query = categoryFilter.trim().toLowerCase();
    return posts.filter((p) =>
      p.category && p.category.toLowerCase().includes(query)
    );
  }, [posts, categoryFilter]);

  const handleCategoryChange = (val) => {
    setCategoryFilter(val);
  };

  const handleClearCategory = () => {
    setCategoryFilter('');
  };

  return (
    <>
      <PageHero
        title="WWI Tech Blog &amp; Insights"
        description="Engineering articles, modern web &amp; mobile architecture patterns, and product updates from the builders at Work Wizards Innovations."
      />

      <section className="px-6 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Controls: Category Typebox & Quick Filters */}
          {posts.length > 0 && (
            <div className="mb-10 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Category Typebox Input */}
                <div className="w-full md:max-w-md">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5" /> Filter by Category
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      list="blog-category-filter-list"
                      value={categoryFilter}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      placeholder="Type category to filter (e.g. Technology, AI, Web...)"
                      className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition"
                    />
                    {categoryFilter && (
                      <button
                        type="button"
                        onClick={handleClearCategory}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full transition"
                        title="Clear category filter"
                        aria-label="Clear category filter"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <datalist id="blog-category-filter-list">
                      {allCategories.map((cat) => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Type any category name to instantly filter articles.
                  </p>
                </div>

                {/* Article Count & Quick View Info */}
                <div className="text-xs text-muted-foreground self-start md:self-end">
                  Showing <span className="font-semibold text-foreground">{filteredPosts.length}</span> {filteredPosts.length === 1 ? 'article' : 'articles'}
                  {categoryFilter && (
                    <span className="ml-1 text-foreground/80 font-medium">
                      matching "{categoryFilter}"
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Category Chips */}
              {allCategories.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-xs font-medium text-muted-foreground mr-1">
                    Categories:
                  </span>
                  <button
                    type="button"
                    onClick={handleClearCategory}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                      !categoryFilter.trim()
                        ? 'bg-foreground text-background border-foreground shadow-xs'
                        : 'bg-card text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground'
                    }`}
                  >
                    All ({posts.length})
                  </button>
                  {allCategories.map((cat) => {
                    const isActive = categoryFilter.trim().toLowerCase() === cat.toLowerCase();
                    const count = posts.filter(
                      (p) => p.category && p.category.toLowerCase() === cat.toLowerCase()
                    ).length;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategoryChange(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                          isActive
                            ? 'bg-foreground text-background border-foreground shadow-xs'
                            : 'bg-card text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground'
                        }`}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {posts.length === 0 ? (
            <div className="text-center py-16 border border-border rounded-2xl bg-card">
              <Sparkles className="w-6 h-6 mx-auto text-muted-foreground/60 mb-2" />
              <p className="text-muted-foreground">
                No articles published yet — check back soon!
              </p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16 border border-border rounded-2xl bg-card">
              <p className="text-foreground font-semibold">
                No articles found for "{categoryFilter}"
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try searching for another category or clear the filter.
              </p>
              <button
                type="button"
                onClick={handleClearCategory}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground text-background text-xs font-medium hover:opacity-90 transition"
              >
                Clear Category Filter <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredPosts.map((post, idx) => {
                  const postUrl = currentSubdomain === 'blog' ? `/${post.slug}` : `/blogs/${post.slug}`;
                  const formattedDate = post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                    : null;

                  return (
                    <motion.div
                      key={post.id || post.slug}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.35, delay: Math.min((idx % 6) * 0.05, 0.25) }}
                      className="h-full"
                    >
                      <SubdomainLink
                        subdomain="blog"
                        to={postUrl}
                        className="group block rounded-2xl bg-card border border-border overflow-hidden hover:border-foreground/40 hover:shadow-md transition-all h-full flex flex-col"
                      >
                        {post.featuredImage ? (
                          <div className="w-full aspect-[16/9] overflow-hidden bg-secondary">
                            <img
                              src={post.featuredImage}
                              alt={post.title}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="w-full aspect-[16/9] bg-secondary flex items-center justify-center text-xs text-muted-foreground font-mono">
                            WWI Editorial
                          </div>
                        )}

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                              {post.category && (
                                <span className="uppercase tracking-wider font-semibold">
                                  {post.category}
                                </span>
                              )}
                              {formattedDate && (
                                <span className="inline-flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formattedDate}
                                </span>
                              )}
                            </div>

                            <h2 className="mt-1 font-bold text-lg text-foreground group-hover:underline line-clamp-2">
                              {post.title}
                            </h2>

                            {post.shortDescription && (
                              <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                {post.shortDescription}
                              </p>
                            )}
                          </div>

                          <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-foreground">
                            <span>Read Article</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </SubdomainLink>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default BlogsPage;
