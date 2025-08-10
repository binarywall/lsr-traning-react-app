import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react';

const ListeningModule = ({ onProgress }) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const progressRef = useRef(null);

  const exercises = [
    {
      id: 1,
      title: "Company Introduction",
      audioText: "Welcome to TechCorp. We are a leading software development company specializing in innovative solutions for businesses worldwide. Our team consists of experienced developers, designers, and project managers who work together to deliver high-quality products.",
      transcript: "Welcome to TechCorp. We are a leading software development company specializing in innovative solutions for businesses worldwide. Our team consists of experienced developers, designers, and project managers who work together to deliver high-quality products.",
      question: "What type of company is TechCorp?",
      options: [
        "A hardware manufacturing company",
        "A software development company",
        "A consulting firm",
        "A financial services company"
      ],
      correct: 1,
      duration: 15
    },
    {
      id: 2,
      title: "Interview Process",
      audioText: "Our interview process consists of three rounds: first, a technical assessment to evaluate your coding skills; second, an HR interview to discuss your background and experience; and finally, a discussion with the team lead to assess cultural fit and project alignment.",
      transcript: "Our interview process consists of three rounds: first, a technical assessment to evaluate your coding skills; second, an HR interview to discuss your background and experience; and finally, a discussion with the team lead to assess cultural fit and project alignment.",
      question: "How many rounds are in the interview process?",
      options: ["Two rounds", "Three rounds", "Four rounds", "Five rounds"],
      correct: 1,
      duration: 18
    },
    {
      id: 3,
      title: "Work Environment",
      audioText: "At our company, we believe in maintaining a healthy work-life balance. We offer flexible working hours, remote work options twice a week, and comprehensive health benefits. Our office environment is collaborative and open, encouraging creativity and innovation among team members.",
      transcript: "At our company, we believe in maintaining a healthy work-life balance. We offer flexible working hours, remote work options twice a week, and comprehensive health benefits. Our office environment is collaborative and open, encouraging creativity and innovation among team members.",
      question: "How many days per week can employees work remotely?",
      options: ["One day", "Two days", "Three days", "Every day"],
      correct: 1,
      duration: 16
    }
  ];

  const currentEx = exercises[currentExercise];

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0 && hasPlayedAudio) {
      timerRef.current = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && hasPlayedAudio) {
      handleSubmit();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft, hasPlayedAudio]);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => {
        setIsPlaying(true);
        setAudioProgress(0);
        // Start progress animation
        progressRef.current = setInterval(() => {
          setAudioProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressRef.current);
              return 100;
            }
            return prev + (100 / (currentEx.duration * 10)); // Update every 100ms
          });
        }, 100);
      };
      
      utterance.onend = () => {
        setIsPlaying(false);
        setAudioProgress(100);
        setHasPlayedAudio(true);
        setIsActive(true);
        clearInterval(progressRef.current);
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
        setHasPlayedAudio(true);
        setIsActive(true);
        clearInterval(progressRef.current);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback for browsers without speech synthesis
      alert('Speech synthesis not supported. Please read the transcript below.');
      setHasPlayedAudio(true);
      setIsActive(true);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      clearInterval(progressRef.current);
    } else {
      speakText(currentEx.audioText);
    }
  };

  const resetAudio = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsActive(false);
    setTimeLeft(30);
    setAudioProgress(0);
    setHasPlayedAudio(false);
    clearInterval(progressRef.current);
    clearInterval(timerRef.current);
  };

  const handleAnswerSelect = (optionIndex) => {
    if (!showResults) {
      setSelectedAnswer(optionIndex);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowResults(true);
      setIsActive(false);
      const isCorrect = selectedAnswer === currentEx.correct;
      if (isCorrect) {
        setScore(score + 1);
      }
      clearInterval(timerRef.current);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setSelectedAnswer(null);
      setShowResults(false);
      setTimeLeft(30);
      setIsPlaying(false);
      setIsActive(false);
      setAudioProgress(0);
      setHasPlayedAudio(false);
      clearInterval(timerRef.current);
      clearInterval(progressRef.current);
    } else {
      // Complete module
      const finalScore = Math.round((score / exercises.length) * 100);
      onProgress({ 
        completed: exercises.length, 
        score: finalScore 
      });
      alert(`Module completed! Your score: ${finalScore}%`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Listening Practice</h1>
          <div className="flex items-center space-x-4">
            {hasPlayedAudio && (
              <div className="flex items-center space-x-2">
                <Clock size={20} className={timeLeft < 10 ? "text-red-600" : "text-gray-600"} />
                <span className={`text-lg font-medium ${timeLeft < 10 ? "text-red-600" : "text-gray-900"}`}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
            <div className="text-sm text-gray-600">
              Exercise {currentExercise + 1} of {exercises.length}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentExercise) / exercises.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Audio Player */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{currentEx.title}</h2>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <button
                onClick={togglePlayPause}
                className="w-16 h-16 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-colors"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button
                onClick={resetAudio}
                className="w-12 h-12 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center text-gray-700 transition-colors"
              >
                <RotateCcw size={20} />
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                {isPlaying ? 'Playing audio...' : hasPlayedAudio ? 'Audio completed' : 'Click play to start'}
              </p>
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                  style={{ width: `${audioProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Duration: ~{currentEx.duration} seconds
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Instructions:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Listen to the audio carefully</li>
              <li>• You can replay the audio if needed</li>
              <li>• Select the best answer from the options</li>
              <li>• You have 30 seconds after the audio ends</li>
            </ul>
          </div>
        </div>

        {/* Question and Options */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{currentEx.question}</h3>
            
            <div className="space-y-3">
              {currentEx.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResults || !hasPlayedAudio}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    !hasPlayedAudio
                      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                      : selectedAnswer === index
                      ? showResults
                        ? index === currentEx.correct
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-red-500 bg-red-50 text-red-700'
                        : 'border-blue-500 bg-blue-50'
                      : showResults && index === currentEx.correct
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResults && (
                      <div>
                        {index === currentEx.correct ? (
                          <CheckCircle className="text-green-500" size={20} />
                        ) : selectedAnswer === index ? (
                          <XCircle className="text-red-500" size={20} />
                        ) : null}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Status Message */}
          {!hasPlayedAudio && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700 text-sm">
                Please listen to the audio first before selecting an answer.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between">
            {!showResults ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null || !hasPlayedAudio}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Submit Answer
              </button>
            ) : (
              <div className="flex justify-between w-full items-center">
                <div className="text-sm text-gray-600">
                  {selectedAnswer === currentEx.correct ? (
                    <span className="text-green-600 font-medium">✓ Correct!</span>
                  ) : (
                    <span className="text-red-600 font-medium">✗ Incorrect</span>
                  )}
                </div>
                <button
                  onClick={nextExercise}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  {currentExercise < exercises.length - 1 ? 'Next Exercise' : 'Complete Module'}
                </button>
              </div>
            )}
          </div>

          {/* Score Display */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Current Score:</span>
              <span className="font-medium">{score}/{currentExercise + (showResults ? 1 : 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript (shown after answering) */}
      {showResults && (
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Audio Transcript:</h3>
          <p className="text-gray-700 italic">"{currentEx.transcript}"</p>
        </div>
      )}
    </div>
  );
};

export default ListeningModule;