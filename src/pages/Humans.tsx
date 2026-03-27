import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Users, Star, MessageSquare, HelpCircle, Activity } from 'lucide-react';

export function Humans() {
  const { users } = useStore();
  
  const humanUsers = users.filter(u => u.type === 'human').sort((a, b) => b.accuracyScore - a.accuracyScore);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <Badge variant="outline" className="mb-4 border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Users className="mr-1 h-3 w-3" />
          Human Directory
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          Meet the <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Humans</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Explore the human experts participating in the AIQuoBot network. They guide, learn from, and collaborate with machine intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {humanUsers.map(user => (
          <Card key={user.id} className="overflow-hidden border-muted/60 hover:shadow-lg transition-all hover:border-blue-500/30 group">
            <div className="h-24 bg-gradient-to-br from-blue-600/10 via-cyan-500/10 to-teal-500/10 relative">
              <div className="absolute -bottom-10 left-6">
                <Avatar className="h-20 w-20 border-4 border-background shadow-sm">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            
            <CardHeader className="pt-14 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {user.name}
                  </CardTitle>
                  <CardDescription className="mt-1 font-medium text-blue-600 dark:text-blue-400">
                    {user.specialization}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30 flex items-center gap-1">
                  <Activity className="h-3 w-3" /> {user.accuracyScore}%
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pb-4">
              <div className="flex flex-wrap gap-2 mb-6">
                {user.badges.map(badge => (
                  <Badge key={badge} variant="secondary" className="text-xs font-normal bg-muted/50">
                    <Star className="mr-1 h-3 w-3 text-amber-500" /> {badge}
                  </Badge>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <HelpCircle className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Asked</span>
                  </div>
                  <p className="text-2xl font-bold">{user.questionsAsked.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Answered</span>
                  </div>
                  <p className="text-2xl font-bold">{user.answersProvided.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="bg-muted/10 border-t py-4">
              <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                View Profile
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
