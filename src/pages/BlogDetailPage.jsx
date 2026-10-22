import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Link2, Check, Share2 } from 'lucide-react';
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

// WhatsApp Authentic SVG Icon
function WhatsAppIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.35.03-.5.22-.2.24-.76.74-.76 1.81 0 1.07.78 2.1 1.07 2.39.29.3 1.54 2.35 3.73 3.3 2.19.95 2.19.63 2.58.6 1.15-.09 1.86-.75 2.13-1.42.27-.67.27-1.24.19-1.36-.08-.12-.3-.19-.63-.35-.33-.16-1.95-.96-2.25-1.07-.3-.11-.52-.16-.74.16-.22.32-.86 1.07-1.05 1.29-.19.22-.38.25-.71.09-.33-.16-1.39-.51-2.65-1.63-.98-.87-1.64-1.95-1.83-2.28-.19-.33-.02-.51.14-.67.15-.15.33-.39.5-.58.17-.19.22-.33.33-.55.11-.22.06-.41-.03-.58-.09-.17-.74-1.79-1.02-2.45-.27-.64-.54-.55-.74-.56z" />
    </svg>
  );
}

// X (formerly Twitter) Authentic SVG Icon
function XIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// LinkedIn Authentic SVG Icon
function LinkedInIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28M7.85 18.5V10.13H5.06V18.5h2.79z" />
    </svg>
  );
}

// Facebook Authentic SVG Icon
function FacebookIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

export function BlogDetailPage() {
  const { slug } = useParams();
  const currentSubdomain = getCurrentSubdomain();
  const [post, setPost] = useState(() => getBlogBySlug(slug));
  const [isResolving, setIsResolving] = useState(() => !getBlogBySlug(slug));
  const [copied, setCopied] = useState(false);

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

  // Construct canonical universal URL so shared links always open the exact blog page
  const getShareableUrl = () => {
    if (typeof window === 'undefined') {
      return `https://wwi.org.in/blogs/${post.slug}`;
    }
    const host = window.location.hostname.toLowerCase();
    if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.localhost')) {
      return `${window.location.protocol}//${window.location.host}/blogs/${post.slug}`;
    }
    if (host.endsWith('.vercel.app')) {
      return `${window.location.origin}/blogs/${post.slug}`;
    }
    return `https://wwi.org.in/blogs/${post.slug}`;
  };

  const shareUrl = getShareableUrl();
  const encodedTitle = encodeURIComponent(post.title);
  const encodedUrl = encodeURIComponent(shareUrl);
  const readTime = calculateReadingTime(post.content);
  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

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

        {/* Social Share Bar with Authentic App Icons & Copy Link */}
        <div className="mt-14 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              Share Article
            </span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Copy Link Button */}
            <button
              type="button"
              onClick={handleCopyLink}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-semibold transition active:scale-95 ${
                copied
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-secondary hover:bg-foreground hover:text-background border-border text-foreground'
              }`}
              title="Copy article link to clipboard"
              aria-label="Copy article link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title}\n${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
              title="Share on WhatsApp"
              className="w-9 h-9 grid place-items-center rounded-full bg-secondary hover:bg-[#25D366] hover:text-white transition text-foreground"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </a>

            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
              title="Share on LinkedIn"
              className="w-9 h-9 grid place-items-center rounded-full bg-secondary hover:bg-[#0A66C2] hover:text-white transition text-foreground"
            >
              <LinkedInIcon className="w-4 h-4" />
            </a>

            {/* X (formerly Twitter) */}
            <a
              href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on X (Twitter)"
              title="Share on X"
              className="w-9 h-9 grid place-items-center rounded-full bg-secondary hover:bg-black hover:text-white transition text-foreground"
            >
              <XIcon className="w-3.5 h-3.5" />
            </a>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
              title="Share on Facebook"
              className="w-9 h-9 grid place-items-center rounded-full bg-secondary hover:bg-[#1877F2] hover:text-white transition text-foreground"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default BlogDetailPage;
