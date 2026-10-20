import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Facebook, Linkedin, Twitter } from 'lucide-react';
import { getBlogBySlug, subscribeToBlogs } from '../services/blogService';
import { FormattedContent } from '../components/common/FormattedContent';
import { SubdomainLink } from '../components/common/SubdomainLink';
import { BackButton } from '../components/common/BackButton';
import { getCurrentSubdomain } from '../utils/subdomains';

function calculateReadingTime(text) {
  if (!text) return 1;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(wordCount / 220));
}

export function BlogDetailPage() {
  const { slug } = useParams();
  const currentSubdomain = getCurrentSubdomain();
  const [post, setPost] = useState(() => getBlogBySlug(slug));
  const [isResolving, setIsResolving] = useState(() => !getBlogBySlug(slug));

  useEffect(() => {
    const found = getBlogBySlug(slug);
    setPost(found);
    if (!found) {
      const timer = setTimeout(() => {
        setIsResolving(false);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      setIsResolving(false);
    }
  }, [slug]);

  useEffect(() => {
    const unsubscribe = subscribeToBlogs(() => {
      const updated = getBlogBySlug(slug);
      setPost(updated);
      if (updated) setIsResolving(false);
    });
    return unsubscribe;
  }, [slug]);

  const allPostsUrl = currentSubdomain === 'blog' ? '/' : '/blogs';

  if (isResolving && !post) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-6 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-10 h-10 rounded-full border-2 border-foreground border-t-transparent animate-spin mb-4" />
          <p className="text-sm text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-6 text-center">
        <div className="max-w-md mx-auto p-8 rounded-2xl border border-border bg-card">
          <h1 className="text-2xl font-bold text-foreground">Article Not Found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The article you are looking for does not exist, has been moved, or is currently unpublished.
          </p>
          <SubdomainLink
            subdomain="blog"
            to={allPostsUrl}
            className="mt-6 inline-flex items-center gap-2 bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Tech Blog
          </SubdomainLink>
        </div>
      </div>
    );
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const encodedTitle = encodeURIComponent(post.title);
  const encodedUrl = encodeURIComponent(currentUrl);
  const readTime = calculateReadingTime(post.content);
  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  return (
    <article className="pb-20">
      {/* Featured Cover Image */}
      {post.featuredImage && (
        <div className="w-full aspect-[16/10] sm:aspect-[21/9] max-h-[520px] overflow-hidden bg-secondary">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 md:px-6 mt-8 md:mt-12">
        <div className="mb-4">
          <BackButton label="Back" />
        </div>

        {post.category && (
          <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
            {post.category}
          </div>
        )}

        <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
          {post.title}
        </h1>

        {post.shortDescription && (
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            {post.shortDescription}
          </p>
        )}

        <div className="mt-5 py-3 border-y border-border/60 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          {post.author && (
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
              <User className="w-3.5 h-3.5" /> {post.author}
            </span>
          )}
          {formattedDate && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> {formattedDate}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> {readTime} min read
          </span>
        </div>

        {/* Rich Article Body with Clickable Links */}
        <div className="mt-8">
          <FormattedContent content={post.content} />
        </div>

        {/* Social Share Bar */}
        <div className="mt-14 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
            Share Article
          </span>
          <div className="flex items-center gap-2">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
              className="w-9 h-9 grid place-items-center rounded-full bg-secondary hover:bg-foreground hover:text-background transition"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
              className="w-9 h-9 grid place-items-center rounded-full bg-secondary hover:bg-foreground hover:text-background transition"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on X (Twitter)"
              className="w-9 h-9 grid place-items-center rounded-full bg-secondary hover:bg-foreground hover:text-background transition"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
              className="w-9 h-9 grid place-items-center rounded-full bg-secondary hover:bg-foreground hover:text-background transition font-bold text-xs"
            >
              W
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default BlogDetailPage;
