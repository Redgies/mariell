// Real silhouette videos with alpha channel. Each walks toward the camera.
// gender: 'm' | 'f' (for dossier name matching)
// System scales + translates them from back (small, top of frame) to
// front (large, exits bottom) on a loop.
const STOCK_VIDEOS = [
  { gender: 'm', type: 'walk',   src: 'uploads/silhouette-man-walking-alpha-channel-2026-02-18-08-51-05-utc.webm' },
  { gender: 'm', type: 'phone',  src: 'uploads/silhouette-man-walking-while-talking-on-phone-2026-02-18-08-04-49-utc.webm' },
  { gender: 'm', type: 'suit',   src: 'uploads/silhouette-of-a-business-man-walking-towards-camer-2026-02-18-05-33-31-utc.webm' },
  { gender: 'm', type: 'casual', src: 'uploads/silhouette-man-in-casual-walking-alpha-channel-2026-02-18-08-55-17-utc.webm' },
  { gender: 'm', type: 'coat',   src: 'uploads/silhouette-man-in-coat-walking-alpha-channel-2026-02-18-15-02-25-utc.webm' },
  { gender: 'm', type: 'doctor', src: 'uploads/silhouette-doctor-walking-alpha-channel-2026-02-18-15-12-53-utc.webm' },
  { gender: 'm', type: 'walk',   src: 'uploads/silhouette-scene-alpha-channel-2026-02-18-09-56-28-utc.webm' },
  { gender: 'f', type: 'walk',   src: 'uploads/silhouette-woman-walking-alpha-channel-2026-02-18-08-30-46-utc-fd22a4c8.webm' },
  { gender: 'f', type: 'suit',   src: 'uploads/silhouette-beautiful-sexy-brunette-woman-business-2026-02-18-13-34-33-utc (1).webm' },
  { gender: 'f', type: 'walk',   src: 'uploads/silhouette-woman-walking-alpha-channel-2026-02-18-04-54-50-utc (1).webm' },
  { gender: 'f', type: 'casual', src: 'uploads/silhouette-woman-walking-alpha-channel-2026-02-18-07-42-12-utc (1).webm' },
];
