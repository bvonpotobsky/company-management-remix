import React, {useState, useEffect} from "react";

import {formatTime} from "~/helpers";

const RealTime: React.FC<{startTime: number}> = ({startTime}) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const timeDifference = currentTime - startTime;
      setElapsedTime(timeDifference);
    }, 1000); // Update every second

    return () => {
      clearInterval(interval);
    };
  }, [startTime]);

  return <b> {formatTime(elapsedTime)}</b>;
};

export default RealTime;
