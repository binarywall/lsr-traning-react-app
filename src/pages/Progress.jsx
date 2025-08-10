import React from 'react';
import { BarChart3, TrendingUp, Trophy, Target, Clock, CheckCircle } from 'lucide-react';

const Progress = ({ progress }) => {
  const modules = [
    { key: 'listening', name: 'Listening', color: 'blue', icon: '🎧' },
    { key: 'speaking', name: 'Speaking', color: 'green', icon: '🎤' },
    { key: 'reading', name: 'Reading', color: 'orange', icon: '📖' },
    { key: 'mockInterviews', name: 'Mock Interviews', color: 'purple', icon: '🎥' }
  ];

  const calculateOverallProgress = () => {
    const totalCompleted = Object.values(progress).reduce((sum, module) => sum + module.completed, 0);
    const totalExercises = Object.values(progress).reduce((sum, module) => sum + module.total, 0);
    return Math.round((totalCompleted / totalExercises) * 100);
  };

  const calculateAverageScore = () => {
    const totalScore = Object.values(progress).reduce((sum, module) => sum + module.score, 0);
    return Math.round(totalScore / Object.values(progress).length);
  };

  const getStrengthsAndWeaknesses = () => {
    const moduleScores = modules.map(module => ({
      name: module.name,
      score: progress[module.key].score,
      completed: progress[module.key].completed,
      total: progress[module.key].total
    }));

    const strengths = moduleScores.filter(m => m.score >= 80).map(m => m.name);
    const weaknesses = moduleScores.filter(m => m.score < 70).map(m => m.name);

    return { strengths, weaknesses };
  };

  const { strengths, weaknesses } = getStrengthsAndWeaknesses();
  const overallProgress = calculateOverallProgress();
  const averageScore = calculateAverageScore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Learning Progress</h1>
        <p className="text-gray-600">Track your performance and identify areas for improvement</p>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="text-blue-600" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-900">{overallProgress}%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Overall Progress</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Trophy className="text-green-600" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-900">{averageScore}%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Average Score</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target className="text-orange-600" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {Object.values(progress).reduce((sum, module) => sum + module.completed, 0)}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Exercises Completed</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="text-purple-600" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {Math.round(
                Object.values(progress).reduce((sum, module) => sum + module.completed, 0) * 5
              )}h
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Study Time</h3>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Module Progress */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Module Progress</h2>
          <div className="space-y-6">
            {modules.map((module) => {
              const moduleProgress = progress[module.key];
              const completionRate = Math.round((moduleProgress.completed / moduleProgress.total) * 100);
              
              return (
                <div key={module.key}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{module.icon}</span>
                      <span className="font-medium text-gray-900">{module.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {moduleProgress.completed}/{moduleProgress.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full ${
                        module.color === 'blue' ? 'bg-blue-500' :
                        module.color === 'green' ? 'bg-green-500' :
                        module.color === 'orange' ? 'bg-orange-500' :
                        'bg-purple-500'
                      }`}
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{completionRate}% Complete</span>
                    <span>Best Score: {moduleProgress.score}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Analysis</h2>
          
          <div className="space-y-6">
            {/* Strengths */}
            <div>
              <h3 className="font-medium text-green-700 mb-3 flex items-center">
                <CheckCircle size={18} className="mr-2" />
                Your Strengths
              </h3>
              <div className="space-y-2">
                {strengths.length > 0 ? (
                  strengths.map((strength, index) => (
                    <div key={index} className="bg-green-50 rounded-lg p-3">
                      <span className="text-green-700 font-medium">{strength}</span>
                      <p className="text-green-600 text-sm">Excellent performance - keep it up!</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">Complete more exercises to identify your strengths</p>
                )}
              </div>
            </div>

            {/* Areas for Improvement */}
            <div>
              <h3 className="font-medium text-orange-700 mb-3 flex items-center">
                <TrendingUp size={18} className="mr-2" />
                Areas for Improvement
              </h3>
              <div className="space-y-2">
                {weaknesses.length > 0 ? (
                  weaknesses.map((weakness, index) => (
                    <div key={index} className="bg-orange-50 rounded-lg p-3">
                      <span className="text-orange-700 font-medium">{weakness}</span>
                      <p className="text-orange-600 text-sm">Focus on practice exercises in this area</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">Great job! No major weaknesses identified</p>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-700 mb-2">Recommendations</h3>
              <ul className="text-blue-600 text-sm space-y-1">
                <li>• Practice daily for consistent improvement</li>
                <li>• Focus on time management during exercises</li>
                <li>• Review feedback after each session</li>
                <li>• Take regular mock interviews</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`text-center p-4 rounded-lg ${overallProgress >= 25 ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-gray-50 border-2 border-gray-200'}`}>
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-medium text-sm">Getting Started</h3>
            <p className="text-xs text-gray-600">Complete 25% of exercises</p>
          </div>
          <div className={`text-center p-4 rounded-lg ${overallProgress >= 50 ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50 border-2 border-gray-200'}`}>
            <div className="text-2xl mb-2">🚀</div>
            <h3 className="font-medium text-sm">Making Progress</h3>
            <p className="text-xs text-gray-600">Complete 50% of exercises</p>
          </div>
          <div className={`text-center p-4 rounded-lg ${overallProgress >= 75 ? 'bg-purple-50 border-2 border-purple-200' : 'bg-gray-50 border-2 border-gray-200'}`}>
            <div className="text-2xl mb-2">⭐</div>
            <h3 className="font-medium text-sm">Almost There</h3>
            <p className="text-xs text-gray-600">Complete 75% of exercises</p>
          </div>
          <div className={`text-center p-4 rounded-lg ${overallProgress >= 100 ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 border-2 border-gray-200'}`}>
            <div className="text-2xl mb-2">🏆</div>
            <h3 className="font-medium text-sm">Champion</h3>
            <p className="text-xs text-gray-600">Complete all exercises</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;