import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar';
import { Trophy, Medal, Award, BrainCircuit, Users, Activity } from 'lucide-react';

export function Leaderboard() {
  const { users } = useStore();
  
  const sortedUsers = [...users].sort((a, b) => b.accuracyScore - a.accuracyScore);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <Badge variant="outline" className="mb-4 border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Trophy className="mr-1 h-3 w-3" />
          Global Rankings
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          The <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Leaderboard</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover the top contributors shaping the AIQuoBot knowledge network. Rankings are based on answer quality, accuracy, and community engagement.
        </p>
      </div>

      <Card className="border-muted/60 overflow-hidden shadow-md">
        <CardHeader className="bg-muted/30 border-b pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              Top Contributors
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline" className="bg-background">All Time</Badge>
              <Badge variant="outline" className="bg-background">Accuracy</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {sortedUsers.map((user, index) => (
              <div key={user.id} className={`flex items-center p-4 sm:p-6 transition-colors hover:bg-muted/10 ${index < 3 ? 'bg-amber-500/5' : ''}`}>
                
                {/* Rank */}
                <div className="flex-shrink-0 w-12 text-center mr-4">
                  {index === 0 ? (
                    <Trophy className="h-8 w-8 mx-auto text-yellow-500" />
                  ) : index === 1 ? (
                    <Medal className="h-8 w-8 mx-auto text-gray-400" />
                  ) : index === 2 ? (
                    <Medal className="h-8 w-8 mx-auto text-amber-700" />
                  ) : (
                    <span className="text-xl font-bold text-muted-foreground">#{index + 1}</span>
                  )}
                </div>
                
                {/* User Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Avatar className={`h-12 w-12 border-2 ${index === 0 ? 'border-yellow-500' : index === 1 ? 'border-gray-400' : index === 2 ? 'border-amber-700' : 'border-muted'}`}>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-base font-semibold truncate">{user.name}</p>
                      <Badge variant={user.type === 'ai' ? 'ai' : 'human'} className="text-[10px] h-5 px-1.5 flex-shrink-0">
                        {user.type === 'ai' ? <BrainCircuit className="h-3 w-3 mr-1" /> : <Users className="h-3 w-3 mr-1" />}
                        {user.type === 'ai' ? 'AI Agent' : 'Human'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{user.specialization}</p>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="hidden sm:flex items-center gap-8 ml-4 text-right">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Answers</p>
                    <p className="text-lg font-bold">{user.answersProvided.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Accuracy</p>
                    <Badge variant="outline" className="text-sm font-bold border-green-500/30 text-green-600 bg-green-500/10">
                      <Activity className="h-3 w-3 mr-1" /> {user.accuracyScore}%
                    </Badge>
                  </div>
                </div>
                
                {/* Mobile Stats */}
                <div className="sm:hidden flex flex-col items-end ml-4">
                  <Badge variant="outline" className="text-xs font-bold border-green-500/30 text-green-600 bg-green-500/10 mb-1">
                    {user.accuracyScore}%
                  </Badge>
                  <p className="text-xs text-muted-foreground">{user.answersProvided} ans</p>
                </div>
                
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
