import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

(async function example() {
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(
      new chrome.Options().addArguments(
        '--headless',
        '--no-sandbox',
        '--disable-dev-shm-usage'
      )
    )
    .build();

  try {
    console.log('Navigating to homepage...');
    await driver.get('http://localhost:3000');

    const title = await driver.getTitle();
    console.log('Page title is:', title);

    if (!title || title.length === 0) {
      throw new Error('Title check failed. No title found.');
    }

    console.log('E2E Test Passed!');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  } finally {
    await driver.quit();
  }
})();
