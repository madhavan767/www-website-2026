import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  RotateCcw, 
  Sparkles, 
  Phone, 
  Mail, 
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { getSubdomainUrl } from '../../utils/subdomains';

const BOT_KNOWLEDGE = [
  {
    triggers: ['web', 'website', 'frontend', 'react', 'next', 'html', 'fullstack'],
    reply: "Work Wizards Innovations engineers high-performance web applications using modern stacks like React, Vite, Next.js, Tailwind CSS, and Node.js. We specialize in custom web apps, SaaS platforms, corporate portals, and dynamic API integrations.",
    links: [{ label: "Visit Web Development Subdomain", url: getSubdomainUrl('web', '/') }]
  },
  {
    triggers: ['android', 'app', 'mobile', 'ios', 'flutter', 'kotlin', 'react native'],
    reply: "We build intuitive, scalable native Android and cross-platform mobile applications using Kotlin, Flutter, and React Native. From UX architecture to Google Play Store submission and post-launch maintenance, we handle the full lifecycle.",
    links: [{ label: "Visit Android Development Subdomain", url: getSubdomainUrl('android', '/') }]
  },
  {
    triggers: ['maintenance', 'amc', 'support', 'uptime', 'sla', 'bug', 'down', 'server'],
    reply: "Our Website Maintenance & Technical Support services offer 24/7 uptime monitoring, critical security patching, performance audits, bug fixes, and guaranteed response SLAs. We ensure zero downtime for mission-critical client infrastructure.",
    links: [{ label: "Visit Maintenance Subdomain", url: getSubdomainUrl('maintenance', '/') }]
  },
  {
    triggers: ['social', 'marketing', 'socialsphere', 'branding', 'seo', 'instagram', 'influencer'],
    reply: "The SocialSphere by WWI provides full-service digital marketing, brand strategy, content creation, social media growth, and influencer campaigns designed to elevate your company's online authority.",
    links: [{ label: "Visit SocialSphere Subdomain", url: getSubdomainUrl('socialsphere', '/') }]
  },
  {
    triggers: ['job', 'career', 'hiring', 'intern', 'apply', 'interview', 'opening', 'vacancy'],
    reply: "We are currently hiring talented engineers and builders! Open roles include Senior Full-Stack Engineer and Frontend React Developer, alongside student developer internships. You can view full job descriptions and apply directly online.",
    links: [{ label: "Visit Careers Subdomain", url: getSubdomainUrl('careers', '/') }]
  },
  {
    triggers: ['event', 'hackathon', 'promptwars', 'kiet', 'hack2skill', 'google'],
    reply: "WWI actively hosts and co-organizes premier hackathons like Promptwars (organized in collaboration with Google for Developers, Hack2skill, and KIET Group). We brought together 700+ student innovators and awarded ₹53,000 in cash prizes.",
    links: [{ label: "Visit Events Subdomain", url: getSubdomainUrl('events', '/') }]
  },
  {
    triggers: ['community', 'student', 'campus', 'discord', 'club', 'mentor'],
    reply: "The WWI Community unites over 1,500+ student innovators, campus tech clubs, and developer mentors across India. We offer workshops, open-source initiatives, campus ambassador programs, and technical masterclasses.",
    links: [{ label: "Visit Community Subdomain", url: getSubdomainUrl('community', '/') }]
  },
  {
    triggers: ['contact', 'phone', 'call', 'email', 'reach', 'address', 'director', 'venkat', 'location'],
    reply: "You can reach Work Wizards Innovations directly at:\n• Direct Helpline: +91 96181 31779\n• Official Email: official@wwi.org.in\n• Office: Yanam / Kakinada, Andhra Pradesh, India.\nOur team is available Mon-Sat, 9:00 AM - 8:00 PM IST.",
    links: [{ label: "Contact Us Page", url: getSubdomainUrl('contact', '/') }]
  },
  {
    triggers: ['price', 'quote', 'cost', 'charge', 'rate', 'hire'],
    reply: "Our pricing is transparent and tailored to your project scope—ranging from fixed-price milestone delivery to dedicated engineering retainers and monthly maintenance plans. Contact our team with your specifications for a custom quotation.",
    links: [{ label: "Request a Proposal", url: getSubdomainUrl('contact', '/') }]
  }
];

const SUGGESTIONS = [
  "Web Development Services",
  "Android & Mobile Apps",
  "Maintenance & Support SLAs",
  "Careers & Open Roles",
  "Events & Promptwars",
  "Speak With an Engineer"
];

export function SupportChatbot() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello! I am the WWI Intelligent Support Assistant. How can I help you today? You can ask about our Web Development, Android Apps, Maintenance plans, Careers, or Event partnerships.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      links: []
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // AI Knowledge matching
    setTimeout(() => {
      const lower = query.toLowerCase();
      let matched = null;

      for (const item of BOT_KNOWLEDGE) {
        if (item.triggers.some((t) => lower.includes(t))) {
          matched = item;
          break;
        }
      }

      let replyText = "";
      let links = [];

      if (matched) {
        replyText = matched.reply;
        links = matched.links || [];
      } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        replyText = "Hello! Great to connect with you. What can I assist you with today? Feel free to ask about our software engineering services, project quotes, or support tickets.";
      } else if (lower.includes('thank')) {
        replyText = "You're very welcome! If you have any further questions or require emergency technical assistance, our engineers are always here to help.";
      } else {
        replyText = `Thank you for reaching out. For your specific inquiry regarding "${query}", our dedicated engineering team would be happy to discuss details with you directly.\n\nYou can also contact us immediately via phone at +91 96181 31779 or email official@wwi.org.in.`;
        links = [
          { label: "Direct Email Support", url: "mailto:official@wwi.org.in" },
          { label: "Schedule a Discussion", url: getSubdomainUrl('contact', '/') }
        ];
      }

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        links
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: "Chat history cleared. How can I assist you with Work Wizards Innovations today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        links: []
      }
    ]);
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-3xl border border-border bg-card shadow-xl overflow-hidden flex flex-col h-[640px]">
      {/* Chatbot Header */}
      <div className="px-6 py-4 border-b border-border bg-surface flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-foreground text-background grid place-items-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-background" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground text-sm sm:text-base">
                WWI Support Assistant
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                Online
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Intelligent Technical &amp; Customer Helpdesk
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            title="Reset Conversation"
            className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition text-xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="px-6 py-2.5 bg-secondary/40 border-b border-border/60 overflow-x-auto no-scrollbar flex items-center gap-2 text-xs">
        <span className="text-muted-foreground shrink-0 font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-foreground" /> Quick Ask:
        </span>
        {SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(s)}
            className="shrink-0 px-3 py-1 rounded-full bg-background border border-border hover:border-foreground/40 text-foreground transition text-xs font-medium"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl grid place-items-center shrink-0 text-xs ${
                msg.sender === 'user'
                  ? 'bg-foreground text-background'
                  : 'bg-secondary text-foreground border border-border'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-foreground text-background rounded-tr-xs shadow-xs'
                  : 'bg-card border border-border text-foreground rounded-tl-xs shadow-xs'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {msg.links && msg.links.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/80 flex flex-wrap gap-2">
                  {msg.links.map((lnk, lIdx) => (
                    <a
                      key={lIdx}
                      href={lnk.url}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-secondary hover:bg-secondary/80 text-foreground border border-border transition"
                    >
                      {lnk.label}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              )}

              <span
                className={`block text-[10px] mt-1 text-right ${
                  msg.sender === 'user' ? 'text-background/70' : 'text-muted-foreground'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-secondary text-foreground border border-border grid place-items-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="rounded-2xl rounded-tl-xs bg-card border border-border px-4 py-3 text-muted-foreground text-xs flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-foreground/40 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-foreground/60 animate-pulse delay-100" />
              <span className="w-2 h-2 rounded-full bg-foreground/80 animate-pulse delay-200" />
              <span className="ml-1 text-[11px]">WWI Assistant is typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 border-t border-border bg-surface flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Web, Android, Maintenance SLAs, Careers, or support..."
          className="flex-1 px-4 py-3 rounded-2xl bg-background border border-border text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          aria-label="Send message"
          className="w-12 h-12 rounded-2xl bg-foreground text-background grid place-items-center hover:opacity-90 disabled:opacity-40 transition shadow-xs cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

export default SupportChatbot;
