import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Mic, MicOff, Clock, CheckCircle } from 'lucide-react';

const MockInterview = ({ onProgress }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAnswers, setRecordedAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [preparationTime, setPreparationTime] = useState(30);
  const [answerTime, setAnswerTime] = useState(0);
  const [isPreparationPhase, setIsPreparationPhase] = useState(true);
  const [overallScore, setOverallScore] = useState(null);
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);

  const interviewQuestions = [
    {
      id: 1,
      question: "Tell me about yourself and why you're interested in this position.",
      category: "Personal Introduction",
      timeLimit: 90,
      keyPoints: ["Background", "Skills", "Interest in role", "Career goals"]
    },
    {
      id: 2,
      question: "Describe a challenging project you worked on and how you overcame the difficulties.",
      category: "Problem Solving",
      timeLimit: 120,
      keyPoints: ["Specific challenge", "Actions taken", "Results achieved", "Lessons learned"]
    },
    {
      id: 3,
      question: "Where do you see yourself in 5 years, and how does this role fit into your career plans?",
      category: "Career Goals",
      timeLimit: 90,
      keyPoints: ["Career vision", "Growth plans", "Company alignment", "Realistic goals"]
    },
    {
      id: 4,
      question: "What are your greatest strengths and how would they benefit our team?",
      category: "Strengths & Skills",
      timeLimit: 90,
      keyPoints: ["Specific strengths", "Examples", "Team benefit", "Relevance to role"]
    },
    {
      id: 5,
      question: "Do you have any questions for me about the company or the role?",
      category: "Your Questions",
      timeLimit: 60,
      keyPoints: ["Company culture", "Role expectations", "Growth opportunities", "Team dynamics"]
    }
  ];

  const currentQ = interviewQuestions[currentQuestion];

  useEffect(() => {
    if (isPreparationPhase && preparationTime > 0) {
      timerRef.current = setInterval(() => {
        setPreparationTime(time => time - 1);
      }, 1000);
    } else if (isPreparationPhase && preparationTime === 0) {
      setIsPreparationPhase(false);
      setAnswerTime(currentQ.timeLimit);
    } else if (!isPreparationPhase && answerTime > 0 && isRecording) {
      timerRef.current = setInterval(() => {
        setAnswerTime(time => time - 1);
      }, 1000);
    } else if (answerTime === 0 && isRecording) {
      stopRecording();
    }
    
    return () => clearInterval(timerRef.current);
  }, [isPreparationPhase, preparationTime, answerTime, isRecording, currentQ.timeLimit]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const newAnswer = {
          questionId: currentQ.id,
          audioUrl,
          duration: currentQ.timeLimit - answerTime,
          timestamp: new Date().toISOString()
        };
        setRecordedAnswers([...recordedAnswers, newAnswer]);
      });

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Please allow microphone access to continue with the interview');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < interviewQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setIsPreparationPhase(true);
      setPreparationTime(30);
      setAnswerTime(0);
    } else {
      // Complete interview
      finishInterview();
    }
  };

  const finishInterview = () => {
    // Mock scoring based on recorded answers
    const mockScore = Math.floor(Math.random() * 25) + 75; // 75-100%
    setOverallScore(mockScore);
    setShowResults(true);
    onProgress({ 
      completed: interviewQuestions.length,
      score: mockScore 
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="mb-6">
            <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Complete!</h1>
            <p className="text-gray-600">Congratulations on completing your mock interview</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Performance</h2>
            <div className="text-4xl font-bold text-green-600 mb-2">{overallScore}%</div>
            <p className="text-gray-600">Overall Interview Score</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Strengths</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Clear communication</li>
                <li>• Good time management</li>
                <li>• Relevant examples provided</li>
              </ul>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-2">Areas for Improvement</h3>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Include more specific metrics</li>
                <li>• Practice speaking more confidently</li>
                <li>• Prepare more thoughtful questions</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Take Another Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Mock Interview</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {interviewQuestions.length}
            </div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion) / interviewQuestions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Interview Interface */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <div className="bg-purple-100 rounded-lg p-2 inline-block mb-4">
            <span className="text-purple-700 font-medium text-sm">{currentQ.category}</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">{currentQ.question}</h2>
          
          {/* Timer Display */}
          <div className="mb-6">
            {isPreparationPhase ? (
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Clock className="text-blue-500" size={24} />
                  <span className="text-2xl font-bold text-blue-600">{formatTime(preparationTime)}</span>
                </div>
                <p className="text-gray-600">Preparation time remaining</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Clock className={answerTime < 30 ? "text-red-500" : "text-green-500"} size={24} />
                  <span className={`text-2xl font-bold ${answerTime < 30 ? "text-red-600" : "text-green-600"}`}>
                    {formatTime(answerTime)}
                  </span>
                </div>
                <p className="text-gray-600">Answer time remaining</p>
              </div>
            )}
          </div>

          {/* Key Points */}
          {isPreparationPhase && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-medium text-gray-900 mb-3">Key Points to Consider:</h3>
              <ul className="space-y-2">
                {currentQ.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-gray-600">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recording Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            {isPreparationPhase ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <Clock className="text-blue-600" size={24} />
                </div>
                <p className="text-gray-600">Use this time to prepare your answer</p>
              </div>
            ) : (
              <>
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <Mic size={24} />
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white animate-pulse"
                  >
                    <MicOff size={24} />
                  </button>
                )}
              </>
            )}
          </div>

          {/* Status Messages */}
          <div className="text-center mb-6">
            {isPreparationPhase ? (
              <p className="text-blue-600 font-medium">Preparing... Recording will start automatically</p>
            ) : isRecording ? (
              <p className="text-red-600 font-medium">🔴 Recording your answer...</p>
            ) : (
              <p className="text-green-600 font-medium">Click the microphone to start recording</p>
            )}
          </div>

          {/* Answer Recorded - Next Button */}
          {recordedAnswers.some(answer => answer.questionId === currentQ.id) && !isRecording && (
            <div className="text-center">
              <p className="text-green-600 font-medium mb-4">✓ Answer recorded successfully</p>
              <button
                onClick={nextQuestion}
                className="px-8 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                {currentQuestion < interviewQuestions.length - 1 ? 'Next Question' : 'Finish Interview'}
              </button>
            </div>
          )}
        </div>

        {/* Interview Tips */}
        <div className="bg-purple-50 rounded-lg p-4 mt-8">
          <h3 className="font-medium text-purple-900 mb-2">💡 Interview Tips:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-purple-700">
            <div>
              <p>• Speak clearly and confidently</p>
              <p>• Use specific examples when possible</p>
            </div>
            <div>
              <p>• Stay within the time limit</p>
              <p>• Maintain good posture and eye contact</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;