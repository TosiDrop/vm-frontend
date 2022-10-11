import { Themes } from "src/entities/common.entities";
import {
  ProjectData,
} from "src/entities/project.entities";
import URLs from "../URLs"
import Logo from "../Logo"

const Project = ({ projectData } : {projectData : ProjectData}) => {
     return (
        <div className="rounded-2xl background px-2.5 py-2.5 mt-5 mb-5 items-center text-base text-left flex flex-wrap md:flex-row">
          <div className="basis-7/12 flex flex-row grow items-center">
            <div className="m-2.5 p-2.5 basis-3/12">
              <Logo projectLogos={projectData.logos}></Logo>
            </div>
            <div className="m-2.5 p-2.5 basis-9/12 grow md:border-r">
              {projectData.descs.descShort}
            </div>
          </div>
  
          <div className="basis-5/12 flex flex-row grow items-center">
            <div className="m-2.5 p-2.5 basis-1/4 ">
              <span>Token:</span>
              <div className="font-bold">{projectData.token.token}</div>
            </div>
            <div className="m-2.5 p-2.5 basis-1/4 ">
              <span className="truncate">Total Supply:</span>
              <div className="font-bold text-sm">
                {projectData.token.totalSupply?.toLocaleString("en-US") ?? "?"}
              </div>
            </div>
            <div className="m-2.5 p-2.5 basis-2/4 text-2xl">
              <URLs projectURLs={projectData.urls}></URLs>
            </div>
          </div>
        </div>
    );
};

export default Project;
