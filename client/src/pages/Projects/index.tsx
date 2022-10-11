import Page from "src/layouts/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faDiscord,
  faTelegram,
  faMedium,
} from "@fortawesome/free-brands-svg-icons";
import { Themes } from "src/entities/common.entities";
import {
  sampleData,
  ProjectData,
  ProjectLogos,
  ProjectURLs,
} from "src/entities/project.entities";

import { RootState } from "src/store";
import { useSelector } from "react-redux";

const Projects = () => {
  const { theme } = useSelector((state: RootState) => state.global);

  const renderProject = (projectData: ProjectData) => {
    return (
      <div className="rounded-2xl background px-2.5 py-2.5 mt-5 mb-5 items-center text-base text-left flex flex-wrap md:flex-row">
        <div className="basis-7/12 flex flex-row grow items-center">
          <div className="m-2.5 p-2.5 basis-3/12">
            {renderProjectLogos(projectData.logos)}
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
            {/*<span style={{ whiteSpace: "nowrap"}}>Total Supply:</span>*/}
            <span className="truncate">Total Supply:</span>
            <div className="font-bold text-sm">
              {projectData.token.totalSupply?.toLocaleString("en-US") ?? "?"}
            </div>
          </div>
          <div className="m-2.5 p-2.5 basis-2/4 text-2xl">
            {renderProjectURLs(projectData.urls)}
          </div>
        </div>
      </div>
    );
  };

  const renderProjectLogos = (projectLogos: ProjectLogos) => {
    let logo = projectLogos.logoDefault;
    let compactLogo = projectLogos.logoCompact ?? projectLogos.logoDefault;
    if (theme === Themes.dark) {
      if (projectLogos.logoDark) logo = projectLogos.logoDark;
      if (projectLogos.logoCompactDark)
        compactLogo = projectLogos.logoCompactDark;
    }
    return (
      <div>
        <img src={logo} className="logo hidden sm:block"></img>
        <img src={compactLogo} className="logo sm:hidden"></img>
      </div>
    );
  };

  const renderProjectURLs = (projectURLs: ProjectURLs) => {
    var elements: JSX.Element[] = [];
    if (projectURLs.medium) {
      elements.push(
        <a href={projectURLs.medium} className="text-medium m-1">
          <FontAwesomeIcon icon={faMedium} />
        </a>
      );
    }
    if (projectURLs.twitter) {
      elements.push(
        <a href={projectURLs.twitter} className="text-twitter m-1">
          <FontAwesomeIcon icon={faTwitter} />
        </a>
      );
    }
    if (projectURLs.discord) {
      elements.push(
        <a href={projectURLs.discord} className="text-discord m-1">
          <FontAwesomeIcon icon={faDiscord} />
        </a>
      );
    }
    if (projectURLs.telegram) {
      elements.push(
        <a href={projectURLs.telegram} className="text-telegram m-1">
          <FontAwesomeIcon icon={faTelegram} />
        </a>
      );
    }
    /*if (projectURLs.cardanoScan) {
      elements.push(<a href={projectURLs.cardanoScan}><img src=""/></a>);
    }
    if (projectURLs.poolpm) {
      elements.push(<a href={projectURLs.poolpm}><img src=""/></a>);
    }*/
    return elements;
  };

  return (
    <Page>
      <div className="text-3xl">
        Explore TosiDrop Projects
        <ul>
          {sampleData.map((entry) => {
            return <li>{renderProject(entry)}</li>;
          })}
        </ul>
      </div>
    </Page>
  );
};

export default Projects;
