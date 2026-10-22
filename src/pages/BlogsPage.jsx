import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, Search, X, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { PageHero } from '../components/common/PageHero';
import { SubdomainLink } from '../components/common/SubdomainLink';
import { getBlogs, subscribeToBlogs } from '../services/blogService';
import { getCurrentSubdomain } from '../utils/subdomains';

export function BlogsPage() {
  const [posts, setPosts] = useState(() => getBlogs({ includeHidden: false }));
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showAll, setShowAll] = useState(false);
  const currentSubdomain = getCurrentSubdomain();

  useEffect(() => {
    // Initial fetch and real-time subscription
    setPosts(getBlogs({ includeHidden: false }));
    const unsubscribe = subscribeToBlogs((updated) => {
      setPosts(updated.filter(p => !p.hidden));
    });
    return unsubscribe;
  }, []);

  // Collect all unique keywords / topics from all posts
  const availableKeywords = useMemo(() => {
    const set = new Set();
    posts.forEach((p) => {
      if (p.category && typeof p.category === 'string' && p.category.trim()) {
        set.add(p.category.trim());
      }
    });
    return Array.from(set);
  }, [posts]);

  // Search posts by keyword across title, category, description, author, and content
  const searchedPosts = useMemo(() => {
    if (!searchKeyword.trim()) return posts;
    const query = searchKeyword.trim().toLowerCase();
    return posts.filter((p) => {
      const title = (p.title || '').toLowerCase();
      const category = (p.category || '').toLowerCase();
      const desc = (p.shortDescription || '').toLowerCase();
      const author = (p.author || '').toLowerCase();
      const content = (p.content || '').toLowerCase();
      return (
        title.includes(query) ||
        category.includes(query) ||
        desc.includes(query) ||
        author.includes(query) ||
        content.includes(query)
      );
    });
  }, [posts, searchKeyword]);

  // Top 3 blogs on top initially, or all blogs when "See More" is clicked
  const displayedPosts = useMemo(() => {
    if (showAll || searchedPosts.length <= 3) {
      return searchedPosts;
    }
    return searchedPosts.slice(0, 3);
  }, [searchedPosts, showAll]);

  const hasMore = searchedPosts.length > 3;
  const remainingCount = Math.max(0, searchedPosts.length - 3);

  const handleClearSearch = () => {
    setSearchKeyword('');
  };

  return (
    <>
      <PageHero
        title="WWI Tech Blog &amp; Insights"
        description="Engineering articles, modern web &amp; mobile architecture patterns, and product updates from the builders at Work Wizards Innovations."
      />

      <section className="px-6 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Search Keyword for Blog */}
          {posts.length > 0 && (
            <div className="mb-10 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search Keyword Input */}
                <div className="w-full md:max-w-md">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5" /> Search Keyword for Blog
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      list="blog-keyword-suggestions"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder="Search keyword for blog (e.g. AI, React, Architecture)..."
                      className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition"
                    />
                    {searchKeyword && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full transition"
                        title="Clear search"
                        aria-label="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <datalist id="blog-keyword-suggestions">
                      {availableKeywords.map((kw) => (
                        <option key={kw} value={kw} />
                      ))}
                    </datalist>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Search articles by keyword, title, topic, or content.
                  </p>
                </div>

                {/* Article Count */}
                <div className="text-xs text-muted-foreground self-start md:self-end">
                  Showing{' '}
                  <span className="font-semibold text-foreground">
                    {displayedPosts.length}
                    {!showAll && hasMore ? ` of ${searchedPosts.length}` : ''}
                  </span>{' '}
                  {searchedPosts.length === 1 ? 'article' : 'articles'}
                  {searchKeyword && (
                    <span className="ml-1 text-foreground/80 font-medium">
                      for keyword "{searchKeyword}"
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Keywords / Topics */}
              {availableKeywords.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-xs font-medium text-muted-foreground mr-1">
                    Keywords:
                  </span>
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                      !searchKeyword.trim()
                        ? 'bg-foreground text-background border-foreground shadow-xs'
                        : 'bg-card text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground'
                    }`}
                  >
                    All ({posts.length})
                  </button>
                  {availableKeywords.map((kw) => {
                    const isActive = searchKeyword.trim().toLowerCase() === kw.toLowerCase();
                    const count = posts.filter((p) => {
                      const query = kw.toLowerCase();
                      const category = (p.category || '').toLowerCase();
                      const title = (p.title || '').toLowerCase();
                      return category.includes(query) || title.includes(query);
                    }).length;
                    return (
                      <button
                        key={kw}
                        type="button"
                        onClick={() => setSearchKeyword(kw)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                          isActive
                            ? 'bg-foreground text-background border-foreground shadow-xs'
                            : 'bg-card text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground'
                        }`}
                      >
                        {kw} ({count})
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
          ) : searchedPosts.length === 0 ? (
            <div className="text-center py-16 border border-border rounded-2xl bg-card">
              <p className="text-foreground font-semibold">
                No articles found for keyword "{searchKeyword}"
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try searching for a different keyword or view all articles.
              </p>
              <button
                type="button"
                onClick={handleClearSearch}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground text-background text-xs font-medium hover:opacity-90 transition"
              >
                Clear Search <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {displayedPosts.map((post, idx) => {
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

              {/* See More Button to Access All Blogs */}
              {hasMore && (
                <div className="mt-12 text-center">
                  {!showAll ? (
                    <button
                      type="button"
                      onClick={() => setShowAll(true)}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md group cursor-pointer"
                    >
                      <span>See More ({remainingCount} more {remainingCount === 1 ? 'blog' : 'blogs'})</span>
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowAll(false)}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-card border border-border text-foreground text-sm font-medium hover:border-foreground/40 active:scale-95 transition-all shadow-xs group cursor-pointer"
                    >
                      <span>Show Less</span>
                      <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                    </button>
                  )}
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
