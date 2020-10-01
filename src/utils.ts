import { count } from "console";

interface Ifrontmatter {
  [key: string]: string
}

/**
 * @description Function which separates front matter from body
 */
export const getFrontmatter = (text: string) => {
  // Separate frontmatter by `---`
  const sections = text.split(`---\r\n`);
  const body: string = sections[2];
  // Split frontmatter properties apart by line breaks
  const frontArr = sections[1].split(`\r\n`);
  // Create empty object to hold frontmatter items
  const frontmatter: Ifrontmatter = {};
  // Loop through each line and get the key/value pair
  for(let i=0; i < frontArr.length; i++) {
    if (frontArr[i] !== '') {
      const arr = frontArr[i].split(`:`);
      const key: string = arr[0].trim();
      const val: string = arr[1].trim();
      // If key/value, add to frontmatter object
      frontmatter[key] = val;
    }
  }
  return {frontmatter, body};
}

/**
 * @description Look to see if the keywords are in the title
 * @param fm object
 */
export const checkSeoKeywords = (test: string, keywords: string) => {
  // Separate keywords if more than one
  const k = keywords.split(',');
  // Loop through each keywords to check in title
  for(let i=0; i < k.length; i++) {
    if (k[i].trim() !== '' && test.toLowerCase().includes(k[i].toLowerCase())) return true;
  }
  return false;
}

/**
 * @description Check and return word count
 * @param text
 */
export const countWords = (text: string) => {
  const noNewLine = text.replace(/(\r\n)+|\r+|\n+|\t+/g, ` `);
  const noHeadings = noNewLine.replace(/(\#+)\s/g, ` `);
  const length = noHeadings.split(' ').filter(i => i !== '').length;
  return length;
}

/**
 * @description Count the number of times the keywords appear
 * @param text
 * @param keywords
 */
export const countKeywords = (text: string, keywords: string) => {
  const keys = keywords.split(',');
  let count = 0;
  for (let i=0; i < keys.length; i++) {
    const k = new RegExp(keys[i], 'gi');
    count += (text.match(k) || []).length;
  }
  return count;
}

/**
 * @description Check for alt tags
 * @param text
 */
export const checkAltTags = (text: string) => {
  const imgs = text.match(/(\!\[(.+)?\]\((.+)?\))/gi) || [];
  let errors = [];
  for (let i=0; i < imgs.length; i++) {
    const start = imgs[i].indexOf('![') + 2;
    const end = imgs[i].indexOf('](');
    const length = end - start;
    if (length < 1) errors.push(imgs[i]);
  }
  return errors;
}

/**
 * @description Count the number of a given heading
 * @param text
 * @param heading
 */
export const countHeadings = (text: string, heading: string) => {
  let type = parseInt(heading[1]);
  const search = new RegExp("(\s\#{" + type + "}\s)", `g`);
  const count = text.match(search) || [];
  
  console.log(count.length, search.global);
  return count;
}