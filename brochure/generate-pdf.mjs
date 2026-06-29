import puppeteer from 'puppeteer';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

function runDownload() {
  return new Promise((resolve, reject) => {
    const child = spawn('node', ['download-images.mjs'], { cwd: __dirname, stdio: 'inherit', shell: true });
    child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`download exited ${code}`))));
  });
}

async function main() {
  try {
    await import('fs/promises').then((fs) => fs.access(join(__dirname, 'images', 'cover.jpg')));
  } catch {
    console.log('Downloading brochure images...');
    await runDownload();
  }

  const htmlPath = join(__dirname, 'brochure.html');
  const outputPath = join(__dirname, 'Wakapadi-Womens-Zanzibar-Retreat-2027.pdf');
  const tempPath = join(__dirname, 'Wakapadi-Womens-Zanzibar-Retreat-2027.tmp.pdf');
  const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 120000 });
  await page.emulateMediaType('print');
  await page.pdf({
    path: tempPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  await browser.close();

  const { rename, copyFile, unlink } = await import('fs/promises');
  try {
    await unlink(outputPath);
  } catch {
    /* previous file may not exist or be locked */
  }
  try {
    await rename(tempPath, outputPath);
    console.log(`PDF created: ${outputPath}`);
  } catch {
    const fallback = join(__dirname, 'Wakapadi-Womens-Zanzibar-Retreat-2027-updated.pdf');
    await copyFile(tempPath, fallback);
    await unlink(tempPath);
    console.log(`PDF created (original was locked): ${fallback}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
