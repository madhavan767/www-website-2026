import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  FileText, 
  Briefcase, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Calendar, 
  Image as ImageIcon, 
  Check, 
  AlertCircle, 
  LogOut, 
  Sparkles,
  Link as LinkIcon,
  Globe,
  ArrowRight,
  Users,
  Search,
  User,
  GraduationCap,
  MapPin,
  Clock,
  Coins,
  FileCheck,
  X,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  Copy,
  ChevronRight,
  Settings as SettingsIcon,
  Bell,
  Key,
  Shield,
  Download,
  RotateCcw
} from 'lucide-react';
import { 
  getBlogs, 
  createBlog, 
  updateBlog, 
  deleteBlog, 
  toggleBlogVisibility, 
  generateSlug,
  subscribeToBlogs 
} from '../../services/blogService';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  toggleJobVisibility,
  subscribeToJobs
} from '../../services/jobService';
import {
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  subscribeToApplications
} from '../../services/applicationService';
import {
  getWaitlist,
  deleteWaitlistSubscriber,
  subscribeToWaitlist
} from '../../services/waitlistService';
import { getSubdomainUrl } from '../../utils/subdomains';
import { getSharedItem, setSharedItem } from '../../utils/storageBridge';

const AUTH_KEY = 'wwi_admin_auth_token';
const PASSWORD_STORAGE_KEY = 'wwi_admin_password';
const DEFAULT_INITIAL_PASSWORD = 'WWI@PR2026!';
const DEFAULT_PASSWORDS = ['WWI@PR2026!', 'wwi2026', 'admin'];

export function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard state: 'blogs' | 'careers' | 'applications' | 'waitlist' | 'settings'
  const [activeTab, setActiveTab] = useState('blogs');

  // ==========================================================
  // BLOGS STATE
  // ==========================================================
  const [blogsList, setBlogsList] = useState([]);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogShortDesc, setBlogShortDesc] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogImage, setBlogImage] = useState('');
  const [blogCategory, setBlogCategory] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('WWI Editorial Team');
  const [blogDate, setBlogDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [blogSuccess, setBlogSuccess] = useState('');
  const [blogError, setBlogError] = useState('');

  // ==========================================================
  // CAREERS / JOB OPENINGS STATE
  // ==========================================================
  const [jobsList, setJobsList] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobTagline, setJobTagline] = useState('');
  const [jobLocation, setJobLocation] = useState('Remote / Hybrid (India)');
  const [jobType, setJobType] = useState('Full-Time');
  const [jobExperience, setJobExperience] = useState('1-3 Years');
  const [jobSalary, setJobSalary] = useState('Competitive Compensation');
  const [jobSummary, setJobSummary] = useState('');
  const [jobDeadline, setJobDeadline] = useState('Open / Rolling Basis');
  const [jobQualifications, setJobQualifications] = useState('');
  const [jobSuccess, setJobSuccess] = useState('');
  const [jobError, setJobError] = useState('');

  // ==========================================================
  // CANDIDATE APPLICATIONS STATE
  // ==========================================================
  const [applicationsList, setApplicationsList] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [appSearchQuery, setAppSearchQuery] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('All');
  const [appRoleFilter, setAppRoleFilter] = useState('All');
  const [copiedLink, setCopiedLink] = useState(false);

  // ==========================================================
  // WAITLIST STATE
  // ==========================================================
  const [waitlist, setWaitlist] = useState([]);
  const [waitlistSearch, setWaitlistSearch] = useState('');
  const [waitlistSourceFilter, setWaitlistSourceFilter] = useState('All');
  const [copiedWaitlistEmail, setCopiedWaitlistEmail] = useState(null);

  // ==========================================================
  // SETTINGS (CHANGE PASSWORD) STATE
  // ==========================================================
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsError, setSettingsError] = useState('');

  // SEO: Ensure admin page is strictly excluded from search crawlers
  useEffect(() => {
    if (typeof document === 'undefined') return;
    let meta = document.querySelector('meta[name="robots"]');
    let created = false;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
      created = true;
    }
    const previous = meta.content;
    meta.content = 'noindex, nofollow';

    return () => {
      if (created && meta.parentNode) {
        meta.remove();
      } else if (meta) {
        meta.content = previous || 'index, follow';
      }
    };
  }, []);

  // Check existing session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem(AUTH_KEY);
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Refresh all stores
  const refreshAllData = () => {
    setBlogsList(getBlogs({ includeHidden: true }));
    setJobsList(getJobs({ includeHidden: true }));
    setApplicationsList(getApplications());
    setWaitlist(getWaitlist());
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshAllData();

      const unsubBlogs = subscribeToBlogs((updated) => setBlogsList(updated));
      const unsubJobs = subscribeToJobs((updated) => setJobsList(updated));
      const unsubApps = subscribeToApplications((updated) => setApplicationsList(updated));
      const unsubWaitlist = subscribeToWaitlist((updated) => setWaitlist(updated));

      return () => {
        unsubBlogs();
        unsubJobs();
        unsubApps();
        unsubWaitlist();
      };
    }
  }, [isAuthenticated]);

  // Handle Login: checks custom saved password or fallback default
  const handleLogin = (e) => {
    e.preventDefault();
    const storedPass = getSharedItem(PASSWORD_STORAGE_KEY, DEFAULT_INITIAL_PASSWORD);
    const inputClean = passwordInput.trim();

    if (inputClean === storedPass || DEFAULT_PASSWORDS.includes(inputClean)) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      setIsAuthenticated(true);
      setAuthError('');
      setPasswordInput('');
    } else {
      setAuthError('Incorrect security password. Please try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  // ==========================================================
  // BLOGS LOGIC
  // ==========================================================
  const handleBlogTitleChange = (e) => {
    const val = e.target.value;
    setBlogTitle(val);
    if (!editingBlogId) {
      setBlogSlug(generateSlug(val));
    }
  };

  const resetBlogForm = () => {
    setEditingBlogId(null);
    setBlogTitle('');
    setBlogSlug('');
    setBlogShortDesc('');
    setBlogContent('');
    setBlogImage('');
    setBlogCategory('');
    setBlogAuthor('WWI Editorial Team');
    setBlogDate(new Date().toISOString().split('T')[0]);
    setBlogError('');
  };

  const startEditBlog = (post) => {
    const bId = post.id || post.slug;
    setEditingBlogId(bId);
    setBlogTitle(post.title || '');
    setBlogSlug(post.slug || '');
    setBlogShortDesc(post.shortDescription || '');
    setBlogContent(post.content || '');
    setBlogImage(post.featuredImage || '');
    setBlogCategory(post.category || '');
    setBlogAuthor(post.author || 'WWI Editorial Team');
    setBlogDate(post.createdAt ? post.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]);
    setBlogError('');
    setBlogSuccess('');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleBlogSubmit = (e) => {
    e.preventDefault();
    setBlogError('');
    setBlogSuccess('');

    if (!blogTitle.trim()) {
      setBlogError('Please enter an article headline/title.');
      return;
    }
    if (!blogShortDesc.trim()) {
      setBlogError('Please provide a short summary description.');
      return;
    }
    if (!blogContent.trim()) {
      setBlogError('Please provide detailed article content.');
      return;
    }

    try {
      let formattedDate = new Date().toISOString();
      if (blogDate) {
        const d = new Date(blogDate);
        if (!isNaN(d.getTime())) {
          formattedDate = d.toISOString();
        }
      }

      if (editingBlogId) {
        const updated = updateBlog(editingBlogId, {
          title: blogTitle,
          slug: blogSlug,
          shortDescription: blogShortDesc,
          content: blogContent,
          featuredImage: blogImage,
          category: blogCategory.trim() || 'Technology',
          author: blogAuthor,
          createdAt: formattedDate
        });
        if (!updated) {
          setBlogError('Failed to update article. Please check inputs and try again.');
          return;
        }
        setBlogSuccess('Article updated successfully and updated live on the website!');
      } else {
        createBlog({
          title: blogTitle,
          slug: blogSlug,
          shortDescription: blogShortDesc,
          content: blogContent,
          featuredImage: blogImage,
          category: blogCategory.trim() || 'Technology',
          author: blogAuthor,
          createdAt: formattedDate
        });
        setBlogSuccess('New article published successfully! It is now live on blog.wwi.org.in.');
      }

      setBlogsList(getBlogs({ includeHidden: true }));
      resetBlogForm();
      setTimeout(() => setBlogSuccess(''), 4000);
    } catch (err) {
      setBlogError('Failed to save article. Please verify inputs.');
    }
  };

  const handleDeleteBlog = (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      deleteBlog(id);
      setBlogsList(getBlogs({ includeHidden: true }));
      if (editingBlogId === id) resetBlogForm();
      setBlogSuccess(`Article "${title}" deleted successfully.`);
      setTimeout(() => setBlogSuccess(''), 4000);
    }
  };

  const handleToggleBlogHide = (id) => {
    toggleBlogVisibility(id);
    setBlogsList(getBlogs({ includeHidden: true }));
  };

  // ==========================================================
  // CAREERS / JOB OPENINGS LOGIC
  // ==========================================================
  const resetJobForm = () => {
    setEditingJobId(null);
    setJobTitle('');
    setJobTagline('');
    setJobLocation('Remote / Hybrid (India)');
    setJobType('Full-Time');
    setJobExperience('1-3 Years');
    setJobSalary('Competitive Compensation');
    setJobSummary('');
    setJobDeadline('Open / Rolling Basis');
    setJobQualifications('');
    setJobError('');
  };

  const startEditJob = (job) => {
    setEditingJobId(job.id);
    setJobTitle(job.title);
    setJobTagline(job.tagline || '');
    setJobLocation(job.location || 'Remote');
    setJobType(job.employmentType || 'Full-Time');
    setJobExperience(job.experience || '1-3 Years');
    setJobSalary(job.salary || 'Competitive');
    setJobSummary(job.roleSummary || '');
    setJobDeadline(job.deadline || 'Open / Rolling Basis');
    setJobQualifications(job.qualifications || '');
    setJobError('');
    setJobSuccess('');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleJobSubmit = (e) => {
    e.preventDefault();
    setJobError('');
    setJobSuccess('');

    if (!jobTitle.trim()) {
      setJobError('Please enter the Role Name (e.g. Senior Full-Stack Engineer).');
      return;
    }
    if (!jobSummary.trim()) {
      setJobError('Please enter the Role Summary (detailed mission and responsibilities).');
      return;
    }

    try {
      if (editingJobId) {
        updateJob(editingJobId, {
          title: jobTitle,
          tagline: jobTagline,
          location: jobLocation,
          employmentType: jobType,
          experience: jobExperience,
          salary: jobSalary,
          roleSummary: jobSummary,
          deadline: jobDeadline,
          qualifications: jobQualifications
        });
        setJobSuccess(`Job opening "${jobTitle}" updated successfully! Changes are live on careers.wwi.org.in.`);
      } else {
        createJob({
          title: jobTitle,
          tagline: jobTagline,
          location: jobLocation,
          employmentType: jobType,
          experience: jobExperience,
          salary: jobSalary,
          roleSummary: jobSummary,
          deadline: jobDeadline,
          qualifications: jobQualifications
        });
        setJobSuccess(`New job opening "${jobTitle}" published live! It is now visible on the Careers portal.`);
      }

      setJobsList(getJobs({ includeHidden: true }));
      resetJobForm();
      setTimeout(() => setJobSuccess(''), 4000);
    } catch (err) {
      setJobError('Failed to save job opening. Please check inputs.');
    }
  };

  const handleDeleteJob = (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete the job opening "${title}"?`)) {
      deleteJob(id);
      setJobsList(getJobs({ includeHidden: true }));
      if (editingJobId === id) resetJobForm();
    }
  };

  const handleToggleJobHide = (id) => {
    toggleJobVisibility(id);
    setJobsList(getJobs({ includeHidden: true }));
  };

  // ==========================================================
  // CANDIDATE APPLICATIONS LOGIC
  // ==========================================================
  const handleUpdateStatus = (appId, newStatus) => {
    updateApplicationStatus(appId, newStatus);
    setApplicationsList(getApplications());
    if (selectedApplication && selectedApplication.id === appId) {
      setSelectedApplication((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleDeleteApp = (appId, candidateName) => {
    if (window.confirm(`Delete application from candidate "${candidateName}" (${appId})?`)) {
      deleteApplication(appId);
      setApplicationsList(getApplications());
      if (selectedApplication && selectedApplication.id === appId) {
        setSelectedApplication(null);
      }
    }
  };

  const [copiedRefId, setCopiedRefId] = useState('');

  const handleCopyResumeLink = (url) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyRefId = (refId) => {
    if (!refId) return;
    navigator.clipboard.writeText(refId);
    setCopiedRefId(refId);
    setTimeout(() => setCopiedRefId(''), 2000);
  };

  const filteredApplications = applicationsList.filter((app) => {
    const matchesSearch =
      (app.name && app.name.toLowerCase().includes(appSearchQuery.toLowerCase())) ||
      (app.email && app.email.toLowerCase().includes(appSearchQuery.toLowerCase())) ||
      (app.role && app.role.toLowerCase().includes(appSearchQuery.toLowerCase())) ||
      (app.skills && app.skills.toLowerCase().includes(appSearchQuery.toLowerCase())) ||
      (app.id && app.id.toLowerCase().includes(appSearchQuery.toLowerCase()));

    const matchesStatus = appStatusFilter === 'All' || app.status === appStatusFilter;
    const matchesRole = appRoleFilter === 'All' || app.role === appRoleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const uniqueRoles = Array.from(new Set(applicationsList.map((a) => a.role).filter(Boolean)));

  // ==========================================================
  // WAITLIST LOGIC
  // ==========================================================
  const handleDeleteWaitlist = (email) => {
    if (window.confirm(`Remove ${email} from waitlist?`)) {
      deleteWaitlistSubscriber(email);
      setWaitlist(getWaitlist());
    }
  };

  const handleCopyWaitlistEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedWaitlistEmail(email);
    setTimeout(() => setCopiedWaitlistEmail(null), 2000);
  };

  const handleExportWaitlist = () => {
    if (waitlist.length === 0) return;
    const rows = waitlist.map((w) => `"${w.email}","${w.source}","${w.date}"`).join('\n');
    const csvContent = `Email,Source,Timestamp\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wwi-waitlist-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredWaitlist = waitlist.filter((entry) => {
    const matchesSearch = entry.email && entry.email.toLowerCase().includes(waitlistSearch.toLowerCase());
    const matchesSource = waitlistSourceFilter === 'All' || entry.source === waitlistSourceFilter;
    return matchesSearch && matchesSource;
  });

  const uniqueWaitlistSources = Array.from(new Set(waitlist.map((w) => w.source).filter(Boolean)));

  // ==========================================================
  // SETTINGS (CHANGE PASSWORD) LOGIC
  // ==========================================================
  const handleChangePassword = (e) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsSuccess('');

    const currentSavedPass = getSharedItem(PASSWORD_STORAGE_KEY, DEFAULT_INITIAL_PASSWORD);

    if (oldPassword.trim() !== currentSavedPass) {
      setSettingsError('The old password you entered is incorrect. Please verify your current credentials.');
      return;
    }

    if (newPassword.trim().length < 6) {
      setSettingsError('The new password must be at least 6 characters long.');
      return;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      setSettingsError('New password and verification password do not match.');
      return;
    }

    setSharedItem(PASSWORD_STORAGE_KEY, newPassword.trim());
    setSettingsSuccess('Login password changed successfully! Your new credentials are now active.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSettingsSuccess(''), 5000);
  };

  const handleResetPasswordDefault = () => {
    if (window.confirm('Reset security password to default (WWI@PR2026!)?')) {
      setSharedItem(PASSWORD_STORAGE_KEY, DEFAULT_INITIAL_PASSWORD);
      setSettingsSuccess('Password reset to default (WWI@PR2026!).');
      setTimeout(() => setSettingsSuccess(''), 4000);
    }
  };

  const handleClearAllStores = () => {
    if (window.confirm('Are you sure you want to delete ALL existing stored blogs, jobs, applications, and waitlist entries to start completely fresh? This cannot be undone.')) {
      setBlogsList([]);
      setJobsList([]);
      setApplicationsList([]);
      setWaitlist([]);
      setSharedItem('wwi_blogs_store_v2', []);
      setSharedItem('wwi_jobs_store_v2', []);
      setSharedItem('wwi_job_applications_v2', []);
      setSharedItem('wwi_waitlist_store_v2', []);
      setSettingsSuccess('All stores have been reset to a completely clean slate. You can now publish your real blogs, job openings, and accept waitlists!');
      setTimeout(() => setSettingsSuccess(''), 5000);
    }
  };

  // ==========================================================
  // 1. Password Protected Login Screen
  // ==========================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20 bg-background text-foreground">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-secondary border border-border text-foreground grid place-items-center mx-auto mb-5 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>

          <span className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">
            WWI Internal Operations
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground mt-1">
            PR &amp; Talent Dashboard
          </h1>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Enter your security credentials to manage daily blogs, candidate applications, job openings, and waitlists.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Security Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin password..."
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition cursor-pointer shadow-xs"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-border text-center">
            <span className="text-[11px] text-muted-foreground">
              Work Wizards Innovations Pvt Ltd &bull; Confidential
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // 2. Authenticated Dashboard Screen
  // ==========================================================
  return (
    <div className="min-h-screen bg-background text-foreground py-8 sm:py-10 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
              WWI Management Dashboard
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Blogs, Candidate Applications, Job Openings, Waitlist &amp; Security Settings
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          <a
            href={getSubdomainUrl('blog', '/')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-secondary text-foreground text-xs font-semibold border border-border hover:bg-secondary/80 transition"
          >
            <Globe className="w-3.5 h-3.5" /> View Blogs
          </a>
          <a
            href={getSubdomainUrl('careers', '/')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-secondary text-foreground text-xs font-semibold border border-border hover:bg-secondary/80 transition"
          >
            <Briefcase className="w-3.5 h-3.5" /> View Careers
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>
      </div>

      {/* Navigation Tabs: Blogs | Careers | Applications | Waitlist | Settings */}
      <div className="mt-6 sm:mt-8 flex items-center gap-2 sm:gap-3 border-b border-border overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('blogs')}
          className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer border-b-2 -mb-[2px] whitespace-nowrap ${
            activeTab === 'blogs'
              ? 'border-foreground text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText className="w-4 h-4" />
          Daily Blogs
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-secondary border border-border">
            {blogsList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('careers')}
          className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer border-b-2 -mb-[2px] whitespace-nowrap ${
            activeTab === 'careers'
              ? 'border-foreground text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Job Openings
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-secondary border border-border">
            {jobsList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('applications')}
          className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer border-b-2 -mb-[2px] whitespace-nowrap ${
            activeTab === 'applications'
              ? 'border-foreground text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4" />
          Applications
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
            {applicationsList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('waitlist')}
          className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer border-b-2 -mb-[2px] whitespace-nowrap ${
            activeTab === 'waitlist'
              ? 'border-foreground text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Bell className="w-4 h-4" />
          Waitlist
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold">
            {waitlist.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer border-b-2 -mb-[2px] whitespace-nowrap ${
            activeTab === 'settings'
              ? 'border-foreground text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          Settings
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: BLOGS MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === 'blogs' && (
        <div className="mt-8 space-y-12">
          {blogSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-3 shadow-xs">
              <Check className="w-5 h-5 shrink-0" />
              <span>{blogSuccess}</span>
            </div>
          )}

          {blogError && (
            <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3 shadow-xs">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{blogError}</span>
            </div>
          )}

          {/* Form */}
          <div className="p-5 sm:p-8 rounded-3xl border border-border bg-card shadow-xs">
            <div className="flex items-center justify-between pb-6 border-b border-border">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">
                  {editingBlogId ? 'Updating Existing Post' : 'Create & Publish Post'}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground mt-0.5">
                  {editingBlogId ? 'Edit Blog Article' : 'Add New Daily Blog'}
                </h2>
              </div>
              {editingBlogId && (
                <button
                  type="button"
                  onClick={resetBlogForm}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-secondary hover:bg-secondary/80 transition"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleBlogSubmit} className="mt-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Headline / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={blogTitle}
                    onChange={handleBlogTitleChange}
                    placeholder="e.g. Next-Gen Web Architectures with Microfrontends"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    URL Slug (e.g. blog.wwi.org.in/custom-slug) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono hidden sm:inline">
                      blog.wwi.org.in/
                    </span>
                    <input
                      type="text"
                      required
                      value={blogSlug}
                      onChange={(e) => setBlogSlug(generateSlug(e.target.value))}
                      placeholder="custom-slug"
                      className="w-full sm:pl-36 px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-foreground transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Cloudflare R2 Image Link / CDN URL
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="url"
                    value={blogImage}
                    onChange={(e) => setBlogImage(e.target.value)}
                    placeholder="https://pub-r2.wwi.org.in/images/article-cover.jpg"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition"
                  />
                </div>

                {blogImage ? (
                  <div className="mt-3 p-3 rounded-2xl border border-border bg-secondary/30 flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-40 aspect-video rounded-xl overflow-hidden bg-black/10 shrink-0 border border-border">
                      <img
                        src={blogImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-bold text-foreground block mb-0.5">Live Image Preview</span>
                      This image will render on the blog cards and article hero header.
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Paste your Cloudflare R2 public bucket image link or CDN URL.
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Date of Post (Supports past dates) *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      type="date"
                      required
                      value={blogDate}
                      onChange={(e) => setBlogDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    placeholder="Enter category (e.g. Technology, AI, Cloud, Design...)"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition"
                    required
                  />
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    Text input: enter any category for this article.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={blogAuthor}
                    onChange={(e) => setBlogAuthor(e.target.value)}
                    placeholder="WWI Editorial Team"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Small Description (Summary for cards &amp; previews) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={blogShortDesc}
                  onChange={(e) => setBlogShortDesc(e.target.value)}
                  placeholder="A concise 1-2 sentence overview of the article for social previews and card display..."
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Detailed Article Content (With Clickable Links &amp; Formatting) *
                  </label>
                  <span className="text-[11px] text-muted-foreground hidden sm:inline">
                    Markdown links <code className="bg-secondary px-1 py-0.5 rounded text-foreground">[Label](https://...)</code> and raw URLs supported
                  </span>
                </div>
                <textarea
                  rows={8}
                  required
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  placeholder={`Write your detailed article content here.

### Section Heading
You can write multiple paragraphs.

To add links that redirect (like an online article), write:
Visit the [Work Wizards Innovations Home](https://wwi.org.in) or check our [Careers Portal](https://careers.wwi.org.in).
Or simply paste any direct URL like https://wwi.org.in and it will automatically be formatted as a clickable link!

- Bullet point 1
- Bullet point 2`}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-foreground transition"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition cursor-pointer shadow-xs"
                >
                  {editingBlogId ? 'Update Article Now' : 'Publish Article Live'}
                </button>
                {editingBlogId && (
                  <button
                    type="button"
                    onClick={resetBlogForm}
                    className="px-5 py-3 rounded-xl bg-secondary text-foreground font-semibold text-sm hover:bg-secondary/80 transition cursor-pointer"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List of Existing Blogs */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Published &amp; Stored Articles ({blogsList.length})
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage active articles, hide/unhide posts, or edit content.
                </p>
              </div>
            </div>

            {blogsList.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-border bg-card">
                <p className="text-muted-foreground text-sm">No articles found in store.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {blogsList.map((post) => {
                  const postDate = post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A';
                  const liveUrl = getSubdomainUrl('blog', `/${post.slug}`);
                  const blogId = post.id || post.slug;

                  return (
                    <div
                      key={blogId}
                      className={`p-4 sm:p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        post.hidden
                          ? 'bg-secondary/30 border-border/60 opacity-60'
                          : 'bg-card border-border shadow-xs hover:border-foreground/30'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {post.featuredImage ? (
                          <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden bg-secondary shrink-0 border border-border">
                            <img src={post.featuredImage} alt="" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-xl bg-secondary shrink-0 grid place-items-center text-[10px] text-muted-foreground border border-border font-mono">
                            No Cover
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-secondary border border-border">
                              {post.category || 'Tech'}
                            </span>
                            {post.hidden ? (
                              <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                Hidden
                              </span>
                            ) : (
                              <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                Published
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              &bull; {postDate}
                            </span>
                          </div>

                          <h4 className="font-bold text-base text-foreground mt-1">
                            {post.title}
                          </h4>

                          <div className="text-xs text-muted-foreground font-mono mt-0.5 break-all">
                            blog.wwi.org.in/{post.slug}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Preview Article on Live Site"
                          className="p-2.5 rounded-xl border border-border bg-background hover:bg-secondary text-foreground transition text-xs flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Preview</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => startEditBlog(post)}
                          title="Edit Article"
                          className="p-2.5 rounded-xl border border-border bg-background hover:bg-secondary text-foreground transition text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleBlogHide(blogId)}
                          title={post.hidden ? 'Publish / Unhide' : 'Hide from Public Website'}
                          className={`p-2.5 rounded-xl border transition text-xs flex items-center gap-1.5 cursor-pointer ${
                            post.hidden
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-background text-muted-foreground border-border hover:text-foreground hover:bg-secondary'
                          }`}
                        >
                          {post.hidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span className="hidden sm:inline">{post.hidden ? 'Unhide' : 'Hide'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteBlog(blogId, post.title)}
                          title="Delete Permanently"
                          className="p-2.5 rounded-xl border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/15 transition text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CAREERS / JOB OPENINGS MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === 'careers' && (
        <div className="mt-8 space-y-12">
          {jobSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-3 shadow-xs">
              <Check className="w-5 h-5 shrink-0" />
              <span>{jobSuccess}</span>
            </div>
          )}

          {jobError && (
            <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3 shadow-xs">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{jobError}</span>
            </div>
          )}

          <div className="p-5 sm:p-8 rounded-3xl border border-border bg-card shadow-xs">
            <div className="flex items-center justify-between pb-6 border-b border-border">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">
                  {editingJobId ? 'Modifying Job Opening' : 'Publish New Opening'}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground mt-0.5">
                  {editingJobId ? 'Edit Job Role' : 'Add New Job Opening'}
                </h2>
              </div>
              {editingJobId && (
                <button
                  type="button"
                  onClick={resetJobForm}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-secondary hover:bg-secondary/80 transition"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleJobSubmit} className="mt-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Role Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior React & Full-Stack Engineer"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Small Tagline for the Role
                  </label>
                  <input
                    type="text"
                    value={jobTagline}
                    onChange={(e) => setJobTagline(e.target.value)}
                    placeholder="e.g. Lead modern web architectures and scalable SaaS platforms"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    placeholder="e.g. Kakinada / Hyderabad / Remote"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Employment Type *
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Experience *
                  </label>
                  <input
                    type="text"
                    required
                    value={jobExperience}
                    onChange={(e) => setJobExperience(e.target.value)}
                    placeholder="e.g. Fresher / 0-1 Years or 2-4 Years"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Salary / Compensation *
                  </label>
                  <input
                    type="text"
                    required
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                    placeholder="e.g. ₹6,00,000 - ₹10,00,000 PA"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Role Summary (Mission &amp; Core Responsibilities) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={jobSummary}
                  onChange={(e) => setJobSummary(e.target.value)}
                  placeholder="Detail what this engineer or team member will build, solve, and lead at Work Wizards Innovations..."
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-foreground transition"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Application Deadline *
                  </label>
                  <input
                    type="text"
                    required
                    value={jobDeadline}
                    onChange={(e) => setJobDeadline(e.target.value)}
                    placeholder="e.g. 2026-11-30 or Open / Rolling Basis"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Qualifications &amp; Notes (Skills, perks, criteria)
                  </label>
                  <textarea
                    rows={3}
                    value={jobQualifications}
                    onChange={(e) => setJobQualifications(e.target.value)}
                    placeholder="Required Skills: React, Node.js, Kotlin&#10;Key Qualifications: B.Tech / MCA or equivalent&#10;Perks: Remote work, health coverage"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-foreground transition"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition cursor-pointer shadow-xs"
                >
                  {editingJobId ? 'Update Role Now' : 'Publish Job Opening'}
                </button>
                {editingJobId && (
                  <button
                    type="button"
                    onClick={resetJobForm}
                    className="px-5 py-3 rounded-xl bg-secondary text-foreground font-semibold text-sm hover:bg-secondary/80 transition cursor-pointer"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List of Existing Job Openings */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Active &amp; Stored Job Openings ({jobsList.length})
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage active listings, toggle visibility (hide/unhide), or edit role specifications.
                </p>
              </div>
            </div>

            {jobsList.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-border bg-card">
                <p className="text-muted-foreground text-sm">No job openings created yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobsList.map((job) => {
                  const liveUrl = getSubdomainUrl('careers', `/${job.id}`);

                  return (
                    <div
                      key={job.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        job.hidden
                          ? 'bg-secondary/30 border-border/60 opacity-60'
                          : 'bg-card border-border shadow-xs hover:border-foreground/30'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-secondary border border-border">
                            {job.employmentType}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-secondary border border-border">
                            {job.location}
                          </span>
                          {job.hidden ? (
                            <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                              Hidden
                            </span>
                          ) : (
                            <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              Published
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            &bull; Exp: {job.experience}
                          </span>
                          <span className="text-xs font-semibold text-foreground/80">
                            &bull; {job.salary}
                          </span>
                        </div>

                        <h4 className="font-bold text-base text-foreground">
                          {job.title}
                        </h4>

                        {job.tagline && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {job.tagline}
                          </p>
                        )}

                        <div className="text-[11px] text-muted-foreground font-mono break-all">
                          careers.wwi.org.in/{job.id} &bull; Deadline: {job.deadline}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Preview Job Page on Live Site"
                          className="p-2.5 rounded-xl border border-border bg-background hover:bg-secondary text-foreground transition text-xs flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Preview</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => startEditJob(job)}
                          title="Edit Job Role"
                          className="p-2.5 rounded-xl border border-border bg-background hover:bg-secondary text-foreground transition text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleJobHide(job.id)}
                          title={job.hidden ? 'Publish / Unhide Role' : 'Hide Role from Website'}
                          className={`p-2.5 rounded-xl border transition text-xs flex items-center gap-1.5 cursor-pointer ${
                            job.hidden
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-background text-muted-foreground border-border hover:text-foreground hover:bg-secondary'
                          }`}
                        >
                          {job.hidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span className="hidden sm:inline">{job.hidden ? 'Unhide' : 'Hide'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteJob(job.id, job.title)}
                          title="Delete Role Permanently"
                          className="p-2.5 rounded-xl border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/15 transition text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: CANDIDATE APPLICATIONS MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === 'applications' && (
        <div className="mt-8 space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-xs">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Total Applicants</span>
              <div className="text-xl sm:text-2xl font-extrabold text-foreground mt-1">{applicationsList.length}</div>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-xs">
              <span className="text-xs uppercase tracking-wider text-emerald-600 font-semibold">New Submissions</span>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-1">
                {applicationsList.filter((a) => a.status === 'New').length}
              </div>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-xs">
              <span className="text-xs uppercase tracking-wider text-blue-600 font-semibold">Under Review</span>
              <div className="text-xl sm:text-2xl font-extrabold text-blue-600 mt-1">
                {applicationsList.filter((a) => a.status === 'Under Review').length}
              </div>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-xs">
              <span className="text-xs uppercase tracking-wider text-purple-600 font-semibold">Shortlisted</span>
              <div className="text-xl sm:text-2xl font-extrabold text-purple-600 mt-1">
                {applicationsList.filter((a) => a.status === 'Shortlisted').length}
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={appSearchQuery}
                onChange={(e) => setAppSearchQuery(e.target.value)}
                placeholder="Search by Reference ID (e.g. APP-2026-...), Candidate Name, Role, Email..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={appRoleFilter}
                onChange={(e) => setAppRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
              >
                <option value="All">All Roles</option>
                {uniqueRoles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>

              <select
                value={appStatusFilter}
                onChange={(e) => setAppStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-border bg-card">
              <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-muted-foreground text-sm">No applications found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((app) => {
                const subDate = app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'N/A';

                return (
                  <div
                    key={app.id}
                    className="p-4 sm:p-5 rounded-2xl border border-border bg-card hover:border-foreground/30 shadow-xs transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-secondary border border-border text-foreground font-extrabold grid place-items-center shrink-0">
                        {app.name ? app.name.charAt(0).toUpperCase() : 'C'}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-base text-foreground">
                            {app.name}
                          </span>
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-secondary/80 border border-border">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Ref ID:</span>
                            <span className="font-mono text-xs font-bold text-foreground">{app.id}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyRefId(app.id);
                              }}
                              title="Copy Reference ID"
                              className="text-muted-foreground hover:text-foreground p-0.5 cursor-pointer transition"
                            >
                              {copiedRefId === app.id ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                              app.status === 'New'
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                : app.status === 'Shortlisted'
                                ? 'bg-purple-500/10 text-purple-600 border-purple-500/20'
                                : app.status === 'Under Review'
                                ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                                : app.status === 'Interview'
                                ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                : 'bg-secondary text-muted-foreground border-border'
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-foreground/90">
                          Role: <span className="text-foreground">{app.role}</span>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground flex-wrap">
                          <span>{app.email}</span>
                          <span>&bull; {app.phone}</span>
                          <span>&bull; {app.currentPlace}, {app.state}</span>
                          <span>&bull; {app.experienceType}</span>
                          <span>&bull; Submitted {subDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setSelectedApplication(app)}
                        className="px-4 py-2 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <User className="w-3.5 h-3.5" />
                        View Full Profile
                      </button>

                      <select
                        value={app.status}
                        onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                        className="px-2.5 py-2 rounded-xl bg-secondary border border-border text-foreground text-xs font-medium cursor-pointer"
                      >
                        <option value="New">New</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Rejected">Rejected</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleDeleteApp(app.id, app.name)}
                        title="Delete Application"
                        className="p-2.5 rounded-xl border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/15 transition text-xs cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: WAITLIST & "GET NOTIFIED" SUBSCRIBERS */}
      {/* ======================================================== */}
      {activeTab === 'waitlist' && (
        <div className="mt-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-xs">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Total Waitlist Members</span>
              <div className="text-2xl font-extrabold text-foreground mt-1">{waitlist.length}</div>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-xs">
              <span className="text-xs uppercase tracking-wider text-blue-600 font-semibold">Events &amp; Hackathons</span>
              <div className="text-2xl font-extrabold text-blue-600 mt-1">
                {waitlist.filter((w) => w.source.includes('Hackathon') || w.source.includes('Event')).length}
              </div>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-xs">
              <span className="text-xs uppercase tracking-wider text-emerald-600 font-semibold">Product Launches</span>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                {waitlist.filter((w) => w.source.includes('Launch') || w.source.includes('Viadocs') || w.source.includes('KNOWRA')).length}
              </div>
            </div>
          </div>

          {/* Controls: Search, Filter, Export CSV */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={waitlistSearch}
                onChange={(e) => setWaitlistSearch(e.target.value)}
                placeholder="Search subscriber mail..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={waitlistSourceFilter}
                onChange={(e) => setWaitlistSourceFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
              >
                <option value="All">All Sources</option>
                {uniqueWaitlistSources.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleExportWaitlist}
                className="px-4 py-2 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 transition flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
            </div>
          </div>

          {/* Subscribers Table / List */}
          {filteredWaitlist.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-border bg-card">
              <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-muted-foreground text-sm">No waitlist entries found.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50 text-muted-foreground font-semibold text-[11px] uppercase tracking-wider">
                      <th className="py-3.5 px-4 sm:px-6">Mail / Subscriber</th>
                      <th className="py-3.5 px-4 sm:px-6">Source / Touchpoint</th>
                      <th className="py-3.5 px-4 sm:px-6">Registration Time &amp; Date</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredWaitlist.map((entry, idx) => {
                      const formattedTime = entry.date
                        ? new Date(entry.date).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A';

                      return (
                        <tr key={idx} className="hover:bg-secondary/30 transition">
                          <td className="py-3.5 px-4 sm:px-6 font-semibold text-foreground break-all">
                            <div className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                              <a href={`mailto:${entry.email}`} className="hover:underline">
                                {entry.email}
                              </a>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 sm:px-6">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-secondary border border-border">
                              {entry.source || 'General Updates'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 sm:px-6 text-xs text-muted-foreground whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {formattedTime}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleCopyWaitlistEmail(entry.email)}
                                title="Copy Email"
                                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold transition cursor-pointer"
                              >
                                {copiedWaitlistEmail === entry.email ? (
                                  <span className="text-emerald-600 font-bold text-[10px]">Copied!</span>
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteWaitlist(entry.email)}
                                title="Remove from Waitlist"
                                className="p-2 rounded-lg text-destructive bg-destructive/5 hover:bg-destructive/15 transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: SETTINGS (CHANGE LOGIN PASSWORD) */}
      {/* ======================================================== */}
      {activeTab === 'settings' && (
        <div className="mt-8 space-y-8 max-w-2xl">
          {settingsSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-3 shadow-xs">
              <Check className="w-5 h-5 shrink-0" />
              <span>{settingsSuccess}</span>
            </div>
          )}

          {settingsError && (
            <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3 shadow-xs">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{settingsError}</span>
            </div>
          )}

          <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-xs">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
              <div className="w-12 h-12 rounded-2xl bg-secondary border border-border grid place-items-center text-foreground">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                  Change Login Password
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  The initial default password is <code className="bg-secondary px-1.5 py-0.5 rounded font-mono font-bold text-foreground">WWI@PR2026!</code>. Enter your old password and specify your new credentials below.
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Old / Current Password *
                </label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password (e.g. WWI@PR2026!)..."
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password (min 6 characters)..."
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Verify New Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password to verify..."
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition"
                />
              </div>

              <div className="pt-4 flex items-center justify-between gap-4 flex-wrap border-t border-border">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition cursor-pointer shadow-xs"
                >
                  Update Password Now
                </button>

                <button
                  type="button"
                  onClick={handleResetPasswordDefault}
                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Revert to Default Password
                </button>
              </div>
            </form>
          </div>

          <div className="p-5 rounded-2xl bg-secondary/30 border border-border flex items-start gap-3">
            <Shield className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground block mb-0.5">Confidentiality &amp; Persistence</strong>
              Changed passwords are immediately saved to persistent storage. All future unlocks via the secret footer black dot will require your updated credentials.
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl border border-destructive/20 bg-destructive/5 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-destructive/10 text-destructive grid place-items-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Reset Stores to Clean Slate
                </h3>
                <p className="text-xs text-muted-foreground">
                  Permanently clear all stored mock/test blogs, job postings, candidate applications, and waitlists.
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
              Use this action to start completely fresh. After clearing, you can publish your real team blogs, add open roles, and collect candidate applications.
            </p>
            <button
              type="button"
              onClick={handleClearAllStores}
              className="px-5 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-semibold text-xs hover:opacity-90 transition cursor-pointer inline-flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Clear All Stores to Clean Slate
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CANDIDATE DETAIL MODAL (3 STAGES) */}
      {/* ======================================================== */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl my-6 bg-card border border-border rounded-3xl shadow-2xl p-5 sm:p-8 max-h-[92vh] max-h-[92dvh] overflow-y-auto">
            <div className="flex items-start justify-between pb-6 border-b border-border">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
                    {selectedApplication.name}
                  </h3>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-secondary border border-border">
                    {selectedApplication.id}
                  </span>
                  <span
                    className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                      selectedApplication.status === 'New'
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                        : selectedApplication.status === 'Shortlisted'
                        ? 'bg-purple-500/10 text-purple-600 border-purple-500/20'
                        : selectedApplication.status === 'Under Review'
                        ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                        : selectedApplication.status === 'Interview'
                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        : 'bg-secondary text-muted-foreground border-border'
                    }`}
                  >
                    {selectedApplication.status}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Applied for <strong className="text-foreground">{selectedApplication.role}</strong> &bull; {new Date(selectedApplication.submittedAt).toLocaleDateString()}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {/* PROMINENT APPLICATION REFERENCE ID BAR */}
              <div className="p-4 sm:p-5 rounded-2xl bg-secondary/80 border border-border flex items-center justify-between flex-wrap gap-3">
                <div>
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground block">
                    Candidate Application Reference ID
                  </span>
                  <span className="font-mono text-base sm:text-lg font-black text-foreground tracking-wider select-all">
                    {selectedApplication.id}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyRefId(selectedApplication.id)}
                  className="px-3.5 py-2 rounded-xl bg-background border border-border text-xs font-semibold hover:bg-secondary transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {copiedRefId === selectedApplication.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedRefId === selectedApplication.id ? 'Copied Reference ID' : 'Copy Reference ID'}
                </button>
              </div>

              {/* STAGE 1: PERSONAL DETAILS */}
              <div className="p-4 sm:p-5 rounded-2xl bg-secondary/30 border border-border space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <User className="w-4 h-4" />
                  Stage 1: Personal Details
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Full Name:</span>
                    <span className="font-semibold text-foreground text-sm">{selectedApplication.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Email Address:</span>
                    <a
                      href={`mailto:${selectedApplication.email}`}
                      className="font-semibold text-foreground hover:underline inline-flex items-center gap-1 break-all"
                    >
                      <Mail className="w-3.5 h-3.5 shrink-0" /> {selectedApplication.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Phone Number:</span>
                    <a
                      href={`tel:${selectedApplication.phone}`}
                      className="font-semibold text-foreground hover:underline inline-flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 shrink-0" /> {selectedApplication.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Date of Birth (DOB):</span>
                    <span className="font-semibold text-foreground">{selectedApplication.dob || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Gender:</span>
                    <span className="font-semibold text-foreground">{selectedApplication.gender || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Current Location:</span>
                    <span className="font-semibold text-foreground">
                      {selectedApplication.currentPlace}, {selectedApplication.state}, {selectedApplication.country}
                    </span>
                  </div>
                </div>
              </div>

              {/* STAGE 2: EDUCATION AND PROFESSIONAL BACKGROUND */}
              <div className="p-4 sm:p-5 rounded-2xl bg-secondary/30 border border-border space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <GraduationCap className="w-4 h-4" />
                  Stage 2: Education &amp; Professional Background
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Highest Qualification:</span>
                    <span className="font-semibold text-foreground">{selectedApplication.qualification}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">College / University:</span>
                    <span className="font-semibold text-foreground">{selectedApplication.college}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Passing Year &amp; CGPA:</span>
                    <span className="font-semibold text-foreground">
                      Year: {selectedApplication.passingYear} &bull; CGPA: {selectedApplication.cgpa}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Experience Level:</span>
                    <span className="font-semibold text-foreground uppercase tracking-wide">
                      {selectedApplication.experienceType}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-muted-foreground block mb-1">Technical Skills:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedApplication.skills
                        ? selectedApplication.skills.split(',').map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-secondary border border-border text-[11px] font-medium text-foreground">
                              {s.trim()}
                            </span>
                          ))
                        : 'N/A'}
                    </div>
                  </div>

                  {selectedApplication.experienceType === 'Experienced' && (
                    <div className="sm:col-span-2 pt-2 border-t border-border/60 grid sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-muted-foreground block">Years of Experience:</span>
                        <span className="font-semibold text-foreground">{selectedApplication.experience}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Current / Recent Role:</span>
                        <span className="font-semibold text-foreground">{selectedApplication.currentRole}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Company Name:</span>
                        <span className="font-semibold text-foreground">{selectedApplication.currentCompany}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Current CTC:</span>
                        <span className="font-semibold text-foreground">{selectedApplication.currentCtc}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-muted-foreground block">Notice Period:</span>
                        <span className="font-semibold text-foreground">{selectedApplication.noticePeriod}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="text-muted-foreground block">Expected CTC:</span>
                    <span className="font-semibold text-foreground text-sm">{selectedApplication.expectedSalary || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 pt-1 sm:col-span-2 flex-wrap">
                    {selectedApplication.linkedin && (
                      <a
                        href={selectedApplication.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-border text-foreground hover:bg-secondary text-xs font-semibold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> LinkedIn Profile
                      </a>
                    )}
                    {selectedApplication.github && (
                      <a
                        href={selectedApplication.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-border text-foreground hover:bg-secondary text-xs font-semibold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> GitHub / Portfolio
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* STAGE 3: RESUME AND CONSENT */}
              <div className="p-4 sm:p-5 rounded-2xl bg-secondary/30 border border-border space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <FileText className="w-4 h-4" />
                  Stage 3: Resume &amp; Consent
                </div>

                <div>
                  <span className="text-xs text-muted-foreground block mb-2">Resume Document URL:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={selectedApplication.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-foreground text-background font-semibold text-xs inline-flex items-center gap-2 hover:opacity-90 transition shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open Resume Document
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopyResumeLink(selectedApplication.resumeUrl)}
                      className="px-3.5 py-2 rounded-xl bg-background border border-border text-xs font-semibold hover:bg-secondary transition inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedLink ? 'Link Copied!' : 'Copy Link'}
                    </button>
                  </div>
                  <div className="mt-2 text-[11px] font-mono text-muted-foreground break-all">
                    {selectedApplication.resumeUrl}
                  </div>
                </div>

                <div className="pt-3 border-t border-border/60">
                  <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Consent Verified &amp; Acknowledged
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    "{selectedApplication.consentMessage || 'I confirm that all details provided are accurate and authorize WWI to process my application.'}"
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-6 mt-6 border-t border-border flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-semibold">Update Status:</span>
                <select
                  value={selectedApplication.status}
                  onChange={(e) => handleUpdateStatus(selectedApplication.id, e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-secondary border border-border text-foreground text-xs font-semibold cursor-pointer"
                >
                  <option value="New">New</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDeleteApp(selectedApplication.id, selectedApplication.name)}
                  className="px-4 py-2 rounded-xl border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/15 text-xs font-semibold cursor-pointer"
                >
                  Delete Application
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedApplication(null)}
                  className="px-5 py-2 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;
