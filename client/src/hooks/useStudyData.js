import { useContext } from "react";
import StudyDataContext from "../context/StudyDataContext";

function useStudyData() {
  const context = useContext(StudyDataContext);

  if (!context) {
    throw new Error("useStudyData must be used inside StudyDataProvider");
  }

  return context;
}

export { useStudyData };
export default useStudyData;