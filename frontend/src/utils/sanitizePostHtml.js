import DOMPurify from 'dompurify';

const linkifyReadMoreUrls = (root) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach((textNode) => {
    const text = textNode.textContent;
    const matches = [...text.matchAll(/(Read more:\s*)(https?:\/\/[^\s<>"']+)/gi)];
    if (!matches.length) return;

    const fragment = document.createDocumentFragment();
    let cursor = 0;
    let changed = false;

    matches.forEach((match) => {
      const rawUrl = match[2];
      const punctuation = rawUrl.match(/[.,!?;:)\]}]+$/)?.[0] || '';
      const urlText = rawUrl.slice(0, rawUrl.length - punctuation.length);
      let url;
      try {
        url = new URL(urlText);
      } catch {
        return;
      }
      if (!['http:', 'https:'].includes(url.protocol)) return;

      fragment.append(document.createTextNode(text.slice(cursor, match.index)));
      fragment.append(document.createTextNode(match[1]));
      const link = document.createElement('a');
      link.href = url.href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = urlText;
      fragment.append(link);
      if (punctuation) fragment.append(document.createTextNode(punctuation));
      cursor = match.index + match[0].length;
      changed = true;
    });

    if (!changed) return;
    fragment.append(document.createTextNode(text.slice(cursor)));
    textNode.replaceWith(fragment);
  });
};

const sanitizePostHtml = (html) => {
  const template = document.createElement('template');
  template.innerHTML = DOMPurify.sanitize(html || '');
  linkifyReadMoreUrls(template.content);

  template.content.querySelectorAll('a[href]').forEach((link) => {
    try {
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin && ['http:', 'https:'].includes(url.protocol)) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
    } catch {
      link.removeAttribute('target');
      link.removeAttribute('rel');
    }
  });

  return template.innerHTML;
};

export default sanitizePostHtml;