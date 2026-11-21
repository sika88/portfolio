import BackgroundSlideshow from "@/components/BackgroundSlideshow";
import { getBackgrounds } from "@/lib/backgrounds";

export default async function Backgrounds() {
  const slots = await getBackgrounds();
  if (slots.length === 0) return null;
  return <BackgroundSlideshow slots={slots} />;
}