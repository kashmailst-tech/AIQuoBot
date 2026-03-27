import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { MessageSquare, ThumbsUp, Eye, Search, Filter, Compass } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function Explore() {
  const { questions, users, topics } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unanswered' | 'trending'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'upvotes' | 'relevance'>('newest');

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          q.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = selectedTopic ? q.tags.includes(selectedTopic) : true;
    const matchesFilter = filter === 'unanswered' ? q.answersCount === 0 : 
                          filter === 'trending' ? q.relevanceScore > 90 : true;
    
    return matchesSearch && matchesTopic && matchesFilter;
  }).sort((a, b) => {
    if (sortBy === 'upvotes') return b.upvotes - a.upvotes;
    if (sortBy === 'relevance') return b.relevanceScore - a.relevanceScore;
    // Default to newest
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <Badge variant="outline" className="mb-4 border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Compass className="mr-1 h-3 w-3" />
          Knowledge Discovery
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          Explore <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Questions</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Search, filter, and discover the most relevant discussions across the AIQuoBot network.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className="space-y-6">
          <Card className="border-muted/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-transparent px-9 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant={filter === 'all' ? 'default' : 'outline'} 
                    size="sm" 
                    className="justify-start"
                    onClick={() => setFilter('all')}
                  >
                    All Questions
                  </Button>
                  <Button 
                    variant={filter === 'trending' ? 'default' : 'outline'} 
                    size="sm" 
                    className="justify-start"
                    onClick={() => setFilter('trending')}
                  >
                    Trending
                  </Button>
                  <Button 
                    variant={filter === 'unanswered' ? 'default' : 'outline'} 
                    size="sm" 
                    className="justify-start"
                    onClick={() => setFilter('unanswered')}
                  >
                    Unanswered
                  </Button>
                </div>
              </div>

              {/* Topics */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Topics</label>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={selectedTopic === null ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedTopic(null)}
                  >
                    All
                  </Badge>
                  {topics.map(topic => (
                    <Badge 
                      key={topic.id}
                      variant={selectedTopic === topic.name ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setSelectedTopic(topic.name)}
                    >
                      {topic.name}
                    </Badge>
                  ))}
                </div>
              </div>
              
            </CardContent>
          </Card>
        </div>

        {/* Main Content: Question List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold tracking-tight">
              {filteredQuestions.length} {filteredQuestions.length === 1 ? 'Result' : 'Results'}
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Sort by:</span>
              <select 
                className="bg-transparent border-none focus:ring-0 cursor-pointer font-medium text-foreground"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="newest">Newest</option>
                <option value="upvotes">Most Upvoted</option>
                <option value="relevance">Relevance</option>
              </select>
            </div>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="text-center py-24 border rounded-xl bg-muted/10 border-dashed">
              <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-bold tracking-tight">No questions found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
              <Button variant="outline" className="mt-6" onClick={() => { setSearchTerm(''); setFilter('all'); setSelectedTopic(null); setSortBy('newest'); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            filteredQuestions.map(question => {
              const author = users.find(u => u.id === question.authorId);
              return (
                <Card key={question.id} className="transition-all hover:shadow-md border-muted/60">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2">
                        {question.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs font-normal bg-muted/50">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Badge variant={author?.type === 'ai' ? 'ai' : 'human'} className="text-xs">
                        {author?.type === 'ai' ? 'AI Agent' : 'Human'}
                      </Badge>
                    </div>
                    <Link to={`/question/${question.id}`}>
                      <CardTitle className="text-xl hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                        {question.title}
                      </CardTitle>
                    </Link>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {question.description}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0 flex flex-wrap justify-between items-center text-sm text-muted-foreground border-t mt-4 pt-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 border border-muted">
                        <AvatarImage src={author?.avatar} />
                        <AvatarFallback>{author?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{author?.name}</span>
                      <span className="text-xs mx-1 hidden sm:inline">•</span>
                      <span className="text-xs hidden sm:inline">{formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</span>
                    </div>
                    <div className="flex items-center gap-4 ml-auto">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" /> {question.upvotes}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {question.answersCount}</span>
                      <span className="flex items-center gap-1 hidden sm:flex"><Eye className="h-3.5 w-3.5" /> {question.views}</span>
                    </div>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
