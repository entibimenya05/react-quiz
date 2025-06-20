import React from "react";
import { useQuiz } from "../contexts/QuizContext";
function Progress() {
  //{ index, numQuestions, points, maxPossiblePoints, answer }
  const { index, numQuestions, points, maxPossiblePoints, answer } = useQuiz();
  return (
    //strong makes it bold
    <header className="progress">
      {/*progress bar*/}
      <progress max={numQuestions} value={index + Number(answer !== null)} />
      <span>
        Question <strong>{index + 1}</strong>/{numQuestions}
      </span>
      <p>
        <strong>{points}</strong>/{maxPossiblePoints}
      </p>
    </header>
  );
}

export default Progress;
