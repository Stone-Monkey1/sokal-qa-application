async function navbarFormTitle(page) {
    const url = page.url();
  
    try {
      await page.waitForLoadState("domcontentloaded");
  
      const forms = await page.$$('form');
      const formDetails = {};
      let hasStreakForm = false;
  
      for (const form of forms) {
        const className = await form.getAttribute('class');
        if (className && className.split(/\s+/).includes('streakform')) {
          hasStreakForm = true;
        }
  
        const inputs = await form.$$('input[name][value]');
        for (const input of inputs) {
          const name = await input.getAttribute('name');
          const value = await input.getAttribute('value');
          if (name && value) {
            formDetails[name] = value;
          }
        }
      }
  
      console.log(`Form inputs for ${url}:`, Object.keys(formDetails).length > 0 ? formDetails : 'No matching input fields found');
      console.log(`Contains .streakform class: ${hasStreakForm}`);
  
      return {
        [url]: {
          formInputTitles: Object.keys(formDetails).length > 0 ? formDetails : "No matching input fields found",
          hasStreakForm
        }
      };
    } catch (error) {
      console.error(`Error loading ${url}:`, error.message);
      return { [url]: { error: `Error loading page: ${error.message}` } };
    }
  }
  
  module.exports = navbarFormTitle;