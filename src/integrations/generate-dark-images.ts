import type { AstroIntegration } from 'astro';
import fs, { readdirSync, statSync } from 'fs';
import { basename, extname, join } from 'path';
import sharp from 'sharp';
import { excludeFromDarkImageProcessing } from '../config/images.config';

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
    await fs.promises.mkdir(generatedDir, { recursive: true });
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

        const base = basename(filePath, ext);
        const transparentName = `${base}_transparent${ext}`;
        const darkName = `${base}_dark${ext}`;
        const transparentPath = join(generatedDir, transparentName);
        const darkPath = join(generatedDir, darkName);

        const needsTransparent = forceMode || !fileExists(transparentPath);
        const needsDark = forceMode || !fileExists(darkPath);

        try {
            const image = sharp(filePath);
            const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

            const transparentData = Buffer.from(data);
            const darkData = Buffer.from(data);

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
                    // Keep original grayscale for _transparent
                    // Invert RGB for _dark
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
                    .toFormat(ext.slice(1) as keyof sharp.FormatEnum)
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
                    .toFormat(ext.slice(1) as keyof sharp.FormatEnum)
                    .toFile(darkPath);

                console.log(`✅ Created ${darkPath.replace(process.cwd() + '/', '')}`);
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