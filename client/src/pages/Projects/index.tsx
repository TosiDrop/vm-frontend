import Page from "src/layouts/page";
import { sampleData } from "./projectData";

import { RootState } from "src/store";
import { useSelector } from "react-redux";

function Projects() {
  const { theme } = useSelector((state: RootState) => state.global);

  return (
    <Page>
      <div className="text-3xl">
        Explore TosiDrop Projects
        <ul>
          {sampleData.map((entry) => {
            return <li>{entry.render(theme)}</li>;
          })}
        </ul>
      </div>
    </Page>
  );
}

export default Projects;
