import { useEffect, useMemo, useState } from "react";
import { Button, Surface } from "../../../components/ui";

function FocusTimer({ defaultMinutes = 50 }) {
  const initialSeconds = useMemo(() => defaultMinutes * 60, [defaultMinutes]);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timerId);
          setIsRunning(false);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isRunning]);

  function handleReset() {
    setIsRunning(false);
    setSecondsLeft(initialSeconds);
  }

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <Surface className="focus-timer">
      <div className="focus-timer__header">
        <h3 className="panel-title">Focus timer</h3>
        <p className="focus-timer__hint">Built for clean study blocks</p>
      </div>

      <div className="focus-timer__display">
        {minutes}:{seconds}
      </div>

      <div className="focus-timer__meta">
        {defaultMinutes} minute session ready
      </div>

      <div className="focus-timer__actions">
        <Button type="button" variant="primary" size="sm" onClick={() => setIsRunning(true)}>
          Start
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setIsRunning(false)}>
          Pause
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </Surface>
  );
}

export default FocusTimer;