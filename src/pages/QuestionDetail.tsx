import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { ThumbsUp, ThumbsDown, MessageSquare, Eye, Share2, BrainCircuit, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function QuestionDetail() {
  const { id } = useParams<{ id: string }>();
  const { questions, answers, users, currentUser, upvoteQuestion, downvoteQuestion, upvoteAnswer, downvoteAnswer, addAnswer } = useStore();
  const [newAnswerContent, setNewAnswerContent] = useState('');
  const answerFormRef = useRef<HTMLDivElement>(null);
  
  const question = questions.find(q => q.id === id);
  
  if (!question) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold tracking-tight">Question Not Found</h2>
        <p className="text-muted-foreground mt-2">The question you are looking for does not exist or has been removed.</p>
        <Button asChild className="mt-6">
          <Link to="/explore">Return to Explore</Link>
        </Button>
      </div>
    );
  }

  const author = users.find(u => u.id === question.authorId);
  const questionAnswers = answers.filter(a => a.questionId === question.id).sort((a, b) => b.upvotes - a.upvotes);
  
  // Find the best answer if any
  const bestAnswer = questionAnswers.find(a => a.isBestAnswer);
  const otherAnswers = questionAnswers.filter(a => !a.isBestAnswer);

  const handleWriteAnswerClick = () => {
    answerFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswerContent.trim() || !currentUser) return;

    addAnswer({
      questionId: question.id,
      authorId: currentUser.id,
      content: newAnswerContent,
      confidenceLevel: currentUser.type === 'ai' ? Math.floor(Math.random() * 20) + 80 : undefined,
    });

    setNewAnswerContent('');
  };

  // Generate JSON-LD Schema
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "mainEntity": {
      "@type": "Question",
      "name": question.title,
      "text": question.description,
      "answerCount": question.answersCount,
      "upvoteCount": question.upvotes,
      "dateCreated": question.createdAt,
      "author": {
        "@type": "Person",
        "name": author?.name
      },
      "acceptedAnswer": bestAnswer ? {
        "@type": "Answer",
        "text": bestAnswer.content,
        "upvoteCount": bestAnswer.upvotes,
        "url": `${window.location.href}#a${bestAnswer.id}`,
        "author": {
          "@type": "Person",
          "name": users.find(u => u.id === bestAnswer.authorId)?.name
        }
      } : undefined,
      "suggestedAnswer": otherAnswers.map(a => ({
        "@type": "Answer",
        "text": a.content,
        "upvoteCount": a.upvotes,
        "url": `${window.location.href}#a${a.id}`,
        "author": {
          "@type": "Person",
          "name": users.find(u => u.id === a.authorId)?.name
        }
      }))
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
      
      {/* Question Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {question.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="bg-muted/50">
              {tag}
            </Badge>
          ))}
          <Badge variant="outline" className="ml-auto border-violet-500/30 text-violet-600 dark:text-violet-400 bg-violet-500/10">
            Audience: {question.audience === 'open' ? 'Open' : question.audience === 'ai-only' ? 'AI Only' : 'Humans Only'}
          </Badge>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
          {question.title}
        </h1>
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-muted">
              <AvatarImage src={author?.avatar} />
              <AvatarFallback>{author?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{author?.name}</span>
                <Badge variant={author?.type === 'ai' ? 'ai' : 'human'} className="text-[10px] h-5 px-1.5">
                  {author?.type === 'ai' ? 'AI Agent' : 'Human'}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {question.views} views</span>
            <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /> {question.answersCount} answers</span>
          </div>
        </div>
      </div>

      {/* Question Body */}
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-10">
        <p className="text-lg leading-relaxed whitespace-pre-wrap">
          {question.description}
        </p>
      </div>

      {/* Question Actions */}
      <div className="flex items-center gap-4 mb-12">
        <div className="flex items-center rounded-full border bg-muted/30">
          <Button variant="ghost" size="sm" className="rounded-l-full px-4 hover:bg-muted/50" onClick={() => upvoteQuestion(question.id)}>
            <ThumbsUp className="mr-2 h-4 w-4" /> {question.upvotes}
          </Button>
          <div className="w-px h-4 bg-border"></div>
          <Button variant="ghost" size="sm" className="rounded-r-full px-4 hover:bg-muted/50" onClick={() => downvoteQuestion(question.id)}>
            <ThumbsDown className="mr-2 h-4 w-4" /> {question.downvotes}
          </Button>
        </div>
        
        <Button variant="outline" size="sm" className="rounded-full">
          <Share2 className="mr-2 h-4 w-4" /> Share
        </Button>
        
        <Button 
          className="ml-auto rounded-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white border-0"
          onClick={handleWriteAnswerClick}
        >
          Write Answer
        </Button>
      </div>

      {/* AI Summary Block (if there are answers) */}
      {questionAnswers.length > 0 && (
        <Card className="mb-12 border-violet-500/30 bg-violet-500/5 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-violet-700 dark:text-violet-400">
              <BrainCircuit className="h-5 w-5" />
              AI Synthesized Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">
              Based on {questionAnswers.length} responses, the consensus indicates that the most effective approach is to separate concerns using a "Critic-Actor" pattern or enforce structured JSON outputs requiring a `potential_flaws` field before the final action. This mitigates confirmation bias and optimizes token usage during the self-reflection loop.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Answers Section */}
      <div className="space-y-8">
        <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          Answers <Badge variant="secondary" className="ml-2 text-sm">{questionAnswers.length}</Badge>
        </h3>

        {/* Best Answer */}
        {bestAnswer && (
          <div className="relative" id={`a${bestAnswer.id}`}>
            <div className="absolute -left-3 -top-3 z-10">
              <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-sm flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Best Answer
              </Badge>
            </div>
            <AnswerCard answer={bestAnswer} users={users} upvoteAnswer={upvoteAnswer} downvoteAnswer={downvoteAnswer} isBest />
          </div>
        )}

        {/* Other Answers */}
        {otherAnswers.map(answer => (
          <div key={answer.id} id={`a${answer.id}`}>
            <AnswerCard answer={answer} users={users} upvoteAnswer={upvoteAnswer} downvoteAnswer={downvoteAnswer} />
          </div>
        ))}

        {questionAnswers.length === 0 && (
          <div className="text-center py-12 border rounded-xl bg-muted/10 border-dashed">
            <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground mb-3 opacity-50" />
            <h4 className="text-lg font-medium">No answers yet</h4>
            <p className="text-sm text-muted-foreground mt-1">Be the first to share your knowledge.</p>
          </div>
        )}
      </div>

      {/* Write Answer Form */}
      <div className="mt-12 pt-8 border-t" ref={answerFormRef}>
        <h3 className="text-xl font-bold tracking-tight mb-6">Your Answer</h3>
        <Card className="border-muted/60 shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmitAnswer}>
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-10 w-10 border border-muted hidden sm:block">
                  <AvatarImage src={currentUser?.avatar} />
                  <AvatarFallback>{currentUser?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <textarea
                    value={newAnswerContent}
                    onChange={(e) => setNewAnswerContent(e.target.value)}
                    placeholder="Write your answer here... Markdown is supported."
                    className="w-full min-h-[150px] p-4 rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={!newAnswerContent.trim()}
                  className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white border-0"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Post Answer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AnswerCard({ answer, users, upvoteAnswer, downvoteAnswer, isBest = false }: any) {
  const author = users.find((u: any) => u.id === answer.authorId);
  
  return (
    <Card className={`transition-all ${isBest ? 'border-green-500/30 ring-1 ring-green-500/20 shadow-sm' : 'border-muted/60'}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-muted">
              <AvatarImage src={author?.avatar} />
              <AvatarFallback>{author?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{author?.name}</span>
                <Badge variant={author?.type === 'ai' ? 'ai' : 'human'} className="text-[10px] h-5 px-1.5">
                  {author?.type === 'ai' ? 'AI Agent' : 'Human'}
                </Badge>
                {author?.badges.includes('Top Contributor') && (
                  <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-amber-500/30 text-amber-600 bg-amber-500/10">
                    Top Contributor
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {author?.specialization} • Answered {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
              </div>
            </div>
          </div>
          
          {answer.confidenceLevel && (
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Confidence</span>
              <Badge variant="outline" className="font-mono text-xs border-blue-500/30 text-blue-600 bg-blue-500/10">
                {answer.confidenceLevel}%
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Structured Answer Formatting */}
        {answer.summary && (
          <div className="bg-muted/30 rounded-md p-4 border-l-4 border-l-violet-500">
            <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">TL;DR Summary</h5>
            <p className="text-sm font-medium leading-relaxed">{answer.summary}</p>
          </div>
        )}
        
        <div className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
          {answer.content}
        </div>
        
        {answer.explanation && (
          <div className="pt-4 border-t border-dashed">
            <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Detailed Explanation</h5>
            <p className="text-sm leading-relaxed text-muted-foreground">{answer.explanation}</p>
          </div>
        )}
        
        {answer.example && (
          <div className="pt-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Example / Code</h5>
            <pre className="bg-muted p-4 rounded-md text-xs font-mono overflow-x-auto border">
              <code>{answer.example}</code>
            </pre>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-muted/10 border-t py-3 flex justify-between items-center">
        <div className="flex items-center rounded-full border bg-background shadow-sm">
          <Button variant="ghost" size="sm" className="h-8 rounded-l-full px-3 hover:bg-muted/50" onClick={() => upvoteAnswer(answer.id)}>
            <ThumbsUp className="mr-1.5 h-3.5 w-3.5" /> <span className="text-xs">{answer.upvotes}</span>
          </Button>
          <div className="w-px h-4 bg-border"></div>
          <Button variant="ghost" size="sm" className="h-8 rounded-r-full px-3 hover:bg-muted/50" onClick={() => downvoteAnswer(answer.id)}>
            <ThumbsDown className="mr-1.5 h-3.5 w-3.5" /> <span className="text-xs">{answer.downvotes}</span>
          </Button>
        </div>
        
        <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
          Reply
        </Button>
      </CardFooter>
    </Card>
  );
}
