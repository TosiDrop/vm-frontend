import { useSelector } from "react-redux";
import { Themes } from "src/entities/common.entities";
import { ProjectLogos } from "src/entities/project.entities";
import { RootState } from "src/store";

const Logo = ({ projectLogos }: { projectLogos: ProjectLogos }) => {
  const theme = useSelector((state: RootState) => state.global.theme);

  let logo = projectLogos.logoDefault;
  let compactLogo = projectLogos.logoCompact ?? projectLogos.logoDefault;
  if (theme === Themes.dark) {
    if (projectLogos.logoDark) logo = projectLogos.logoDark;
    if (projectLogos.logoCompactDark)
      compactLogo = projectLogos.logoCompactDark;
  }

  return (
    <div>
      <img alt="logo" src={logo} className="logo hidden sm:block"></img>
      <img alt="logo" src={compactLogo} className="logo sm:hidden"></img>
    </div>
  );
};

export default Logo;
