import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, RotateCcw, CheckCircle, Clock } from 'lucide-react';

const SpeakingModule = ({ onProgress }) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const exercises = [
    {
      id: 1,
      title: "Self Introduction",
      prompt: "Introduce yourself to the interviewer. Include your name, educational background, and key skills.",
      timeLimit: 60,
      keyPoints: ["Name", "Education", "Skills", "Experience"],
      sampleAnswer: "Hello, my name is John Smith. I recently graduated with a degree in Computer Science from XYZ University..."
    },
    {
      id: 2,
      title: "Why This Company?",
      prompt: "Explain why you want to work for this company and what interests you about the role.",
      timeLimit: 45,
      keyPoints: ["Company Research", "Role Interest", "Career Goals", "Value Addition"],
      sampleAnswer: "I'm interested in this company because of its innovative approach to technology..."
    }
  ];

  const currentEx = exercises[currentExercise];

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRecording && recordingTime < currentEx.timeLimit) {
      timerRef.current = setInterval(() => {
        setRecordingTime(time => time + 1);
      }, 1000);
    } else if (recordingTime >= currentEx.timeLimit) {
      stopRecording();
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording, recordingTime, currentEx.timeLimit]);

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
        setRecordedAudio(audioUrl);
      });

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Please allow microphone access to use this feature');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (recordedAudio) {
      const audio = new Audio(recordedAudio);
      audio.play();
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
    }
  };

  const resetRecording = () => {
    setRecordedAudio(null);
    setRecordingTime(0);
    setIsPlaying(false);
    setFeedback(null);
    setShowResults(false);
  };

  const analyzeRecording = () => {
    // Mock analysis - in a real app, this would use speech recognition APIs
    const mockFeedback = {
      duration: recordingTime,
      fluency: Math.floor(Math.random() * 30) + 70, // 70-100%
      pronunciation: Math.floor(Math.random() * 25) + 75, // 75-100%
      completeness: Math.floor(Math.random() * 20) + 80, // 80-100%
      suggestions: [
        "Good pace and clarity",
        "Include more specific examples",
        "Practice speaking louder",
        "Work on connecting sentences smoothly"
      ].slice(0, Math.floor(Math.random() * 3) + 1)
    };
    setFeedback(mockFeedback);
    setShowResults(true);
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      resetRecording();
    } else {
      // Complete module
      const avgScore = feedback ? Math.round((feedback.fluency + feedback.pronunciation + feedback.completeness) / 3) : 75;
      onProgress({ 
        completed: exercises.length, 
        score: avgScore 
      });
      alert(`Module completed! Your average score: ${avgScore}%`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Speaking Practice</h1>
          <div className="text-sm text-gray-600">
            Exercise {currentExercise + 1} of {exercises.length}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentExercise) / exercises.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Exercise Instructions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{currentEx.title}</h2>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Prompt:</h3>
            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{currentEx.prompt}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Key Points to Cover:</h3>
            <ul className="space-y-2">
              {currentEx.keyPoints.map((point, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-gray-600">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Tips:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Speak clearly and at a moderate pace</li>
              <li>• Include specific examples when possible</li>
              <li>• Stay within the time limit</li>
              <li>• Practice good posture while speaking</li>
            </ul>
          </div>
        </div>

        {/* Recording Interface */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <Clock size={20} className="text-gray-600" />
                <span className="text-lg font-medium">
                  {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')} / 
                  {Math.floor(currentEx.timeLimit / 60)}:{(currentEx.timeLimit % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(recordingTime / currentEx.timeLimit) * 100}%` }}
              ></div>
            </div>

            {/* Recording Controls */}
            <div className="flex justify-center space-x-4 mb-6">
              {!isRecording && !recordedAudio && (
                <button
                  onClick={startRecording}
                  className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <Mic size={24} />
                </button>
              )}

              {isRecording && (
                <button
                  onClick={stopRecording}
                  className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white animate-pulse"
                >
                  <MicOff size={24} />
                </button>
              )}

              {recordedAudio && !isRecording && (
                <>
                  <button
                    onClick={playRecording}
                    disabled={isPlaying}
                    className="w-12 h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button
                    onClick={resetRecording}
                    className="w-12 h-12 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center text-gray-700 transition-colors"
                  >
                    <RotateCcw size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Status */}
            <div className="text-center">
              {isRecording && (
                <p className="text-red-600 font-medium">Recording... Speak clearly</p>
              )}
              {recordedAudio && !isRecording && !showResults && (
                <p className="text-green-600 font-medium">Recording complete! Click analyze to get feedback.</p>
              )}
              {!isRecording && !recordedAudio && (
                <p className="text-gray-600">Click the microphone to start recording</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {recordedAudio && !showResults && (
            <div className="text-center">
              <button
                onClick={analyzeRecording}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Analyze Recording
              </button>
            </div>
          )}

          {showResults && feedback && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Your Performance:</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Fluency:</span>
                  <span className="font-medium text-blue-600">{feedback.fluency}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pronunciation:</span>
                  <span className="font-medium text-green-600">{feedback.pronunciation}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completeness:</span>
                  <span className="font-medium text-orange-600">{feedback.completeness}%</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Suggestions:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {feedback.suggestions.map((suggestion, index) => (
                    <li key={index}>• {suggestion}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={nextExercise}
                className="w-full px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                {currentExercise < exercises.length - 1 ? 'Next Exercise' : 'Complete Module'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sample Answer (shown after analysis) */}
      {showResults && (
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Answer:</h3>
          <p className="text-gray-700 italic">"{currentEx.sampleAnswer}"</p>
        </div>
      )}
    </div>
  );
};

export default SpeakingModule;