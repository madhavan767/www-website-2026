/**
 * Dynamic Blog Service for WWI
 * Manages blog articles with Cross-Subdomain synchronization, LocalStorage persistence,
 * Cloudflare R2 image support, custom slug routing, date-based sorting, and real-time multi-tab state.
 */

import { blogsData as initialBlogsData } from '../data/blogsData.js';
import { getSharedItem, setSharedItem, removeSharedItem, subscribeSharedKey } from '../utils/storageBridge.js';

const STORAGE_KEY = 'wwi_blogs_store_v2';
const EVENT_NAME = 'wwi_blogs_updated';

// Helper to sanitize slugs
export function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

function seedDefaultBlogs() {
  return initialBlogsData.map((b, idx) => ({
    ...b,
    id: b.id || b.slug || generateSlug(b.title || `post-${idx}`) || `blog-${idx}-${Date.now()}`,
    slug: b.slug || generateSlug(b.title || `post-${idx}`),
    hidden: !!b.hidden,
    createdAt: b.createdAt || new Date(Date.now() - idx * 86400000).toISOString(),
    updatedAt: b.updatedAt || b.createdAt || new Date(Date.now() - idx * 86400000).toISOString()
  }));
}

// Cleanup legacy v1 mock store if present
function cleanupLegacyStore() {
  if (typeof window === 'undefined') return;
  try {
    if (localStorage.getItem('wwi_blogs_store_v1')) {
      localStorage.removeItem('wwi_blogs_store_v1');
      localStorage.removeItem('wwi_blogs_store_v1_ts');
      localStorage.removeItem('wwi_blogs_store_v1_initialized');
    }
  } catch {}
}

// Initialize store
function initializeStore() {
  cleanupLegacyStore();

  if (typeof window === 'undefined') {
    return seedDefaultBlogs();
  }

  try {
    const data = getSharedItem(STORAGE_KEY, null);

    // If existing store exists (even if empty array []), preserve it
    if (data !== null && Array.isArray(data)) {
      return data.map((b, idx) => ({
        ...b,
        id: b.id || b.slug || `blog-${idx}-${Date.now()}`,
        slug: b.slug || generateSlug(b.title || `post-${idx}`),
        hidden: !!b.hidden,
        createdAt: b.createdAt || new Date().toISOString(),
        updatedAt: b.updatedAt || b.createdAt || new Date().toISOString()
      }));
    }

    return seedDefaultBlogs();
  } catch (e) {
    console.error('Failed to read blogs from storage:', e);
    return seedDefaultBlogs();
  }
}

function saveStore(posts) {
  if (typeof window === 'undefined') return;
  try {
    setSharedItem(STORAGE_KEY, posts);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: posts }));
  } catch (e) {
    console.error('Failed to save blogs to storage:', e);
  }
}

/**
 * Returns all blogs sorted by date descending (newest first).
 * @param {Object} options
 * @param {boolean} options.includeHidden If false, filters out hidden posts.
 */
export function getBlogs({ includeHidden = false } = {}) {
  const posts = initializeStore();
  const filtered = includeHidden ? posts : posts.filter(p => !p.hidden);

  return filtered.sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });
}

/**
 * Finds a single blog post by its slug.
 */
export function getBlogBySlug(slug) {
  if (!slug) return null;
  const posts = initializeStore();
  return posts.find(p => (p.slug === slug || p.id === slug) && !p.hidden) || null;
}

/**
 * Returns all unique categories across existing blog posts.
 */
export function getBlogCategories() {
  const posts = initializeStore();
  const cats = new Set();
  posts.forEach(p => {
    if (p.category && typeof p.category === 'string' && p.category.trim()) {
      cats.add(p.category.trim());
    }
  });
  return Array.from(cats);
}

/**
 * Creates a new blog post.
 */
export function createBlog({
  title,
  slug,
  shortDescription,
  content,
  featuredImage,
  author = 'WWI Editorial Team',
  category = 'Technology',
  createdAt = new Date().toISOString()
}) {
  const posts = initializeStore();
  
  // Format and ensure unique slug
  let cleanSlug = generateSlug(slug || title);
  if (!cleanSlug) cleanSlug = `post-${Date.now()}`;

  let finalSlug = cleanSlug;
  let counter = 1;
  while (posts.some(p => p.slug === finalSlug)) {
    finalSlug = `${cleanSlug}-${counter}`;
    counter++;
  }

  let formattedDate = new Date().toISOString();
  if (createdAt) {
    const d = new Date(createdAt);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toISOString();
    }
  }

  const newPost = {
    id: `blog-${Date.now()}`,
    slug: finalSlug,
    title: title.trim(),
    category: category.trim() || 'Technology',
    author: author.trim() || 'WWI Editorial Team',
    createdAt: formattedDate,
    updatedAt: formattedDate,
    featuredImage: featuredImage?.trim() || '',
    shortDescription: shortDescription?.trim() || '',
    content: content?.trim() || '',
    hidden: false
  };

  const updated = [newPost, ...posts];
  saveStore(updated);
  return newPost;
}

/**
 * Updates an existing blog post by ID or Slug.
 */
export function updateBlog(id, updatedFields) {
  if (!id) return null;
  const posts = initializeStore();
  const index = posts.findIndex(p => p.id === id || p.slug === id);
  if (index === -1) return null;

  const existing = posts[index];
  const actualId = existing.id || id;
  let finalSlug = existing.slug;

  if (updatedFields.slug && updatedFields.slug !== existing.slug) {
    const cleanSlug = generateSlug(updatedFields.slug);
    finalSlug = cleanSlug;
    let counter = 1;
    while (posts.some(p => p.slug === finalSlug && p.id !== actualId && p.slug !== existing.slug)) {
      finalSlug = `${cleanSlug}-${counter}`;
      counter++;
    }
  }

  let formattedCreatedAt = existing.createdAt;
  if (updatedFields.createdAt) {
    const d = new Date(updatedFields.createdAt);
    if (!isNaN(d.getTime())) {
      formattedCreatedAt = d.toISOString();
    }
  }

  const updatedPost = {
    ...existing,
    ...updatedFields,
    id: actualId,
    slug: finalSlug,
    title: updatedFields.title !== undefined ? updatedFields.title.trim() : existing.title,
    category: updatedFields.category !== undefined ? (updatedFields.category.trim() || 'Technology') : (existing.category || 'Technology'),
    author: updatedFields.author !== undefined ? (updatedFields.author.trim() || 'WWI Editorial Team') : (existing.author || 'WWI Editorial Team'),
    featuredImage: updatedFields.featuredImage !== undefined ? updatedFields.featuredImage.trim() : (existing.featuredImage || ''),
    shortDescription: updatedFields.shortDescription !== undefined ? updatedFields.shortDescription.trim() : (existing.shortDescription || ''),
    content: updatedFields.content !== undefined ? updatedFields.content.trim() : (existing.content || ''),
    createdAt: formattedCreatedAt,
    updatedAt: new Date().toISOString()
  };

  posts[index] = updatedPost;
  saveStore(posts);
  return updatedPost;
}

/**
 * Toggles visibility (hide/unhide) of a blog post.
 */
export function toggleBlogVisibility(id) {
  if (!id) return null;
  const posts = initializeStore();
  const post = posts.find(p => p.id === id || p.slug === id);
  if (!post) return null;

  post.hidden = !post.hidden;
  post.updatedAt = new Date().toISOString();
  saveStore(posts);
  return post;
}

/**
 * Deletes a blog post by ID or Slug.
 */
export function deleteBlog(id) {
  if (!id) return false;
  const posts = initializeStore();
  const updated = posts.filter(p => p.id !== id && p.slug !== id);
  saveStore(updated);
  return true;
}

/**
 * Resets blog posts to system default.
 */
export function resetBlogsToDefault() {
  if (typeof window === 'undefined') return;
  removeSharedItem(STORAGE_KEY);
  localStorage.removeItem(`${STORAGE_KEY}_initialized`);
  const seeded = seedDefaultBlogs();
  saveStore(seeded);
  return seeded;
}

/**
 * Hook or helper to subscribe to blog changes across all subdomains and tabs.
 */
export function subscribeToBlogs(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = (updatedList) => {
    const list = Array.isArray(updatedList) ? updatedList : getBlogs({ includeHidden: true });
    const sorted = [...list].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
    callback(sorted);
  };

  // Cross-subdomain bridge subscription
  const unsubBridge = subscribeSharedKey(STORAGE_KEY, handleUpdate);

  // Local window event listener
  const localHandler = (e) => handleUpdate(e.detail);
  window.addEventListener(EVENT_NAME, localHandler);

  return () => {
    unsubBridge();
    window.removeEventListener(EVENT_NAME, localHandler);
  };
}
