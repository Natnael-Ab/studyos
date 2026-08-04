import { useContext } from "react";
import UiFeedbackContext from "../context/UiFeedbackContext";

function useUiFeedback() {
  const context = useContext(UiFeedbackContext);

  if (!context) {
    throw new Error("useUiFeedback must be used inside UiFeedbackProvider");
  }

  return context;
}

export { useUiFeedback };
export default useUiFeedback;