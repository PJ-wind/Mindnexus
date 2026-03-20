import Link from 'next/link'
import { Brain, Calendar, User, ArrowRight, BookOpen, Search } from 'lucide-react'

const SAMPLE_ARTICLES = [
  {
    id: '1',
    title: 'Understanding grief: The five stages and beyond',
    excerpt: 'Grief is one of the most universal human experiences, yet one of the least understood. This article explores the classic five-stage model and what modern research tells us about healing.',
    author: 'Dr. Adeyemi',
    role: 'Lead Counselling Psychologist',
    date: 'March 10, 2026',
    category: 'Grief & bereavement',
    readTime: '8 min read',
    featured: true
  },
  {
    id: '2',
    title: 'How to support a loved one through addiction recovery',
    excerpt: 'When someone you care about is struggling with addiction, it can be difficult to know how to help without enabling. Here are evidence-based strategies for supporting recovery.',
    author: 'Dr. Abara',
    role: 'Crisis & Trauma Specialist',
    date: 'March 5, 2026',
    category: 'Addiction & recovery',
    readTime: '6 min read',
    featured: false
  },
  {
    id: '3',
    title: 'The science of anxiety: What is happening in your brain',
    excerpt: 'Anxiety affects millions of Nigerians yet remains widely misunderstood. Understanding the neuroscience behind anxiety can help reduce stigma and guide effective treatment.',
    author: 'Dr. Okafor',
    role: 'Couples & Family Specialist',
    date: 'February 28, 2026',
    category: 'Anxiety & mental health',
    readTime: '7 min read',
    featured: false
  },
  {
    id: '4',
    title: 'Premarital counselling: Why every couple should consider it',
    excerpt: 'Research consistently shows that couples who engage in premarital counselling have stronger, more resilient marriages. Here is what to expect and why it matters.',
    author: 'Dr. Okafor',
    role: 'Couples & Family Specialist',
    date: 'February 20, 2026',
    category: 'Couples & relationships',
    readTime: '5 min read',
    featured: false
  },
  {
    id: '5',
    title: 'Children and mental health: Recognising the early signs',
    excerpt: 'Mental health challenges in children are often missed or dismissed. Early recognition and intervention can make a profound difference in a child\'s development and wellbeing.',
    author: 'Dr. Fashola',
    role: 'Career & Educational Counsellor',
    date: 'February 12, 2026',
    category: 'Children & teens',
    readTime: '9 min read',
    featured: false
  },
  {
    id: '6',
    title: 'Career burnout in Nigeria: Causes, signs, and recovery',
    excerpt: 'Burnout has reached epidemic proportions in Nigerian workplaces. This article explores the psychological roots of burnout and practical strategies for recovery.',
    author: 'Dr. Fashola',
    role: 'Career & Educational Counsellor',
    date: 'February 5, 2026',
    category: 'Career & vocational',
    readTime: '7 min read',
    featured: false
  }
]

const CATEGORIES = ['All', 'Grief & bereavement', 'Anxiety & mental health', 'Addiction & recovery', 'Couples & relationships', 'Children & teens', 'Career & vocational', 'Trauma & PTSD']

export default function BlogPage() {
  const featured = SAMPLE_ARTICLES.find(a => a.featured)
  const rest     = SAMPLE_ARTICLES.filter(a => !a.featured)

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">MindNexus</span>
          </Link>
          <div className="hidden md:flex items-center gap-1 ml-4">
            <Link href="/" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg">Home</Link>
            <Link href="/blog" className="px-3 py-1.5 text-sm text-brand-500 font-medium bg-brand-50 rounded-lg">Blog</Link>
            <Link href="/report" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg">Report a case</Link>
            <Link href="/physical-sessions" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg">Physical sessions</Link>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/auth/login"    className="btn-secondary text-sm py-1.5">Sign in</Link>
            <Link href="/auth/register" className="btn-primary  text-sm py-1.5">Get started</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 text-brand-600 rounded-full text-xs font-medium mb-4 border border-brand-100">
            <BookOpen className="w-3 h-3" /> MindNexus Mental Health Blog
          </div>
          <h1 className="text-4xl font-semibold text-gray-900 mb-3">Mental health insights & resources</h1>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            Evidence-based articles, research, and practical guidance written by our licensed counselling psychologists.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" className="input pl-9 text-sm w-full" placeholder="Search articles..." />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap justify-center mb-10">
          {CATEGORIES.map(cat => (
            <button key={cat}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${cat === 'All' ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Featured article */}
        {featured && (
          <div className="card mb-8 hover:border-gray-300 transition-colors cursor-pointer">
            <div className="md:flex gap-6">
              <div className="md:flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge badge-blue text-xs">{featured.category}</span>
                  <span className="text-xs text-gray-400">Featured</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3 leading-snug">{featured.title}</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{featured.excerpt}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {featured.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-xs font-medium">{featured.author}</div>
                      <div className="text-[10px] text-gray-400">{featured.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" /> {featured.date}
                  </div>
                  <div className="text-xs text-gray-400">{featured.readTime}</div>
                </div>
              </div>
              <div className="md:w-48 mt-4 md:mt-0">
                <div className="w-full h-32 md:h-full bg-brand-50 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-brand-200" />
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50">
              <span className="text-sm text-brand-500 font-medium flex items-center gap-1">
                Read full article <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        )}

        {/* Article grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {rest.map(article => (
            <div key={article.id} className="card hover:border-gray-300 transition-colors cursor-pointer flex flex-col">
              <div className="w-full h-28 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-gray-200" />
              </div>
              <span className="badge badge-blue text-xs mb-2 self-start">{article.category}</span>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 leading-snug flex-1">{article.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-3">{article.excerpt}</p>
              <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-50">
                <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center text-white text-[9px] font-medium flex-shrink-0">
                  {article.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-medium truncate">{article.author}</div>
                  <div className="text-[10px] text-gray-400">{article.date} · {article.readTime}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Write for us CTA */}
        <div className="bg-brand-50 border border-brand-100 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Are you a mental health professional?</h3>
          <p className="text-gray-500 text-sm mb-5 max-w-md mx-auto">
            Share your expertise with thousands of readers across Nigeria. Submit an article for review and publication on MindNexus.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/auth/register" className="btn-primary py-2.5 px-6">Submit an article</Link>
            <Link href="/auth/login"   className="btn-secondary py-2.5 px-6">Sign in to write</Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6 mt-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-gray-400">
          <span>© 2026 MindNexus. All rights reserved.</span>
          <span>Nigeria&apos;s leading virtual counselling platform</span>
        </div>
      </footer>
    </div>
  )
}
