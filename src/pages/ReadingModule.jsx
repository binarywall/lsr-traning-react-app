import React, { useState, useEffect, useRef } from 'react';
import { Clock, CheckCircle, XCircle, BookOpen } from 'lucide-react';

const ReadingModule = ({ onProgress }) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isActive, setIsActive] = useState(true);
  const [score, setScore] = useState(0);
  const timerRef = useRef(null);

  const exercises = [
    {
      id: 1,
      title: "Company Culture and Values",
      passage: `
        TechCorp has established itself as a leading software development company by prioritizing innovation, collaboration, and employee growth. Founded in 2010, the company has grown from a small startup to a multinational corporation with over 5,000 employees worldwide.

        The company's core values center around three main principles: Innovation, Integrity, and Inclusivity. Innovation drives the development of cutting-edge solutions that solve real-world problems. Integrity ensures that all business practices are ethical and transparent. Inclusivity creates a diverse workplace where every employee feels valued and empowered to contribute their unique perspectives.

        TechCorp's commitment to employee development is evident through its comprehensive training programs, mentorship opportunities, and career advancement pathways. The company invests heavily in continuous learning, offering employees access to online courses, conferences, and workshops. This investment in human capital has resulted in high employee satisfaction rates and low turnover.

        The company's agile work environment encourages creativity and quick adaptation to market changes. Teams are organized around projects with clear objectives and deadlines. Regular retrospectives and feedback sessions ensure continuous improvement in both processes and products.

        TechCorp's success can also be attributed to its strong emphasis on work-life balance. The company offers flexible working hours, remote work options, and comprehensive health benefits. This approach has attracted top talent from around the world and established TechCorp as an employer of choice in the technology sector.
      `,
      questions: [
        {
          question: "When was TechCorp founded?",
          options: ["2008", "2010", "2012", "2015"],
          correct: 1
        },
        {
          question: "How many core values does TechCorp have?",
          options: ["Two", "Three", "Four", "Five"],
          correct: 1
        },
        {
          question: "What contributes to TechCorp's low employee turnover?",
          options: [
            "High salaries only",
            "Remote work options only", 
            "Investment in employee development and training",
            "Flexible deadlines"
          ],
          correct: 2
        }
      ]
    },
    {
      id: 2,
      title: "Project Management Methodologies",
      passage: `
        Modern software development relies heavily on effective project management methodologies to deliver high-quality products on time and within budget. Among the various approaches available, Agile and Waterfall methodologies represent two fundamentally different philosophies.

        The Waterfall methodology follows a linear, sequential approach where each phase must be completed before the next begins. This method works well for projects with clearly defined requirements that are unlikely to change. The structured nature of Waterfall makes it easier to manage timelines and budgets, but it can be inflexible when changes are needed.

        Agile methodology, in contrast, emphasizes iterative development and continuous feedback. Projects are broken down into short sprints, typically lasting 2-4 weeks, with working software delivered at the end of each sprint. This approach allows for greater flexibility and adaptation to changing requirements but requires more active stakeholder involvement.

        Many organizations have adopted hybrid approaches that combine elements of both methodologies. These approaches allow teams to maintain the structure and predictability of Waterfall while incorporating the flexibility and customer feedback loops of Agile.

        The choice between methodologies often depends on factors such as project complexity, team size, customer involvement, and organizational culture. Successful project managers understand these factors and select the most appropriate methodology for their specific context.
      `,
      questions: [
        {
          question: "What is a key characteristic of the Waterfall methodology?",
          options: [
            "Iterative development cycles",
            "Linear, sequential approach",
            "Continuous customer feedback",
            "Short development sprints"
          ],
          correct: 1
        },
        {
          question: "How long do Agile sprints typically last?",
          options: ["1-2 weeks", "2-4 weeks", "4-6 weeks", "6-8 weeks"],
          correct: 1
        },
        {
          question: "What do hybrid approaches combine?",
          options: [
            "Only Agile principles",
            "Only Waterfall structure",
            "Elements of both Agile and Waterfall",
            "Neither methodology"
          ],
          correct: 2
        }
      ]
    }
  ];

  const currentEx = exercises[currentExercise];

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    if (!showResults) {
      setSelectedAnswers({
        ...selectedAnswers,
        [questionIndex]: optionIndex
      });
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
    setIsActive(false);
    
    let correctAnswers = 0;
    currentEx.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct) {
        correctAnswers++;
      }
    });
    setScore(score + correctAnswers);
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setSelectedAnswers({});
      setShowResults(false);
      setTimeLeft(300);
      setIsActive(true);
    } else {
      // Complete module
      const totalQuestions = exercises.reduce((sum, ex) => sum + ex.questions.length, 0);
      const finalScore = Math.round((score / totalQuestions) * 100);
      onProgress({ 
        completed: exercises.length, 
        score: finalScore 
      });
      alert(`Module completed! Your score: ${finalScore}%`);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Reading Comprehension</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock size={20} className={timeLeft < 60 ? "text-red-600" : "text-gray-600"} />
              <span className={`text-lg font-medium ${timeLeft < 60 ? "text-red-600" : "text-gray-900"}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Exercise {currentExercise + 1} of {exercises.length}
            </div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentExercise) / exercises.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Reading Passage */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <BookOpen className="text-orange-500" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">{currentEx.title}</h2>
          </div>
          
          <div className="prose max-w-none">
            <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {currentEx.passage}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Reading Tips:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Read the questions first to know what to look for</li>
              <li>• Skim the passage to understand the main ideas</li>
              <li>• Look for keywords that relate to the questions</li>
              <li>• Manage your time - don't spend too long on one question</li>
            </ul>
          </div>
        </div>

        {/* Questions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Questions</h3>
          
          <div className="space-y-6">
            {currentEx.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="border-b border-gray-200 pb-6 last:border-b-0">
                <h4 className="font-medium text-gray-900 mb-4">
                  {questionIndex + 1}. {question.question}
                </h4>
                
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <button
                      key={optionIndex}
                      onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
                      disabled={showResults}
                      className={`w-full p-3 text-left rounded-lg border-2 transition-all duration-200 ${
                        selectedAnswers[questionIndex] === optionIndex
                          ? showResults
                            ? optionIndex === question.correct
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-red-500 bg-red-50 text-red-700'
                            : 'border-orange-500 bg-orange-50'
                          : showResults && optionIndex === question.correct
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showResults && (
                          <div>
                            {optionIndex === question.correct ? (
                              <CheckCircle className="text-green-500" size={20} />
                            ) : selectedAnswers[questionIndex] === optionIndex ? (
                              <XCircle className="text-red-500" size={20} />
                            ) : null}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit/Next Button */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            {!showResults ? (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(selectedAnswers).length !== currentEx.questions.length}
                className="w-full px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Submit Answers
              </button>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-900">
                    Score: {Object.values(selectedAnswers).filter((answer, index) => 
                      answer === currentEx.questions[index].correct
                    ).length}/{currentEx.questions.length}
                  </p>
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
      </div>
    </div>
  );
};

export default ReadingModule;