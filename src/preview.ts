import { ExtensionContext, Uri, window } from 'vscode';
import * as path from 'path';
import {
  getFrontmatter,
  checkSeoKeywords,
  countWords,
  countKeywords,
  checkAltTags,
  countHeadings,
} from './utils';

export const previewDoc = (context: ExtensionContext) => {
  const editor = window.activeTextEditor;
  const doc = editor?.document;
  const content = doc?.getText() || ``;
  const { frontmatter: fm, body } = getFrontmatter(content);
  const styleSrc = Uri.file(path.join(context.extensionPath, '/src/style.css')).with({ scheme: 'vscode-resource' });
console.log(content);
  const titleKeys = checkSeoKeywords(fm.title, fm.seo_keywords);
  const seoTitleKeys = checkSeoKeywords(fm.seo_title, fm.seo_keywords);
  const seoTitleLen = fm.seo_title.length;
  const seoDescKeys = checkSeoKeywords(fm.seo_description, fm.seo_keywords);
  const seoDescLen = fm.seo_description.length;
  const bodyKeyCount = countKeywords(body, fm.seo_keywords);
  const bodyWordCount = countWords(body);
  const bodyAltTags = checkAltTags(body);
  const bodyCountH1 = countHeadings(body, 'h2');

  const serpTitle = seoTitleLen > 60 ? `${fm.seo_title.substr(0, 59)}...` : fm.seo_title;
  const serpDesc = seoDescLen > 140 ? `${fm.seo_description.substr(0, 139)}...` : fm.seo_description;
  const twitterSrc = Uri.file(path.join(context.extensionPath, '/src/images/mossishere.jpg')).with({ scheme: 'vscode-resource' });

  return `<!DOCTYPE html>
		<html lang="en">
		<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cat Coding</title>
        <link rel="stylesheet" type="text/css" href="${styleSrc}">
		</head>
    <body>

        <h1>SEO TOOLS</h1>
        <p><strong>SEO Title:</strong> ${fm.seo_title ? fm.seo_title : `You still need to add your seo_title in the frontmatter.`}</p>
        <p><strong>SEO Description:</strong> ${fm.seo_description}</p>
        <p><strong>SEO Keywords:</strong> ${fm.seo_keywords}</p>
        <p><strong>Word Count:</strong> ${bodyWordCount}
        <hr />

        <h3>Analysis</h3>
        <ul>

        <li class="${titleKeys ? 'success' : 'error'}">
          ${titleKeys ?
      `Your keywords are present in your Title.` :
      `You need to include at least one keyword in the title`}
        </li>

          <li class="${seoTitleKeys ? 'success' : 'error'}">
            ${seoTitleKeys ?
      `Your keywords are present in your SEO Title.` :
      `You need to include at least one keyword in the seo_title`}
          </li>
          <li class="${seoTitleLen > 49 && seoTitleLen < 61 ? 'success' : 'error'}">
            ${seoTitleLen > 60 ?
      `Your SEO Title is too long. Try shortening it to a maximum of 60 characters` :
      seoTitleLen > 49 ?
        `Your SEO Title is ${seoTitleLen} characters long which is between the recommended 50-60!` :
        `Your SEO Title is only ${seoTitleLen} characters long. It should be at least 50 characters long.`
    }
          </li>

          <li class="${seoDescKeys ? 'success' : 'error'}">
          ${seoDescKeys ?
      `Your keywords are present in your SEO Description.` :
      `You need to include at least one of your keywords in the SEO Description`}
          </li>
          <li class="${seoDescLen > 49 && seoDescLen < 161 ? 'success' : 'error'}">
            ${seoDescLen > 160 ?
      `Your SEO Description is too long. Try shortening it to a maximum of 160 characters` :
      seoDescLen > 49 ?
        `Your SEO Title is ${seoDescLen} characters long which is between the recommended 50-160!` :
        `Your SEO Title is only ${seoDescLen} characters long. It should be at least 50 characters long.`
    }
          </li>

          <li class="${bodyKeyCount < 2 ? 'error' : bodyKeyCount > 6 ? 'warning' : 'success'}">
            Your keywords appear in your content a total of ${bodyKeyCount === 1 ? `1 time` : `${bodyKeyCount} times`}. 
            The ideal number is between 2 and 4 in the content and 1 time in a heading.
          </li>
          <li class="${bodyWordCount > 500 ? 'success' : 'error'}">
            Your content has ${bodyWordCount === 1 ? `1 word` : `${bodyWordCount} words`} which is ${bodyWordCount > 499 ? 'more' : 'less'} than the recommended amount of 500 words. Some sources recommend as many as 2000 words, though that isn't always necessary.
          </li>
          <li class="${bodyAltTags.length < 1 ? 'success' : 'error'}">
            ${bodyAltTags.length < 1 ? `All of your images have alt tags! Way to go!` : `
              You have ${bodyAltTags.length === 1 ? `1 image` : `${bodyAltTags.length} images`} without alt tags. Alt tags are important both for accessibility and SEO purposes since browsers can't tell what images look like. Below you can find the images you need to fix:
              <ul>
                ${bodyAltTags.map((t) => `<li>${t}</li>`)}
              </ul>
            `}
          </li>

        </ul>

        <section>
          <h3>SERP Preview</h3>
          <article class='serp-preview'>
            <p class='serp-title'>${serpTitle}</p>
            <p class='serp-url'>yoururlhere.com</p>
            <p class='serp-desc'>${serpDesc}</p>
          </article>

          <h3>Twitter Card Preview</h3>
          <article class='twitter-card'>
            <header class='twitter-header'>
              <img src="${twitterSrc}" class='twitter-profile-img' />
              <div class='twitter-profile'>
                <p><strong>Maurice Moss</strong> @mossishere 2min</p>
                <p>Chairman, wow! Check out this article!</p>
              </div>
            </header>
          </article>
        </section>
		</body>
		</html>`;
}