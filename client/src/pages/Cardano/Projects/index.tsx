import Project from "src/components/Projects/Project";
import { sampleData } from "src/entities/project.entities";

const Projects = () => {
  return (
    <>
      <p className="text-3xl">Explore TosiDrop Projects</p>
      <div className="flex flex-col gap-4">
        {sampleData.map((entry) => {
          return <Project projectData={entry}></Project>;
        })}
      </div>
    </>
  );
};

export default Projects;
