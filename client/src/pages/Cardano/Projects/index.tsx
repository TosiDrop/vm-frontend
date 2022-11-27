import { useEffect, useState } from "react";
import Project from "src/components/Projects/Project";
import { ProjectData } from "src/entities/project.entities";
import useErrorHandler from "src/hooks/useErrorHandler";
import { getProjects } from "src/services/common";

const Projects = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const { handleError } = useErrorHandler();

  const getProjectsFromAPI = async () => {
    try {
      const projects = await getProjects();
      setProjects(projects);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    getProjectsFromAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <p className="text-3xl">Explore TosiDrop Projects</p>
      <div className="flex flex-col gap-4">
        {projects.map((project, i) => {
          return <Project key={i} projectData={project}></Project>;
        })}
      </div>
    </>
  );
};

export default Projects;
