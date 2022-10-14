import Page from "src/layouts/page";
import { sampleData } from "src/entities/project.entities";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import Project from "src/components/Projects/Project";

const Projects = () => {
  const { theme } = useSelector((state: RootState) => state.global);

  return (
    <Page>
      <div className="text-3xl">
        Explore TosiDrop Projects
        <div className="flex flex-col gap-4">
          {sampleData.map((entry) => {
            return (
                <Project projectData={entry}></Project>
            );
          })}
        </div>
      </div>
    </Page>
  );
};

export default Projects;
