import logo from "src/assets/tosidrop_logo.png";
import Page from "src/layouts/page";
import './index.scss'

const Loading = () => {
  return (
    <Page>
      <div className="px-5 py-14 pt-40 flex flex-col items-center justify-center">
        <div className="w-24 mb-5 spinning-logo">
          <img src={logo} alt="tosidrop logo"></img>
        </div>
        <div>Loading...</div>
      </div>
    </Page>
  );
};

export default Loading;
