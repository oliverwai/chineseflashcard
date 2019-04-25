import React from "react";

// Takes in props for numerator, denominator, and progress %
// outputs the entire progress bar
const ProgressBar = props => (
  <div className="col s6">
    <div className="row">
      <h5 className="col s3 left-align">{props.title}</h5>
      <h5 className="col s3 right-align">
        {props.num} / {props.denom}
      </h5>
    </div>
    <div className="progress progressBar">
      <div className="determinate" style={{ width: props.progress + "%" }} />
    </div>
  </div>
);

export default ProgressBar;
