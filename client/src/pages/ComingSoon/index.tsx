import Agnostic from "src/layouts/agnostic";
import Page from "src/layouts/page";

const ComingSoonPage = () => {
  return (
    <Agnostic>
      <Page>
        <div className="px-5 py-14 flex justify-center w-full mt-40">
          <h1 className="text-2xl">Coming Soon :)</h1>
        </div>
      </Page>
    </Agnostic>
  );
};

export default ComingSoonPage;
