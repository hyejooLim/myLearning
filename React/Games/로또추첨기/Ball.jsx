const React = require("react");

const Ball = ({ winBall }) => {
  let background;
  if (winBall < 10) {
    background = "red";
  } else if (winBall < 20) {
    background = "orange";
  } else if (winBall < 30) {
    background = "yellow";
  } else if (winBall < 40) {
    background = "blue";
  } else {
    background = "green";
  }
  
  return (
    <div className='ball' style={{ background }}>
      {winBall}
    </div>
  );
};

module.exports = Ball;
