/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroWelcomeParser from './parsers/hero-welcome.js';
import tabsBoxedParser from './parsers/tabs-boxed.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/natrellekorea-cleanup.js';
import sectionsTransformer from './transformers/natrellekorea-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'home',
  description: 'Homepage: welcome hero banner over a warranty-program tabbed interface, closing with a contact notice.',
  urls: [
    'https://www.natrellekorea.co.kr/',
  ],
  blocks: [
    {
      name: 'hero-welcome',
      instances: ['#contents > div.background'],
    },
    {
      name: 'tabs-boxed',
      instances: ['#tab_wrap'],
    },
  ],
  sections: [
    {
      id: 'rc1',
      name: 'hero',
      selector: ['#contents > div.background'],
      style: 'navy-blue',
      blocks: ['hero-welcome'],
      defaultContent: [],
    },
    {
      id: 'rc2',
      name: 'warranty-tabs',
      selector: ['#tab_wrap'],
      style: null,
      blocks: ['tabs-boxed'],
      defaultContent: [],
    },
    {
      id: 'rc3',
      name: 'contact-notice',
      selector: ['#contents > div.contents_in > div.basic_in.compad_b'],
      style: null,
      blocks: [],
      defaultContent: ['#contents > div.contents_in > div.basic_in.compad_b'],
    },
    {
      id: 'rc4',
      name: 'footer',
      selector: ['#footer'],
      style: null,
      blocks: [],
      defaultContent: [],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-welcome': heroWelcomeParser,
  'tabs-boxed': tabsBoxedParser,
};

// TRANSFORMER REGISTRY - cleanup runs first, section transformer last
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block (skip elements already replaced)
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (map root URL to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
