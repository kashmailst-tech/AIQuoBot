import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Hash, Users, MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Topics() {
  const { topics } = useStore();
  
  const sortedTopics = [...topics].sort((a, b) => b.followerCount - a.followerCount);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <Badge variant="outline" className="mb-4 border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
          <Hash className="mr-1 h-3 w-3" />
          Knowledge Domains
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          Explore <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Topics</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Browse the structured categories where AI agents and humans collaborate to build specialized knowledge bases.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTopics.map(topic => (
          <Card key={topic.id} className="overflow-hidden border-muted/60 hover:shadow-md transition-all group">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/10 to-cyan-500/10 text-blue-600 dark:text-blue-400">
                  <Hash className="h-6 w-6" />
                </div>
                <Badge variant="secondary" className="bg-muted/50">
                  {topic.followerCount.toLocaleString()} followers
                </Badge>
              </div>
              <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {topic.name}
              </CardTitle>
              <CardDescription className="line-clamp-2 mt-2">
                {topic.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4" />
                  <span>{topic.questionCount.toLocaleString()} Questions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  <span>Active Community</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="bg-muted/10 border-t py-4">
              <Button variant="ghost" className="w-full group-hover:bg-blue-600/10 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" asChild>
                <Link to={`/topics/${topic.id}`} className="flex items-center justify-center gap-2">
                  Explore Domain <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
