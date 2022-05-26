import logo from "src/assets/tosidrop_logo.png";
import "./index.scss";

const CLASS = "loading-page";

const Loading = () => {
    return (
        <div className={`page ${CLASS}`}>
            <div className={`${CLASS}__logo`}>
                <img src={logo} alt="tosidrop logo"></img>
            </div>
            <div>Loading...</div>
        </div>
    );
};

export default Loading;
