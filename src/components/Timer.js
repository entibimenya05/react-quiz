import React, { useEffect } from "react";
function Timer({ dispatch, secondsRemaining }) {
  //formating
  const mins = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  //use useEffect hook to create a side Effect on mount
  useEffect(
    function () {
      const id = setInterval(function () {
        // console.log("tick");
        dispatch({ type: "tick" });
      }, 1000);
      //clean up function
      return () => clearInterval(id);
    },
    [dispatch]
  );
  return (
    <div className="timer">
      {/* {secondsRemaining}*/}
      {mins < 10 && "0"} {mins}:{seconds < 10 && "0"} {seconds}
    </div>
  );
}

export default Timer;
