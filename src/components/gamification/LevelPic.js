import React from "react";
import level1 from "../img/level1.png"; // Tell Webpack this JS file uses this image
import level2 from "../img/level2.png"; // Tell Webpack this JS file uses this image
import level3 from "../img/level3.png"; // Tell Webpack this JS file uses this image
import level4 from "../img/level4.png"; // Tell Webpack this JS file uses this image
import level5 from "../img/level5.png"; // Tell Webpack this JS file uses this image

// Takes in props for numerator, denominator, and progress %
// outputs the entire progress bar
const LevelPic = props => {
  var level = 0;
  if (props.value === 0) {
    level = level1;
  } else if (props.value === 1) {
    level = level2;
  } else if (props.value === 2) {
    level = level3;
  } else if (props.value === 3) {
    level = level4;
  } else {
    level = level5;
  }

  return <img className="centered" src={level} style={{height: 80, width: 80}} alt="Level" />;
};

export default LevelPic;
