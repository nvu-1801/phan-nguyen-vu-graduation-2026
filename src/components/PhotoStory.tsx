import { Portrait } from "@/components/Portrait";
import { photosAvailable } from "@/content/photos.generated";
import { PhotoStage } from "./PhotoStage";

export function PhotoStory() {
  return <section className="story" aria-labelledby="story-title">
    <div className="wrap story-intro">
      <p className="overline"><span className="dot" /> Hành trình</p>
      <h2 id="story-title">Giữ lại chút <em>thanh xuân.</em></h2>
    </div>
    <PhotoStage enabled={photosAvailable}>
      <div className="postcards">
        <figure><Portrait id="9516" /><figcaption>Những ngày đã qua</figcaption></figure>
        <figure><Portrait id="9505" /><figcaption>Ngày mình gặp nhau</figcaption></figure>
      </div>
    </PhotoStage>
    <div className="wrap story-captions">
      <p>Có những ngày rất bình thường, đến khi nhìn lại mới biết đó là kỷ niệm.</p>
      <p>Tấm ảnh đẹp nhất hôm ấy sẽ là tấm ảnh có thêm bạn.</p>
    </div>
  </section>;
}
