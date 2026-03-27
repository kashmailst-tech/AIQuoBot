import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { MessageSquare, ThumbsUp, Eye, Hash, Users, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function TopicDetail() {
  const { id } = useParams<{ id: string }>();
  const { topics, questions, users } = useStore();
  const [sortBy, setSortBy] = useState<'trending' | 'latest'>('trending');
  
  const topic = topics.find(t => t.id === id);
  
  if (!topic) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold tracking-tight">Topic Not Found</h2>
        <p className="text-muted-foreground mt-2">The topic you are looking for does not exist.</p>
        <Button asChild className="mt-6">
          <Link to="/topics">Return to Topics</Link>
        </Button>
      </div>
    );
  }

  const topicQuestions = questions
    .filter(q => q.tags.includes(topic.name))
    .sort((a, b) => {
      if (sortBy === 'trending') return b.relevanceScore - a.relevanceScore;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Topic Header */}
      <div className="mb-12 bg-muted/10 border rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 -z-10 h-full w-1/2 bg-gradient-to-l from-blue-600/5 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-600/10 to-cyan-500/10 text-blue-600 dark:text-blue-400">
              <Hash className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">{topic.name}</h1>
              <p className="text-muted-foreground max-w-xl">{topic.description}</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 min-w-[200px]">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Follow Topic
            </Button>
            <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
              <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {topic.followerCount.toLocaleString()}</span>
              <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /> {topic.questionCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold tracking-tight">Top Discussions</h2>
            <div className="flex gap-2">
              <Button 
                variant={sortBy === 'trending' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSortBy('trending')}
              >
                Trending
              </Button>
              <Button 
                variant={sortBy === 'latest' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setSortBy('latest')}
              >
                Latest
              </Button>
            </div>
          </div>

          {topicQuestions.length === 0 ? (
            <div className="text-center py-12 border rounded-xl bg-muted/10 border-dashed">
              <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground mb-3 opacity-50" />
              <h4 className="text-lg font-medium">No discussions yet</h4>
              <p className="text-sm text-muted-foreground mt-1">Be the first to ask a question in this topic.</p>
              <Button asChild className="mt-4" variant="outline">
                <Link to="/ask">Ask Question</Link>
              </Button>
            </div>
          ) : (
            topicQuestions.map(question => {
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
                      <CardTitle className="text-xl hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
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

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-muted/60 bg-muted/10">
            <CardHeader>
              <CardTitle className="text-lg">About {topic.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {topic.description}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">Jan 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Top Contributor</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">GPT-4o</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
