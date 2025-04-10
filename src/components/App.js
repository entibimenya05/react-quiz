import React from "react";

import { useEffect, useReducer } from "react";
import NextButton from "./NextButton";
import Main from "./Main";
import Header from "./Header";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";

const initialState = {
  questions: [],
  //'loading','error','ready','active','finished' are all state variable
  status: "loading",
  //how to display each question using index
  index: 0,
  //handling new answer, we need a new piece of state
  answer: null,
  points: 0,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    //starting the game
    case "start":
      return {
        ...state,
        status: "active",
      };
    //let's create an action in our reducer to update answer state
    case "newAnswer":
      //current question
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        //updating the points
        points:
          action.payload === question.correctOption
            ? state.points + 1
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };

    default:
      throw new Error("Action unknown");
  }
}
function App() {
  //destructure state:{qustion,status}
  const [{ questions, status, index, answer }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const numQuestions = questions.length;
  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <div className="App">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            {/* Next button only if there is an answer*/}
            <NextButton dispatch={dispatch} answer={answer} />
          </>
        )}
      </Main>
    </div>
  );
}

export default App;
