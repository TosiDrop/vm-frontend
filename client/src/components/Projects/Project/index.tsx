import { ProjectData } from "src/entities/project.entities";
import Logo from "../Logo";
import URLs from "../URLs";

const Project = ({ projectData }: { projectData: ProjectData }) => {
  return (
    <div className="rounded-2xl background px-2.5 py-2.5 items-center text-base flex flex-col lg:flex-row lg:gap-6">
      <div className="m-2.5 p-2.5 flex grow w-full items-center gap-6 basis-7/12">
        <div className="basis-3/12">
          <Logo projectLogos={projectData.logos}></Logo>
        </div>
        <div className="basis-9/12 w-full">{projectData.descs.descShort}</div>
      </div>

      <hr className="hidden lg:block lg:h-16 lg:border-r" />

      <div className="m-2.5 p-2.5 flex flex-row container items-center gap-6 basis-5/12">
        <div className="basis-1/4">
          <span>Token:</span>
          <div className="font-bold">{projectData.token.token}</div>
        </div>
        <div className="basis-1/4">
          <span className="truncate">Total Supply:</span>
          <div className="font-bold">
            {projectData.token.totalSupply?.toLocaleString("en-US") ?? "?"}
          </div>
        </div>
        <div className="text-lg basis-2/4">
          <URLs projectURLs={projectData.urls}></URLs>
        </div>
      </div>
    </div>
  );
};

export default Project;
