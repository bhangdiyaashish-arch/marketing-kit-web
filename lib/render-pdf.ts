import puppeteer from 'puppeteer';

export async function renderPDF(html: string): Promise<Buffer> {
  // Puppeteer automatically reads PUPPETEER_EXECUTABLE_PATH from the environment.
  // Azure App Settings may inject a stale Windows path — clear it so Puppeteer
  // uses its own bundled Chromium (downloaded during npm ci).
  delete process.env.PUPPETEER_EXECUTABLE_PATH;

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--font-render-hinting=none',
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    await page.setContent(html, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000,
    });
    await page.waitForFunction(() => document.fonts.ready, { timeout: 15000 })
      .catch(() => {/* fonts timeout — continue */});
    await new Promise(r => setTimeout(r, 800));

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      preferCSSPageSize: true,
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
