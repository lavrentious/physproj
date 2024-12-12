export const poolColors = {
  table: 0x155843,
  // tableBorder: 0x966F33,
  tableBorder: 0x3f1710,
  cueBallColor: 0xffffff, // cue ball
  balls: [
    0xff5733, // vivid orange
    0xffc300, // bright yellow
    0x900c3f, // deep magenta
    0x2980b9, // strong blue
    0x27ae60, // lush green
    0x8e44ad, // rich purple
    0xe74c3c, // vibrant red
    0xf1c40f, // sunflower
    0xffb31a, // bright orange
    0xff99cc, // soft pink
    0x99ccff, // pale blue
    0x99ffcc, // pale green
    0xff9999, // soft red
    0xffcc99, // soft orange
    0xff66ff, // pastel pink
  ],
};

export function strikeColor(distance: number, maxDistance: number) {
  const clampedDistance = Math.min(Math.max(distance, 0), maxDistance);
  const strengthRatio = clampedDistance / maxDistance;
  const red = Math.floor(255 * strengthRatio);
  const green = Math.floor(255 * (1 - strengthRatio));
  const blue = 0;

  // Convert to hex color string
  return `rgb(${red}, ${green}, ${blue})`;
}
