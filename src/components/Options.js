import React from "react";
import { useQuiz } from "../contexts/QuizContext";

function Options({
  question,
  // dispatch, answer
}) {
  const { dispatch, answer } = useQuiz();
  const hasAnswered = answer !== null;
  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          className={`btn btn-option ${index === answer ? "answer" : ""} ${
            hasAnswered
              ? index === question.correctOption
                ? "correct"
                : "wrong"
              : ""
          }`}
          key={option}
          //dispatch the action
          onClick={() => dispatch({ type: "newAnswer", payload: index })}
          //to know if there is an answer
          disabled={hasAnswered}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
