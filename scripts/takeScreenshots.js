const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Desktop View
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log('Navigating to http://[::1]:5173 ...');
    await page.goto('http://[::1]:5173', { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait an extra 2 seconds for any animations or lazy-loaded images
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const desktopPath = path.join(__dirname, 'home_desktop.png');
    await page.screenshot({ path: desktopPath, fullPage: true });
    console.log(`Saved desktop screenshot to ${desktopPath}`);

    // Mobile View
    await page.setViewport({ width: 375, height: 812 }); // iPhone X
    const mobilePath = path.join(__dirname, 'home_mobile.png');
    await page.screenshot({ path: mobilePath, fullPage: true });
    console.log(`Saved mobile screenshot to ${mobilePath}`);

    await browser.close();
  } catch (err) {
    console.error('Error taking screenshots:', err);
    process.exit(1);
  }
})();
