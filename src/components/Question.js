import React from "react";
import Options from "./Options";
import { useQuiz } from "../contexts/QuizContext";
function Question() {
  //{ question, dispatch, answer }
  const { questions, dispatch, answer } = useQuiz();
  const question = questions.at(index);
  console.log(question);
  return (
    <div>
      <h4>{question.question}</h4>
      <Options question={question} dispatch={dispatch} answer={answer} />
    </div>
  );
}

export default Question;
