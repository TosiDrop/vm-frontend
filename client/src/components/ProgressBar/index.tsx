const barStyleWidth = (percentage: number) => {
  // Minimum 2% so it doesn't look weird when at < 2%
  return { width: Math.max(2, percentage * 100) + "%" };
};

const ProgressBar = ({ percentage }: { percentage: number }) => {
  return (
    <div className="w-full bg-gray-700 rounded-full h-5">
      <div
        className="bg-green-500 h-5 rounded-full w-4"
        style={barStyleWidth(percentage)}
      ></div>
    </div>
  );
};

export default ProgressBar;
