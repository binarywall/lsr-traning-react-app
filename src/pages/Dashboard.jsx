import React from 'react';
import { Link } from 'react-router-dom';
import { Headphones, Mic, BookOpen, Video, ArrowRight, Trophy, Clock, Target } from 'lucide-react';

const Dashboard = ({ progress }) => {
  const modules = [
    {
      id: 'listening',
      title: 'Listening Practice',
      description: 'Improve your listening comprehension with audio exercises',
      icon: Headphones,
      color: 'blue',
      path: '/listening'
    },
    {
      id: 'speaking',
      title: 'Speaking Practice',
      description: 'Practice pronunciation and speaking fluency',
      icon: Mic,
      color: 'green',
      path: '/speaking'
    },
    {
      id: 'reading',
      title: 'Reading Comprehension',
      description: 'Enhance reading skills with timed exercises',
      icon: BookOpen,
      color: 'orange',
      path: '/reading'
    },
    {
      id: 'mockInterviews',
      title: 'Mock Interviews',
      description: 'Complete interview simulations with feedback',
      icon: Video,
      color: 'purple',
      path: '/mock-interview'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200'
    };
    return colors[color];
  };

  const calculateOverallProgress = () => {
    const totalCompleted = Object.values(progress).reduce((sum, module) => sum + module.completed, 0);
    const totalExercises = Object.values(progress).reduce((sum, module) => sum + module.total, 0);
    return Math.round((totalCompleted / totalExercises) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your LSR Training</h1>
        <p className="text-gray-600 text-lg">Continue your placement interview preparation</p>
      </div>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="text-yellow-500" size={24} />
            <span className="text-2xl font-bold text-gray-900">{calculateOverallProgress()}%</span>
          </div>
          <p className="text-gray-600 text-sm">Overall Progress</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <Clock className="text-blue-500" size={24} />
            <span className="text-2xl font-bold text-gray-900">
              {Object.values(progress).reduce((sum, module) => sum + module.completed, 0)}
            </span>
          </div>
          <p className="text-gray-600 text-sm">Exercises Completed</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <Target className="text-green-500" size={24} />
            <span className="text-2xl font-bold text-gray-900">
              {Math.round(
                Object.values(progress).reduce((sum, module) => sum + module.score, 0) /
                Object.values(progress).length
              )}%
            </span>
          </div>
          <p className="text-gray-600 text-sm">Average Score</p>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Video size={24} />
            <Link
              to="/mock-interview"
              className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm hover:bg-opacity-30 transition-colors"
            >
              Start Now
            </Link>
          </div>
          <p className="text-sm opacity-90">Ready for Mock Interview?</p>
        </div>
      </div>

      {/* Training Modules */}
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
        {modules.map((module) => {
          const Icon = module.icon;
          const moduleProgress = progress[module.id];
          const progressPercentage = Math.round((moduleProgress.completed / moduleProgress.total) * 100);
          
          return (
            <Link
              key={module.id}
              to={module.path}
              className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 ${getColorClasses(module.color)}`}>
                  <Icon size={24} />
                </div>
                <ArrowRight className="text-gray-400 group-hover:text-gray-600 transition-colors" size={20} />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{module.title}</h3>
              <p className="text-gray-600 mb-4">{module.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{moduleProgress.completed}/{moduleProgress.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      module.color === 'blue' ? 'bg-blue-500' :
                      module.color === 'green' ? 'bg-green-500' :
                      module.color === 'orange' ? 'bg-orange-500' :
                      'bg-purple-500'
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Best Score: {moduleProgress.score}%</span>
                  <span className="font-medium text-gray-900">{progressPercentage}% Complete</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Tips */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">💡 Today's Tips</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <h3 className="font-medium text-gray-900 mb-2">Listening</h3>
            <p className="text-sm text-gray-600">Focus on key words and main ideas. Take notes while listening.</p>
          </div>
          <div className="text-center">
            <h3 className="font-medium text-gray-900 mb-2">Speaking</h3>
            <p className="text-sm text-gray-600">Practice speaking clearly and at a moderate pace. Record yourself.</p>
          </div>
          <div className="text-center">
            <h3 className="font-medium text-gray-900 mb-2">Reading</h3>
            <p className="text-sm text-gray-600">Skim first, then read carefully. Time management is crucial.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;