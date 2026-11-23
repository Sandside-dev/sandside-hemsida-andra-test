import sharp from "sharp";

const names = ["oscar", "axel", "armin", "william", "eskil"];

await Promise.all(
  names.map((name, index) =>
    sharp(`tmp/portraits/portrait-${index + 1}.jpg`)
      .resize(800, 1000, { fit: "cover", position: "attention" })
      .modulate({ saturation: 0.84, brightness: 1.02 })
      .webp({ quality: 82 })
      .toFile(`public/images/team/${name}.webp`),
  ),
);

console.log("Team portraits optimized to 800×1000 WebP.");
