import { DashboardItemData } from "src/entities/common.entities";

const DashboardItem = ({
  title,
  content,
  contentSuffix,
}: DashboardItemData) => {
  let suffix = contentSuffix ? " " + contentSuffix : "";
  let parsedContent = "?";
  if (content) {
    parsedContent = content.toLocaleString() + suffix;
  }

  return (
    <div className="h-48 rounded-2xl background px-5 py-5 flex flex-col items-center">
      <div className="text-lg sm:text-xl lg:text-2xl grow flex justify-center items-center text-center">
        {title}
      </div>
      <div className="text-xl sm:text-2xl lg:text-4xl grow flex justify-center items-center text-center break-all">
        {parsedContent}
      </div>
    </div>
  );
};

export default DashboardItem;
