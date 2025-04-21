import React from "react";

import { useEffect, useReducer } from "react";
import NextButton from "./NextButton";
import Main from "./Main";
import Header from "./Header";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
const SECS_PER_QUESTION = 30;
const initialState = {
  questions: [],
  //'loading','error','ready','active','finished' are all state variable
  status: "loading",
  //how to display each question using index
  index: 0,
  //handling new answer, we need a new piece of state
  answer: null,
  points: 0,
  //another piece of state needed to be remembered across the state
  highscore: 0,
  //timer state
  secondsRemaining: null,
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
        //.calculating the time for the amount of questions
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
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

    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    //restarting the quiz
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
      };
    //you can also do it this way:
    // return {
    //   ...state,
    //   points: 0,
    // highscore: 0,
    //  index: 0,
    //   answer: null,
    //   status: "ready",
    // };
    //timer impl
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Action unknown");
  }
}
function App() {
  //destructure state:{qustion,status}
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );
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
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              {/* Next button only if there is an answer*/}
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
