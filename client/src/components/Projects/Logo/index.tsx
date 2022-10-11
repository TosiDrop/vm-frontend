import { Themes } from "src/entities/common.entities";
import {
    ProjectLogos,
} from "src/entities/project.entities";
import { RootState } from "src/store";
import { useSelector } from "react-redux";

const Logo = ({ projectLogos }: { projectLogos: ProjectLogos }) => {
    const { theme } = useSelector((state: RootState) => state.global);

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

export default Logo;
