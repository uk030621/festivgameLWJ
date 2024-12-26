"use client";

import { useState, useEffect } from "react";

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
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const categories = [
    { id: 9, name: "General Knowledge" },
    { id: 18, name: "Science: Computers" },
    { id: 21, name: "Sports" },
    { id: 23, name: "History" },
    { id: 27, name: "Animals" },
  ];

  const difficulties = ["easy", "medium", "hard"];

  useEffect(() => {
    const createSnowflakes = () => {
      const container = document.querySelector("#snow-container");
      const snowflakeCount = 50;

      if (!container) return;

      const snowflakes = [];
      for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement("div");
        snowflake.classList.add("snowflake");

        snowflake.style.left = `${Math.random() * 100}vw`;
        snowflake.style.animationDuration = `${3 + Math.random() * 5}s`;
        snowflake.style.animationDelay = `${Math.random() * 3}s`;

        container.appendChild(snowflake);
        snowflakes.push(snowflake);

        snowflake.addEventListener("animationend", () => {
          container.removeChild(snowflake);
        });
      }

      return () => {
        snowflakes.forEach((sf) => sf.remove());
      };
    };

    const cleanup = createSnowflakes();
    return cleanup;
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const url = `https://opentdb.com/api.php?amount=50${
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
    setShowCorrectAnswer(true);

    setTimeout(() => {
      setSelectedOption(null);
      setShowCorrectAnswer(false);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }, 2500);
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

  const quitGame = () => {
    resetGame(); // Resets the game to the customization screen
  };

  if (!gameStarted) {
    return (
      <div className="text-center mt-20">
        <div
          id="snow-container"
          className="absolute inset-0 pointer-events-none z-50"
        ></div>
        <h1 className="text-2xl font-bold text-white">
          <span className="text-8xl">🦉</span>
          <div className="mt-2 text-4xl">Quiz</div>
          <div className="text-base mt-2">Developed by LWJ</div>
        </h1>
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
            className="px-2 py-2 bg-slate-700 text-white rounded-lg shadow-lg hover:bg-slate-800 mt-4"
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
        <div
          id="snow-container"
          className="absolute inset-0 pointer-events-none z-50"
        ></div>
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
          {/*<button
            className="px-6 py-3 bg-black text-white rounded-lg shadow-lg hover:bg-gray-700"
            onClick={quitGame}
          >
            Quit Game
          </button>*/}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="mt-10 text-center">
      <div
        id="snow-container"
        className="absolute inset-0 pointer-events-none z-50"
      ></div>
      <h1 className="text-2xl font-bold mb-6 text-white">
        <span className="text-8xl">🦉</span>
        <div className="mt-4 text-4xl">Quiz Game</div>
      </h1>
      <button
        className="px-2 py-2 bg-slate-700 text-white rounded-lg shadow-lg hover:bg-gray-700 mb-10"
        onClick={quitGame}
      >
        Quit Game
      </button>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-black mb-4">
          {currentQuestion?.question}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {currentQuestion?.options.map((option, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-lg shadow-lg transition-all ${
                selectedOption === option
                  ? option === currentQuestion.answer
                    ? "bg-green-500 text-white"
                    : "bg-slate-700 text-white"
                  : "bg-slate-700 text-white hover:bg-slate-800 focus:outline-none"
              }`}
              onClick={() => {
                handleAnswer(option);
                setTimeout(
                  () => document.getElementById("reset-hover").click(),
                  50
                ); // Simulate click on reset button
              }}
              disabled={!!selectedOption}
              onMouseDown={(e) => e.preventDefault()}
            >
              {option}
            </button>
          ))}
        </div>
        <button
          id="reset-hover"
          style={{
            position: "absolute",
            left: "-9999px", // Move off-screen
            top: "-9999px", // Move off-screen
            visibility: "hidden", // Ensure it's invisible
          }}
          onClick={() => {
            /* This does nothing but removes focus from answer buttons */
          }}
        ></button>
        {showCorrectAnswer && (
          <div className="mt-4 text-lg font-bold text-green-500">
            Correct Answer: {currentQuestion.answer}
          </div>
        )}
      </div>
    </div>
  );
}
