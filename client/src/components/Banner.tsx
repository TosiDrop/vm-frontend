import useBanner from "src/hooks/useBanner";

export default function Banner() {
  const { bannerText } = useBanner();

  return bannerText ? (
    <div className="background-see-through p-2.5 w-full text-center">
      {bannerText}
    </div>
  ) : null;
}
