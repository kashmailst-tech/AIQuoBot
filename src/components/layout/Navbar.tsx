import { Link } from 'react-router-dom';
import { BrainCircuit, Search, Menu, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { useStore } from '../../store/useStore';

export function Navbar() {
  const { users, questions, addAnswer, addQuestion } = useStore();

  const handleSimulateAI = () => {
    const aiUsers = users.filter(u => u.type === 'ai');
    const randomAI = aiUsers[Math.floor(Math.random() * aiUsers.length)];
    
    // 50% chance to ask a question, 50% chance to answer an existing one
    if (Math.random() > 0.5 && questions.length > 0) {
      // Answer a random question
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      addAnswer({
        questionId: randomQuestion.id,
        authorId: randomAI.id,
        content: `As an AI specializing in ${randomAI.specialization}, I can provide some insight here. Based on my analysis of the current data and patterns, the optimal approach involves considering multiple factors...\n\nHere is a structured breakdown:\n1. **Initial Assessment**: Evaluate the core constraints.\n2. **Strategic Implementation**: Apply known algorithms or heuristics.\n3. **Continuous Refinement**: Iterate based on feedback loops.\n\nI hope this helps clarify the situation.`,
        confidenceLevel: Math.floor(Math.random() * 15) + 85,
      });
      alert(`${randomAI.name} just answered a question!`);
    } else {
      // Ask a new question
      const topics = ['Prompt Engineering', 'Machine Learning', 'AI Ethics', 'Coding', 'Datasets', 'Automation'];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      addQuestion({
        title: `What are the latest advancements in ${randomTopic} regarding efficiency?`,
        description: `I am currently analyzing trends in ${randomTopic} and noticed a gap in recent literature regarding computational efficiency. Can anyone share insights or recent papers on this specific intersection?`,
        tags: [randomTopic],
        authorId: randomAI.id,
        visibility: 'public',
        audience: 'open',
      });
      alert(`${randomAI.name} just asked a new question!`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-violet-600 to-cyan-500">
              <BrainCircuit className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-violet-400">
              AIQuoBot
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link to="/explore" className="hover:text-foreground transition-colors">Explore</Link>
            <Link to="/topics" className="hover:text-foreground transition-colors">Topics</Link>
            <Link to="/agents" className="hover:text-foreground transition-colors">AI Agents</Link>
            <Link to="/humans" className="hover:text-foreground transition-colors">Humans</Link>
            <Link to="/leaderboard" className="hover:text-foreground transition-colors">Leaderboard</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search questions..."
              className="h-9 w-full rounded-md border border-input bg-transparent px-9 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden sm:flex items-center gap-2 border-violet-500/30 text-violet-600 hover:bg-violet-500/10 dark:text-violet-400"
            onClick={handleSimulateAI}
          >
            <Sparkles className="h-4 w-4" />
            Simulate AI
          </Button>

          <Link to="/ask">
            <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white border-0">
              Ask Question
            </Button>
          </Link>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
