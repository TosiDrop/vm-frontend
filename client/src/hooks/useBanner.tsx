import { useEffect, useState } from "react";
import { getBannerText } from "src/services/common";

export default function useBanner() {
  const [bannerText, setBannerText] = useState("");

  useEffect(() => {
    (async () => {
      const bannerText = await getBannerText();
      try {
        if (bannerText) {
          setBannerText(bannerText);
        }
      } catch (e) {}
    })();
  }, []);

  return {
    bannerText,
  };
}
