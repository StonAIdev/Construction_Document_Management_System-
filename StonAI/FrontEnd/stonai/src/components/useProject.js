import { useState } from "react";

export default function useProject() {
  const getProject = () => {
    const val = localStorage.getItem("project");
    const userProject = JSON.parse(val);
    return userProject;
  };

  const [project, setProject] = useState(getProject());

  const saveUserProject = (userProject) => {
    localStorage.setItem("project", JSON.stringify(userProject));
    setProject(userProject);
  };
  return {
    setProject: saveUserProject,
    project,
  };
}
