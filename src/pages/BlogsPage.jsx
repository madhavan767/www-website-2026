import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowDown, Calendar, Search, X, Sparkles, Filter } from 'lucide-react';
import { PageHero } from '../components/common/PageHero';
import { SubdomainLink } from '../components/common/SubdomainLink';
import { getBlogs, subscribeToBlogs } from '../services/blogService';
import { getCurrentSubdomain } from '../utils/subdomains';

export function BlogsPage() {
  const [posts, setPosts] = useState(() => getBlogs({ includeHidden: false }));
  const [categoryFilter, setCategoryFilter] = useState('');
  const [visibleCount, setVisibleCount] = useState(3);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const bottomSentinelRef = useRef(null);
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

  // Visible subset for incremental scrolling (initially 3, adds one by one on scroll)
  const visiblePosts = useMemo(() => {
    return filteredPosts.slice(0, visibleCount);
  }, [filteredPosts, visibleCount]);

  // Reset or adjust visibleCount if filtered posts change
  useEffect(() => {
    if (visibleCount < 3 && filteredPosts.length >= 3) {
      setVisibleCount(3);
    }
  }, [filteredPosts.length]);

  // Progressive infinite scroll: add 1 by 1 when user scrolls near the bottom
  useEffect(() => {
    const sentinel = bottomSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && visibleCount < filteredPosts.length) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 1, filteredPosts.length));
            setIsLoadingMore(false);
          }, 150);
        }
      },
      { root: null, rootMargin: '150px', threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filteredPosts.length]);

  // Window scroll event listener fallback
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (visibleCount < filteredPosts.length) {
          const scrollHeight = document.documentElement.scrollHeight;
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const clientHeight = window.innerHeight || document.documentElement.clientHeight;

          if (scrollTop + clientHeight >= scrollHeight - 250) {
            setVisibleCount((prev) => Math.min(prev + 1, filteredPosts.length));
          }
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCount, filteredPosts.length]);

  const handleCategoryChange = (val) => {
    setCategoryFilter(val);
    setVisibleCount(3);
  };

  const handleClearCategory = () => {
    setCategoryFilter('');
    setVisibleCount(3);
  };

  const handleLoadNextOne = () => {
    setVisibleCount((prev) => Math.min(prev + 1, filteredPosts.length));
  };

  const handleShowAll = () => {
    setVisibleCount(filteredPosts.length);
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
                  Showing <span className="font-semibold text-foreground">{visiblePosts.length}</span> of <span className="font-semibold text-foreground">{filteredPosts.length}</span> {filteredPosts.length === 1 ? 'article' : 'articles'}
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
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {visiblePosts.map((post, idx) => {
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
                        transition={{ duration: 0.35, delay: Math.min((idx % 3) * 0.06, 0.2) }}
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

              {/* Incremental Scroll Load Sentinel & Status */}
              {visibleCount < filteredPosts.length && (
                <div className="mt-12 pt-4 flex flex-col items-center justify-center gap-3">
                  <div className="text-xs text-muted-foreground text-center">
                    Showing <span className="font-semibold text-foreground">{visiblePosts.length}</span> of <span className="font-semibold text-foreground">{filteredPosts.length}</span> articles &bull; Scroll down to load more
                  </div>

                  <div className="flex items-center gap-3 flex-wrap justify-center">
                    <button
                      type="button"
                      onClick={handleLoadNextOne}
                      disabled={isLoadingMore}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-foreground text-sm font-medium hover:bg-secondary hover:border-foreground/40 transition shadow-xs active:scale-95 disabled:opacity-60"
                    >
                      {isLoadingMore ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                          <span>Loading next article...</span>
                        </>
                      ) : (
                        <>
                          <span>Load next article (+1)</span>
                          <ArrowDown className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleShowAll}
                      className="px-4 py-2 rounded-full text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition"
                    >
                      Show all ({filteredPosts.length})
                    </button>
                  </div>

                  {/* IntersectionObserver Sentinel */}
                  <div
                    ref={bottomSentinelRef}
                    className="h-10 w-full pointer-events-none opacity-0"
                    aria-hidden="true"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default BlogsPage;
