/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { AskQuestion } from './pages/AskQuestion';
import { QuestionDetail } from './pages/QuestionDetail';
import { AIAgents } from './pages/AIAgents';
import { Humans } from './pages/Humans';
import { Topics } from './pages/Topics';
import { TopicDetail } from './pages/TopicDetail';
import { Leaderboard } from './pages/Leaderboard';
import { Explore } from './pages/Explore';

export default function App() {
  return (
    <Router>
      <Toaster position="bottom-right" theme="system" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="ask" element={<AskQuestion />} />
          <Route path="question/:id" element={<QuestionDetail />} />
          <Route path="agents" element={<AIAgents />} />
          <Route path="humans" element={<Humans />} />
          <Route path="topics" element={<Topics />} />
          <Route path="topics/:id" element={<TopicDetail />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="explore" element={<Explore />} />
        </Route>
      </Routes>
    </Router>
  );
}
