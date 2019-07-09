const puppeteer = require("puppeteer");

const createPage = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on("console", console.log);

  return page;
};
const getMetaTags = async page => {
  const metaTags = await page.evaluate(() => {
    const getPropertyNames = name => {
      const normalizedName = name.replace("og:", "");

      return normalizedName.split(":");
    };
    const getPropertyPath = (names, value, accum = {}) => {
      const isFirst = Object.keys(accum).length === 0;

      if (names.length === 0) {
        return value;
      }
      if (names.length === 1) {
        if (isFirst) {
          return value;
        }

        return accum;
      }

      const name = names.pop();
      const obj = Object.assign({}, accum, {
        [name]: value
      });

      return getPropertyPath(names, value, obj);
    };

    const elements = document.querySelectorAll('meta[property^="og:"]');
    console.log(elements);
    const data = Array.from(elements).reduce((prev, element) => {
      const propertyName = element.getAttribute("property");
      const names = getPropertyNames(propertyName);
      const name = names[0];
      const value = element.getAttribute("content");
      const path = getPropertyPath([...names], value, prev[name]);

      prev[name] = path;

      return prev;
    }, {});

    return data;
  });

  return metaTags;
};

const getMeta = async siteUrl => {
  const page = await createPage();

  await page.goto(siteUrl);

  const metaTags = getMetaTags(page);

  return metaTags;
};

const getMetaFromHtml = async html => {
  const page = await createPage();

  await page.setContent(html);

  const metaTags = getMetaTags(page);

  return metaTags;
};

module.exports = { getMeta, getMetaFromHtml };
