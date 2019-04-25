import React from "react";
import owl1 from "../img/owl1.png"; // Tell Webpack this JS file uses this image
import owl2 from "../img/owl2.png"; // Tell Webpack this JS file uses this image
import owl3 from "../img/owl3.png"; // Tell Webpack this JS file uses this image
import owl4 from "../img/owl4.png"; // Tell Webpack this JS file uses this image
import owl5 from "../img/owl5.png"; // Tell Webpack this JS file uses this image

// Takes in props for numerator, denominator, and progress %
// outputs the entire progress bar
const ProfilePic = props => {
  var profile = 0;
  if (props.value === 0) {
    profile = owl1;
  } else if (props.value === 1) {
    profile = owl2;
  } else if (props.value === 2) {
    profile = owl3;
  } else if (props.value === 3) {
    profile = owl4;
  } else {
    profile = owl5;
  }

  return <img className="centered" src={profile} alt="Profile" />;
};

export default ProfilePic;
