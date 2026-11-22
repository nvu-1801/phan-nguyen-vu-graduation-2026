import { copy } from "@/content/copy";
import { Portrait } from "@/components/Portrait";
import { photosAvailable } from "@/content/photos.generated";
import { PhotoStage } from "./PhotoStage";

export function PhotoStory() {
  return <section className="story" aria-labelledby="story-title">
    <div className="story-watermark" aria-hidden="true" />
    <div className="wrap story-intro" data-reveal>
      <p className="eyebrow">03 / GIỮ LẠI THANH XUÂN</p>
      <h2 id="story-title">Để dành một tấm ảnh <em>có bạn.</em></h2>
    </div>
    <PhotoStage enabled={photosAvailable}>
      <div className="postcards">
        <figure><Portrait id="9516" /><figcaption>Những ngày đã qua</figcaption></figure>
        <figure><Portrait id="9505" /><figcaption>Ngày mình gặp nhau</figcaption></figure>
      </div>
    </PhotoStage>
    <div className="wrap story-captions">
      <p>{copy.photo}</p>
    </div>
  </section>;
}
