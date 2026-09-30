const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const inputPath = path.join(
    __dirname,
    "thermal-logo.png"
);

const outputPath = path.join(
    __dirname,
    "thermalLogo.js"
);

// Change this if your printer uses a different
// printable width.
const TARGET_WIDTH = 384;

async function convertLogo() {
    if (!fs.existsSync(inputPath)) {
        throw new Error(
            `Logo not found: ${inputPath}`
        );
    }

    console.log("Loading thermal logo...");

    const { data, info } = await sharp(inputPath)
        .resize({
            width: TARGET_WIDTH,
            withoutEnlargement: true,
        })
        .flatten({
            background: "#ffffff",
        })
        .grayscale()
        .threshold(180)
        .raw()
        .toBuffer({
            resolveWithObject: true,
        });

    const width = info.width;
    const height = info.height;

    // ESC/POS raster format requires
    // 8 horizontal pixels per byte.
    const widthBytes = Math.ceil(width / 8);

    const rasterData = new Uint8Array(
        widthBytes * height
    );

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const pixel =
                data[y * width + x];

            // Black pixel
            if (pixel < 128) {
                const byteIndex =
                    y * widthBytes +
                    Math.floor(x / 8);

                const bit =
                    7 - (x % 8);

                rasterData[byteIndex] |=
                    1 << bit;
            }
        }
    }

    const header = new Uint8Array([
        0x1d,
        0x76,
        0x30,
        0x00,

        widthBytes & 0xff,
        (widthBytes >> 8) & 0xff,

        height & 0xff,
        (height >> 8) & 0xff,
    ]);

    const result = new Uint8Array(
        header.length + rasterData.length
    );

    result.set(header, 0);
    result.set(
        rasterData,
        header.length
    );

    const output = `export const THERMAL_LOGO = new Uint8Array([
${Array.from(result)
    .map(
        (byte, index) =>
            `    0x${byte
                .toString(16)
                .padStart(2, "0")}${(index + 1) % 16 === 0 ? "," : ","}`
    )
    .join("\n")}
]);

export default THERMAL_LOGO;
`;

    fs.writeFileSync(
        outputPath,
        output,
        "utf8"
    );

    console.log(
        `Logo converted successfully.`
    );

    console.log(
        `Size: ${width}x${height}px`
    );

    console.log(
        `Raster bytes: ${rasterData.length}`
    );

    console.log(
        `Output: ${outputPath}`
    );
}

convertLogo().catch((error) => {
    console.error(
        "Failed to convert thermal logo:"
    );
    console.error(error);
    process.exit(1);
});