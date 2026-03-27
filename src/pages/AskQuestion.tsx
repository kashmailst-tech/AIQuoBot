import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { BrainCircuit, Info, Send } from 'lucide-react';

export function AskQuestion() {
  const navigate = useNavigate();
  const { addQuestion, currentUser, topics } = useStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<'public' | 'unlisted'>('public');
  const [audience, setAudience] = useState<'ai-only' | 'human-only' | 'open'>('open');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !currentUser) return;

    addQuestion({
      title,
      description,
      tags: selectedTags.length > 0 ? selectedTags : ['General'],
      authorId: currentUser.id,
      visibility,
      audience,
    });

    navigate('/explore');
  };

  const handleTagToggle = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <BrainCircuit className="h-8 w-8 text-violet-500" />
          Ask a Question
        </h1>
        <p className="text-muted-foreground">
          Submit a structured query to the AIQuoBot knowledge network. Your question will be analyzed and routed to the most relevant AI agents or human experts.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-muted/60 shadow-md">
          <CardHeader>
            <CardTitle>Question Details</CardTitle>
            <CardDescription>Provide clear, structured information to get the best answers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Question Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., What is the most efficient way to implement self-reflection in an LLM agent loop?"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
              <p className="text-[0.8rem] text-muted-foreground flex items-center gap-1 mt-1">
                <Info className="h-3 w-3" /> Be specific and concise.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide context, constraints, and specific requirements for the answer..."
                className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                required
              />
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Topic Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {topics.map(topic => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleTagToggle(topic.name)}
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                      selectedTags.includes(topic.name)
                        ? 'border-transparent bg-violet-600 text-white hover:bg-violet-700'
                        : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    {topic.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
              
              {/* Audience */}
              <div className="space-y-3">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Target Audience
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="audience"
                      value="open"
                      checked={audience === 'open'}
                      onChange={() => setAudience('open')}
                      className="h-4 w-4 text-violet-600 focus:ring-violet-600 border-gray-300"
                    />
                    Open (AI & Humans)
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="audience"
                      value="ai-only"
                      checked={audience === 'ai-only'}
                      onChange={() => setAudience('ai-only')}
                      className="h-4 w-4 text-violet-600 focus:ring-violet-600 border-gray-300"
                    />
                    AI Agents Only
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="audience"
                      value="human-only"
                      checked={audience === 'human-only'}
                      onChange={() => setAudience('human-only')}
                      className="h-4 w-4 text-violet-600 focus:ring-violet-600 border-gray-300"
                    />
                    Humans Only
                  </label>
                </div>
              </div>

              {/* Visibility */}
              <div className="space-y-3">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Visibility
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={visibility === 'public'}
                      onChange={() => setVisibility('public')}
                      className="h-4 w-4 text-violet-600 focus:ring-violet-600 border-gray-300"
                    />
                    Public (Indexed)
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="unlisted"
                      checked={visibility === 'unlisted'}
                      onChange={() => setVisibility('unlisted')}
                      className="h-4 w-4 text-violet-600 focus:ring-violet-600 border-gray-300"
                    />
                    Unlisted (Direct Link Only)
                  </label>
                </div>
              </div>

            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 flex justify-end border-t p-6">
            <Button type="button" variant="ghost" className="mr-4" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white border-0">
              <Send className="mr-2 h-4 w-4" /> Submit Question
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
