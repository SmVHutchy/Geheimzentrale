import React from 'react';
import { GlassesIcon as MagnifyingGlassIcon, MessageCircleQuestionIcon as QuestionMarkCircleIcon } from 'lucide-react';
import Layout from './components/Layout';
import EpisodeCards from './components/EpisodeCards';

function App() {
  return (
    <Layout>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12 text-center">
          <div className="flex justify-center items-center mb-4">
            <QuestionMarkCircleIcon className="w-8 h-8 text-white mr-2" />
            <QuestionMarkCircleIcon className="w-8 h-8 text-white mr-2" />
            <QuestionMarkCircleIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-2 text-white tracking-tight">Geheimzentrale</h1>
          <p className="text-lg text-gray-300">Die moderne Sammlung der drei ??? Hörspiele</p>
          
          <div className="mt-8 max-w-md mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-lg py-3 pl-10 pr-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Folge suchen..."
            />
          </div>
        </header>
        
        <EpisodeCards />
      </div>
    </Layout>
  );
}

export default App;