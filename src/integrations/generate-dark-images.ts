import type {AstroIntegration} from 'astro';
import fs, {readdirSync, statSync} from 'fs';
import {basename, extname, join} from 'path';
import sharp from 'sharp';
import {excludeFromDarkImageProcessing} from '../config/images.config';

const supportedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
const forceMode = process.argv.includes('--force');
const threshold = 240;

const assetsDir = join(process.cwd(), 'src/assets');
const generatedDir = join(assetsDir, 'generated');

export default function generateDarkImages(): AstroIntegration {
    return {
        name: 'generate-dark-images',
        hooks: {
            'astro:build:setup': async () => {
                await generateImages();
            },
            'astro:server:start': async () => {
                await generateImages();
            }
        }
    };
}

async function generateImages() {
    await fs.promises.mkdir(generatedDir, {recursive: true});
    const files = getAllFiles(assetsDir);

    for (const filePath of files) {
        const ext = extname(filePath).toLowerCase();
        if (!supportedExtensions.includes(ext)) continue;

        const fileName = basename(filePath);
        if (
            fileName.includes('_dark') ||
            fileName.includes('_transparent') ||
            fileName.includes('_noinvert') ||
            excludeFromDarkImageProcessing.includes(fileName)
        ) continue;

        let processPath = filePath;
        let processExt = ext;
        let tempPngPath = '';
        // If JPG/JPEG, convert to PNG first
        if (ext === '.jpg' || ext === '.jpeg') {
            const base = basename(filePath, ext);
            tempPngPath = join(generatedDir, `${base}_temp.png`);
            await sharp(filePath).png().toFile(tempPngPath);
            processPath = tempPngPath;
            processExt = '.png';
        }

        const base = basename(filePath, ext); // Use original base for output names
        const transparentName = `${base}_transparent.png`;
        const darkName = `${base}_dark.png`;
        const transparentPath = join(generatedDir, transparentName);
        const darkPath = join(generatedDir, darkName);

        const supportsAlpha = true; // Now always true, since we process as PNG
        const needsTransparent = forceMode || !fileExists(transparentPath);
        const needsDark = forceMode || !fileExists(darkPath);

        try {
            const image = sharp(processPath);
            const {data, info} = await image.ensureAlpha().raw().toBuffer({resolveWithObject: true});

            const transparentData = Buffer.from(new Uint8Array(data));
            const darkData = Buffer.from(new Uint8Array(data));

            for (let i = 0; i < data.length; i += info.channels) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const a = info.channels === 4 ? data[i + 3] : 255;

                const isWhite = r > threshold && g > threshold && b > threshold;

                if (isWhite) {
                    transparentData[i + 3] = 0;
                    darkData[i + 3] = 0;
                } else {
                    darkData[i] = 255 - r;
                    darkData[i + 1] = 255 - g;
                    darkData[i + 2] = 255 - b;
                    if (info.channels === 4) darkData[i + 3] = a;
                }
            }

            if (needsTransparent) {
                await sharp(transparentData, {
                    raw: {
                        width: info.width,
                        height: info.height,
                        channels: info.channels
                    }
                })
                    .toFormat('png')
                    .toFile(transparentPath);
                console.log(`✅ Created ${transparentPath.replace(process.cwd() + '/', '')}`);
            }

            if (needsDark) {
                await sharp(darkData, {
                    raw: {
                        width: info.width,
                        height: info.height,
                        channels: info.channels
                    }
                })
                    .toFormat('png')
                    .toFile(darkPath);
                console.log(`✅ Created ${darkPath.replace(process.cwd() + '/', '')}`);
            }

            // Clean up temp PNG if created
            if (tempPngPath) {
                try {fs.unlinkSync(tempPngPath);} catch {}
            }
        } catch (err) {
            console.error(`❌ Failed to process ${filePath}:`, err);
        }
    }
}

function getAllFiles(dir: string): string[] {
    return readdirSync(dir).flatMap((file) => {
        const fullPath = join(dir, file);
        const stat = statSync(fullPath);
        return stat.isDirectory() ? getAllFiles(fullPath) : fullPath;
    });
}

function fileExists(path: string): boolean {
    try {
        return statSync(path).isFile();
    } catch {
        return false;
    }
}