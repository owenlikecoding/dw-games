"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Space_Grotesk } from 'next/font/google'
import { CheckCircle, XCircle } from 'lucide-react'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

const questions = [
  {
    question: "Who has the most drops in the league?",
    options: ["Parker", "Macen", "Ben", "Grant"],
    correctAnswer: "Ben"
  },
  {
    question: "The term for a 1 on 1 head top?",
    options: ["Soa Ming!", "Gimmie Head Top", "Ayyyyy", "Straps"],
    correctAnswer: "Soa Ming!"
  },
  {
    question: "Who has the most passing yards?",
    options: ["Macen", "Owen", "Parker", "Grant"],
    correctAnswer: "Owen"
  }
]

export default function Component() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleOptionSelect = (option: string) => {
    const newSelectedAnswers = [...selectedAnswers]
    newSelectedAnswers[currentQuestion] = option
    setSelectedAnswers(newSelectedAnswers)
  }

  const handleNextQuestion = () => {
    const correct = selectedAnswers[currentQuestion] === questions[currentQuestion].correctAnswer
    setIsCorrect(correct)
    setShowFeedback(true)
  }

  useEffect(() => {
    if (showFeedback) {
      const timer = setTimeout(() => {
        setShowFeedback(false)
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1)
        } else {
          setShowResults(true)
        }
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [showFeedback, currentQuestion])

  const calculateScore = () => {
    return questions.reduce((score, question, index) => {
      return score + (selectedAnswers[index] === question.correctAnswer ? 1 : 0)
    }, 0)
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <div className={`min-h-screen bg-gray-100 flex items-center justify-center p-4 ${spaceGrotesk.className}`}>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Quiz Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-4xl font-bold mb-4">{score} / {questions.length}</p>
            <Progress value={(score / questions.length) * 100} className="w-full" />
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => window.location.reload()}>Play Again</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const currentQuestionData = questions[currentQuestion]

  return (
    <div className={`min-h-screen bg-gray-100 flex flex-col ${spaceGrotesk.className}`}>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Neighborhood Football Quiz (beta)</h1>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {showFeedback ? (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            >
              <div className="bg-white rounded-lg p-8 flex flex-col items-center">
                {isCorrect ? (
                  <CheckCircle className="w-24 h-24 text-green-500 mb-4" />
                ) : (
                  <XCircle className="w-24 h-24 text-red-500 mb-4" />
                )}
                <h2 className="text-2xl font-bold mb-2">
                  {isCorrect ? "Correct!" : "Incorrect!"}
                </h2>
                <p>The correct answer is: {currentQuestionData.correctAnswer}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-2xl"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Question {currentQuestion + 1} of {questions.length}
                  </CardTitle>
                  <Progress value={((currentQuestion + 1) / questions.length) * 100} className="w-full" />
                </CardHeader>
                <CardContent>
                  <h2 className="text-2xl font-bold mb-6">{currentQuestionData.question}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestionData.options.map((option, index) => (
                      <Button
                        key={index}
                        variant={selectedAnswers[currentQuestion] === option ? "default" : "outline"}
                        className="h-20 text-lg"
                        onClick={() => handleOptionSelect(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={handleNextQuestion}
                    disabled={!selectedAnswers[currentQuestion]}
                  >
                    {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}