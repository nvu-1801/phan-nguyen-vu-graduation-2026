# ARCHITECTURE

## 1. Luồng dữ liệu

```
scroll native
   │
   ▼
ScrollTrigger.onUpdate ──► gsap.quickTo(proxy) ──► progressRef.current  (0..1)
   │                                                     │
   │                                                     ├──► CameraRig.useFrame
   │                                                     │      sample keyframes
   │                                                     │      damping theo delta
   │                                                     │      ghi camera.position / lookAt / fov
   │                                                     │      invalidate() nếu chưa hội tụ
   │                                                     │
   │                                                     └──► registry.setProgress (chỉ để debug)
   │
   └──► IntersectionObserver (dải giữa màn hình) ──► activeChapter (state, đổi khi đổi chương)
```

Không có `setState` nào trên đường chạy mỗi frame.

## 2. Quyền sở hữu

| Thuộc tính | Chủ sở hữu duy nhất | Ghi chú |
|---|---|---|
| Tiến độ cuộn | `ScrollScene` (GSAP) | ghi vào `progressRef`, không vào state |
| `camera.position`, `lookAt`, `fov` | `CameraRig` | `useFrame`; không GSAP nào chạm camera |
| Chương đang đọc | `ScrollScene` (IntersectionObserver) | state, tần suất thấp |
| `frameloop` | `SceneCanvas` | visible + tab visibility + failed |
| Trạng thái fallback | `ScrollScene` | `failed` / `lost` |
| CanvasTexture | `DeviceScreen` | tạo và dispose trong cùng một effect |
| Geometry thiết bị | demo (`SeaTripScene`) | `roundedBoxGeometry` + dispose |
| Geometry panel | `LayerStack` | `useMemo` + dispose |
| Số trigger/canvas | `registry` | `trackTrigger()` / `trackCanvas()` |

`CameraRig` từng set render mode; đã bỏ để tránh hai nơi cùng ghi một giá trị. Khi WebGL lỗi, canvas unmount và cleanup của nó ghi `idle` — vì vậy `ScrollScene` ghi đè bằng `fallback` sau đó. Đây là một bug thật đã bắt được bằng test.

## 3. Scheduling

- **Một** Canvas cho mỗi `ScrollScene`.
- `frameloop="demand"`: không có frame nào khi trang đứng yên.
- Frame được yêu cầu bởi: scroll đổi progress, và `CameraRig` khi damping chưa hội tụ.
- `frameloop="never"` khi stage ngoài viewport hoặc tab ẩn.
- DPR: desktop `[1, 2]`, mobile `[1, 1.5]`. Đo thực tế: DPR 2 → buffer 1270×1800 cho canvas 635×900.
- Không tạo geometry/material/texture trong `useFrame`. Tất cả tạo trong `useMemo`/`useEffect`.

## 4. Ma trận fallback

| Tình huống | Canvas | Poster | Nội dung + CTA | `render.mode` |
|---|---|---|---|---|
| Bình thường | mount | ẩn (opacity 0) | có | `running` |
| `prefers-reduced-motion: reduce` | không mount | hiện | có | `idle`, 0 trigger |
| WebGL không khả dụng | mount rồi lỗi → unmount | hiện | có | `fallback` |
| Mất context (`WEBGL_lose_context`) | giữ, dừng vẽ | hiện | có | `fallback` |
| Ngoài viewport / tab ẩn | giữ | theo trạng thái live | có | `paused` |
| Tắt JavaScript | không có | hiện (SSR) | có | — |

Poster được render từ server nên luôn có trong HTML đầu tiên. Đã kiểm chứng bằng test đọc HTML thô.

## 5. Cấu trúc file

```
src/
  app/
    layout.tsx                 font, metadata, import CSS
    globals.css                token site + giao diện site
    page.tsx                   landing (server component)
    lab/scroll-3d/
      page.tsx                 trang lab (server component)
      Scroll3DDemo.tsx         "use client" — ghép story + preset + scene
      SeaTripScene.tsx         nội dung 3D của demo + poster riêng
  content/
    site.ts                    tên, trạng thái, liên hệ (đang để trống có chủ ý)
    sea-trip.ts                story + hàm vẽ màn hình
  motion-kit/
    index.ts                   public exports
    types.ts                   CameraKeyframe, CameraPreset, Story, QualitySettings…
    camera.ts                  sample keyframes, giải khoảng cách từ aspect
    geometry.ts                rounded rect / rounded box
    fonts.ts                   đọc font stack từ CSS variable cho canvas
    registry.ts                đếm trigger/canvas, API debug
    scene-context.ts           progressRef / activeRef / invalidateRef
    MotionPreferences.tsx      prefers-reduced-motion, SSR-safe
    ScrollScene.tsx            layout, ScrollTrigger, chương, fallback state
    SceneCanvas.tsx            Canvas, DPR, gate render, context loss, error boundary
    CameraRig.tsx              chủ sở hữu camera
    DeviceScreen.tsx           texture vẽ bằng Canvas 2D
    LayerStack.tsx             panel chiều sâu
    StoryChapter.tsx           HTML semantic
    SceneFallback.tsx          poster
    DebugHud.tsx               HUD khi ?debug=1
    presets/travel.ts          bốn keyframe
    styles.css                 CSS scoped .mk-*
```

## 6. Dependency và lý do

| Package | Version | Lý do | Kiểm tra |
|---|---|---|---|
| `next` | 16.4.3 | App Router, SSG cho `/` và `/lab/scroll-3d` | `engines.node >= 20.9.0` ✓ (Node 22.21.0) |
| `react` / `react-dom` | 19.3.1 | Next 16 peer `^19.0.0` | ✓ |
| `three` | 0.187.0 | WebGL, geometry, camera | fiber cần `>=0.156` ✓ |
| `@react-three/fiber` | 9.8.2 | React renderer cho Three | peer `react >=19 <19.4` → 19.3.1 ✓ |
| `gsap` | 3.15.0 | ScrollTrigger, `quickTo`, `matchMedia` | license "Standard no charge" |
| `typescript` | 5.9.3 | **Không** dùng 7.0.2 | TS 7 là bản native mới, rủi ro với tooling Next/eslint |
| `@playwright/test` | 1.64.1 | Kiểm thử trình duyệt thật | dev only |
| `@types/three` | 0.187.0 | khớp three | |

**Không cài:** `@react-three/drei` (kéo mediapipe/hls/stats/three-mesh-bvh — không cần), `lenis`, `motion`, `babylonjs`.

Không dùng `--force` hay `--legacy-peer-deps`.

## 7. Quyết định và đánh đổi

1. **Sticky thay vì GSAP pin.** Đổi lại: không có pin-spacer, resize an toàn, nhưng phải giữ cho không ancestor nào có `overflow: hidden`.
2. **Keyframe theo `fill`/góc thay vì XYZ.** Đổi lại: bố cục đúng ở mọi aspect, nhưng preset không còn là toạ độ đọc trực tiếp được — debug HUD in toạ độ đã giải để bù.
3. **Không drei.** Đổi lại: phải tự viết rounded box và layer stack (~120 dòng), nhưng giảm mạnh dependency và thời gian cài.
4. **Texture procedural.** Đổi lại: màn hình là minh họa, không phải ảnh sản phẩm thật — đúng với nhãn "dự án minh họa".
5. **CSS toàn cục import một lần.** Đổi lại: người dùng kit phải import đúng thứ tự (kit trước, theme sau). Đã tăng specificity để giảm rủi ro.
6. **Một preset cho milestone này.** `enterprise`/`commerce` để Milestone 3 vì chưa có dữ liệu xác minh cho SDT/RunGear.

## 8. Giới hạn đã biết

- Breakpoint 900px: tablet 768 dùng bố cục compact (một cột, stage sticky 46svh).
- Chưa đo trên thiết bị thật. Số liệu hiệu năng lấy từ Chromium headless với SwiftShader (không GPU).
- Không có shadow map, không có environment map — thiết bị dùng metalness thấp để không bị đen.
- Chưa hỗ trợ WebGPU.
- Texture màn hình cố định 1024px, chữ do hệ điều hành rasterize.
- Chỉ có một câu chuyện (SEA TRIP). API đã sẵn cho nhiều story nhưng chưa có story thứ hai.
