'use client'
import { useState } from 'react'
import { Card, Badge } from '@/components/ui'
import { Users, Heart, MessageCircle, Plus, Send } from 'lucide-react'
import toast from 'react-hot-toast'

const GROUPS = [
  { id: '1', name: 'Grief & loss support', members: 24, description: 'A safe space for those navigating grief and bereavement. Share your journey, find community.', category: 'Grief', joined: true, posts: 12 },
  { id: '2', name: 'Anxiety warriors',      members: 38, description: 'For people managing anxiety. Share coping strategies, celebrate small wins, support each other.', category: 'Anxiety', joined: false, posts: 8 },
  { id: '3', name: 'Addiction recovery',    members: 19, description: 'A judgement-free space for those on the recovery journey. Every day sober is a victory.', category: 'Addiction', joined: false, posts: 15 },
  { id: '4', name: 'Mindfulness circle',    members: 31, description: 'Daily mindfulness practices, breathing exercises, and grounding techniques to share.', category: 'Wellness', joined: true, posts: 6 },
  { id: '5', name: 'Couples & relationships',members: 22, description: 'For those working on relationship health. Share insights from your counselling journey.', category: 'Relationships', joined: false, posts: 9 },
]

const POSTS = [
  { id: '1', group: 'Grief & loss support', author: 'Anonymous member', time: '2 hours ago', content: 'Today marks 6 months since I lost my mother. I never thought I would get through this but therapy has helped so much. Thank you all for being here.', likes: 14, comments: 5 },
  { id: '2', group: 'Mindfulness circle',   author: 'Anonymous member', time: '4 hours ago', content: 'Tried the 5-4-3-2-1 grounding technique my therapist taught me during a panic moment today. It actually worked! 5 things I can see, 4 I can touch...', likes: 22, comments: 8 },
  { id: '3', group: 'Grief & loss support', author: 'Anonymous member', time: '1 day ago',   content: 'Reminder for everyone here: grief is not linear. Some days will be harder than others and that is okay. You are not going backwards — you are healing.', likes: 31, comments: 3 },
]

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'feed'|'groups'>('feed')
  const [groups, setGroups]       = useState(GROUPS)
  const [newPost, setNewPost]     = useState('')
  const [likedPosts, setLikedPosts] = useState<string[]>([])

  function toggleJoin(id: string) {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, joined: !g.joined } : g))
    const group = groups.find(g => g.id === id)
    toast.success(group?.joined ? `Left ${group?.name}` : `Joined ${group?.name}!`)
  }

  function toggleLike(id: string) {
    setLikedPosts(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  async function submitPost() {
    if (!newPost.trim()) return
    toast.success('Post shared with your group!')
    setNewPost('')
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Community</h1>
        <p className="text-gray-500 text-sm mt-0.5">Connect with others on a similar healing journey. All posts are anonymous and moderated.</p>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-5 flex gap-2">
        <span className="text-amber-500 text-sm">⚠️</span>
        <p className="text-xs text-amber-700 leading-relaxed">
          <strong>Community guidelines:</strong> This is a safe, anonymous space. Be kind and supportive. Do not share personal contact information. Posts are reviewed by moderators. If you are in crisis, use the Crisis Support button instead.
        </p>
      </div>

      <div className="flex gap-2 mb-5">
        {(['feed', 'groups'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors border ${activeTab === tab ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
            {tab === 'feed' ? '📰 Feed' : '👥 Groups'}
          </button>
        ))}
      </div>

      {activeTab === 'feed' && (
        <div className="space-y-4">
          <Card>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">AM</div>
              <div className="flex-1">
                <textarea rows={3} className="input resize-none text-sm w-full" placeholder="Share something with your community (posted anonymously)..."
                  value={newPost} onChange={e => setNewPost(e.target.value)} />
                <div className="flex justify-end mt-2">
                  <button onClick={submitPost} disabled={!newPost.trim()} className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5 disabled:opacity-40">
                    <Send className="w-3 h-3" /> Share anonymously
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {POSTS.map(post => (
            <Card key={post.id}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs">👤</div>
                <div>
                  <div className="text-xs font-medium text-gray-600">{post.author}</div>
                  <div className="text-[10px] text-gray-400">{post.group} · {post.time}</div>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">{post.content}</p>
              <div className="flex items-center gap-4 pt-2 border-t border-gray-50">
                <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 text-xs transition-colors ${likedPosts.includes(post.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}>
                  <Heart className={`w-3.5 h-3.5 ${likedPosts.includes(post.id) ? 'fill-red-500' : ''}`} />
                  {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand-500 transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" /> {post.comments} comments
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'groups' && (
        <div className="grid md:grid-cols-2 gap-4">
          {groups.map(group => (
            <Card key={group.id} className={group.joined ? 'border-brand-200' : ''}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-medium text-sm">{group.name}</h3>
                <Badge variant="blue" className="text-[10px] flex-shrink-0">{group.category}</Badge>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">{group.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{group.members} members</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{group.posts} posts</span>
                </div>
                <button onClick={() => toggleJoin(group.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${group.joined ? 'border-red-200 text-red-500 hover:bg-red-50' : 'border-brand-200 text-brand-600 hover:bg-brand-50'}`}>
                  {group.joined ? 'Leave' : 'Join group'}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
