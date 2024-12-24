"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function decodeHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.documentElement.textContent;
}

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  const categories = [
    { id: 9, name: "General Knowledge" },
    { id: 18, name: "Science: Computers" },
    { id: 21, name: "Sports" },
    { id: 23, name: "History" },
    { id: 27, name: "Animals" },
  ];

  const difficulties = ["easy", "medium", "hard"];

  // Fetch questions from API
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const url = `https://opentdb.com/api.php?amount=10${
        category ? `&category=${category}` : ""
      }${difficulty ? `&difficulty=${difficulty}` : ""}&type=multiple`;

      const response = await fetch(url);
      const data = await response.json();

      const formattedQuestions = data.results.map((q, index) => ({
        id: index + 1,
        question: decodeHTML(q.question),
        options: [...q.incorrect_answers, q.correct_answer]
          .map(decodeHTML)
          .sort(() => Math.random() - 0.5),
        answer: decodeHTML(q.correct_answer),
      }));

      setQuestions(formattedQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setGameStarted(true);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      setLoading(false);
    }
  };

  const handleAnswer = (option) => {
    setSelectedOption(option);
    if (option === questions[currentQuestionIndex].answer) {
      setScore(score + 1);
    }
    setTimeout(() => {
      setSelectedOption(null);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }, 1000);
  };

  const replaySameQuestions = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
  };

  const resetGame = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCategory("");
    setDifficulty("");
    setGameStarted(false);
  };

  if (!gameStarted) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-2xl font-bold text-white">
          <span className="text-6xl">🎄</span>
          <div className="mt-2">Customize Your Quiz</div>
        </h1>
        {/*<div className="mb-6 mt-4">
          <Link
            className="bg-slate-400 rounded-md text-white cursor-pointer w-fit px-2 py-2"
            href="/ "
          >
            Return
          </Link>
        </div>*/}

        <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label htmlFor="category" className="block text-lg font-bold mb-2">
              Select Category
            </label>
            <select
              id="category"
              className="w-full p-2 border rounded-lg"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Any Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="difficulty"
              className="block text-lg font-bold mb-2"
            >
              Select Difficulty
            </label>
            <select
              id="difficulty"
              className="w-full p-2 border rounded-lg"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="">Any Difficulty</option>
              {difficulties.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchQuestions}
            className="px-6 py-3 bg-festiveRed text-white rounded-lg shadow-lg hover:bg-red-700 mt-4"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center text-lg text-white">Loading questions...</div>
    );
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-white">🎉 Quiz Complete! 🎉</h2>
        <p className="text-xl mt-4 text-gray-200">
          Your Score: {score} / {questions.length}
        </p>
        <div className="mt-8 flex flex-col gap-4">
          <button
            className="px-6 py-3 bg-festiveRed text-white rounded-lg shadow-lg hover:bg-red-700"
            onClick={replaySameQuestions}
          >
            Replay Same Questions
          </button>
          <button
            className="px-6 py-3 bg-festiveGold text-white rounded-lg shadow-lg hover:bg-yellow-600"
            onClick={fetchQuestions}
          >
            New Game (Get New Questions)
          </button>
          <button
            className="px-6 py-3 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-700"
            onClick={resetGame}
          >
            Back to Customization
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="mt-10 text-center">
      <h1 className="text-2xl font-bold mb-6 text-white">
        <span className="text-6xl">🎄</span>
        <div className="mt-4">Festive Quiz Game</div>
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">{currentQuestion?.question}</h2>
        <div className="grid grid-cols-2 gap-4">
          {currentQuestion?.options.map((option, index) => (
            <button
              key={index}
              className={`text-sm px-4 py-2 rounded-lg shadow-lg transition-all ${
                selectedOption === option
                  ? option === currentQuestion.answer
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  : "bg-festiveRed text-white hover:bg-red-700"
              }`}
              onClick={() => handleAnswer(option)}
              disabled={!!selectedOption}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
