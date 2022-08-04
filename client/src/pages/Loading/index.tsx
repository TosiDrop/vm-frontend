import logo from "src/assets/tosidrop_logo.png";
import "./index.scss";

const CLASS = "loading-page";

const Loading = () => {
    return (
        <div className="px-5 py-14 pt-40 flex flex-col items-center justify-center">
            <div className="w-24 mb-5 spinning-logo">
                <img src={logo} alt="tosidrop logo"></img>
            </div>
            <div>Loading...</div>
        </div>
    );
};

export default Loading;
