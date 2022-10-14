import Project from "src/components/Projects/Project";
import { sampleData } from "src/entities/project.entities";
import Cardano from "src/layouts/cardano";
import Page from "src/layouts/page";

const Projects = () => {
  return (
    <Cardano>
      <Page>
        <>
          <p className="text-3xl">Explore TosiDrop Projects</p>
          <div className="flex flex-col gap-4">
            {sampleData.map((entry) => {
              return <Project projectData={entry}></Project>;
            })}
          </div>
        </>
      </Page>
    </Cardano>
  );
};

export default Projects;
