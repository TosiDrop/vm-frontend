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
        <ul>
          {sampleData.map((entry) => {
            return (
              <li>
                <Project projectData={entry}></Project>
              </li>
            );
          })}
        </ul>
      </div>
    </Page>
  );
};

export default Projects;
