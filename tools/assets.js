import sharp from 'sharp';
import { join } from 'node:path';
import { statSync } from 'node:fs';

export async function optimizeAssets(sourceDir, outDir) {
    let original = 0;
    let fullSize = 0;
    for (const name of ['hero-way', 'practice-rock', 'practice-path']) {
        const input = join(sourceDir, 'assets', name + '.png');
        original += statSync(input).size;
        for (const [suffix, width] of [['', 1280], ['-small', 640]]) {
            const output = join(outDir, 'assets', name + suffix + '.webp');
            await sharp(input).resize({width, withoutEnlargement:true}).webp({quality:85, alphaQuality:100, effort:5}).toFile(output);
            if (!suffix) fullSize += statSync(output).size;
        }
    }
    console.log('  Artwork: ' + Math.round(original / 1024) + ' KB → ' + Math.round(fullSize / 1024) + ' KB (full-size WebP)');
}
