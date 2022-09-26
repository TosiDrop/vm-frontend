import Page from "src/layouts/page";
import { ProjectData, ProjectURLs, sampleData } from "./projectData";

import { Themes } from "src/entities/common.entities";
import { RootState } from "src/store";
import { useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faDiscord,
  faTelegram,
  faMedium,
} from "@fortawesome/free-brands-svg-icons";

function Projects() {
  return (
    <Page>
      <div className="text-3xl">
        Explore TosiDrop Projects
        <ul>
          {sampleData.map((entry) => {
            return <li>{RenderProjectButton(entry)}</li>;
          })}
        </ul>
      </div>
    </Page>
  );
}

function RenderProjectButton(data: ProjectData): JSX.Element {
  const { theme } = useSelector((state: RootState) => state.global);
  let logo =
    theme === Themes.dark && data.logoDark ? data.logoDark : data.logoDefault;
  let compactLogo = data.logoCompact ?? data.logoDefault;

  return (
    <div className="rounded-2xl background px-2.5 py-2.5 mt-5 mb-5 items-center text-base text-left flex flex-wrap md:flex-row">
      <div className="basis-7/12 flex flex-row grow items-center">
        <div className="m-2.5 p-2.5 basis-3/12">
          <img src={logo} className="logo hidden sm:block"></img>
          <img src={compactLogo} className="logo sm:hidden"></img>
        </div>
        <div className="m-2.5 p-2.5 basis-9/12 grow md:border-r">
          {data.descShort}
        </div>
      </div>

      <div className="basis-5/12 flex flex-row grow items-center">
        <div className="m-2.5 p-2.5 basis-1/4 ">
          <div>Token:</div>
          <div className="font-bold">{data.token}</div>
        </div>
        <div className="m-2.5 p-2.5 basis-1/4 ">
          <div>Total Supply:</div>
          <div className="font-bold text-sm">
            {data.totalSupply.toLocaleString("en-US")}
          </div>
        </div>
        <div className="m-2.5 p-2.5 basis-2/4 text-2xl">
          {RenderProjectURLLinks(data.urls)}
        </div>
      </div>
    </div>
  );
}

function RenderProjectURLLinks(urls: ProjectURLs): JSX.Element[] {
  var elements: JSX.Element[] = [];
  if (urls.medium) {
    elements.push(
      <a href={urls.medium} className="text-medium m-1">
        <FontAwesomeIcon icon={faMedium} />
      </a>
    );
  }
  if (urls.twitter) {
    elements.push(
      <a href={urls.twitter} className="text-twitter m-1">
        <FontAwesomeIcon icon={faTwitter} />
      </a>
    );
  }
  if (urls.discord) {
    elements.push(
      <a href={urls.discord} className="text-discord m-1">
        <FontAwesomeIcon icon={faDiscord} />
      </a>
    );
  }
  if (urls.telegram) {
    elements.push(
      <a href={urls.telegram} className="text-telegram m-1">
        <FontAwesomeIcon icon={faTelegram} />
      </a>
    );
  }
  /*if (urls.cardanoExplorer) {
    elements.push(<a href={urls.cardanoExplorer}><img src=""/></a>);
  }
  if (urls.poolpm) {
    elements.push(<a href={urls.poolpm}><img src=""/></a>);
  }*/
  return elements;
}

export default Projects;
