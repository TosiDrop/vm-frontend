export default function Connect({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="rounded-lg background flex items-center justify-center px-5 py-2.5 cursor-pointer"
      onClick={onClick}
    >
      <p>Connect</p>
    </div>
  );
}
