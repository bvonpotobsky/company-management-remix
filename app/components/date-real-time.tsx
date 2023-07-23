import {format} from "date-fns";
import {useState, useEffect} from "react";

const RealTimeClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update the time every second (1000ms)

    return () => clearInterval(interval);
  }, []);

  return <>{format(currentTime, "HH:mm:ss a")}</>;
};

export default RealTimeClock;
