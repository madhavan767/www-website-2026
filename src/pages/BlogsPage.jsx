import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { PageHero } from '../components/common/PageHero';
import { Reveal } from '../components/common/Reveal';
import { SubdomainLink } from '../components/common/SubdomainLink';
import { getBlogs, subscribeToBlogs } from '../services/blogService';
import { getCurrentSubdomain } from '../utils/subdomains';

export function BlogsPage() {
  const [posts, setPosts] = useState(() => getBlogs({ includeHidden: false }));
  const currentSubdomain = getCurrentSubdomain();

  useEffect(() => {
    // Initial fetch and real-time subscription
    setPosts(getBlogs({ includeHidden: false }));
    const unsubscribe = subscribeToBlogs((updated) => {
      setPosts(updated.filter(p => !p.hidden));
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <PageHero
        title="WWI Tech Blog &amp; Insights"
        description="Engineering articles, modern web &amp; mobile architecture patterns, and product updates from the builders at Work Wizards Innovations."
      />

      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-16 border border-border rounded-2xl bg-card">
              <p className="text-muted-foreground">
                No articles published yet — check back soon!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, idx) => {
                const postUrl = currentSubdomain === 'blog' ? `/${post.slug}` : `/blogs/${post.slug}`;
                const formattedDate = post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })
                  : null;

                return (
                  <Reveal key={post.id || post.slug} delay={idx * 0.05}>
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
                        <div className="w-full aspect-[16/9] bg-secondary flex items-center justify-center text-xs text-muted-foreground">
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
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default BlogsPage;
