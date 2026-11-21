import { Portrait } from "@/components/Portrait";
import { photosAvailable } from "@/content/photos.generated";
import { PhotoStage } from "./PhotoStage";

export function PhotoStory() {
  return <section className="story" aria-labelledby="story-title">
    <div className="wrap story-intro">
      <h2 id="story-title">Một tấm ảnh để nhớ</h2>
    </div>
    <PhotoStage enabled={photosAvailable}>
      <div className="postcards">
        <figure><Portrait id="9516" /><figcaption>Những ngày đã qua</figcaption></figure>
        <figure><Portrait id="9505" /><figcaption>Ngày mình gặp nhau</figcaption></figure>
      </div>
    </PhotoStage>
    <div className="wrap story-captions">
      <p>Hôm ấy, mình muốn có một tấm hình cùng bạn. Sau này xem lại, mình sẽ còn nhớ mình đã chia sẻ ngày này với ai.</p>
    </div>
  </section>;
}
