/*
 * Copyright 2026 kazuihitoshi@gmail.com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * Markdown Image Layout
 * Shows Markdown images that sit on their own line at 30% of the text width.
 * Images in the same block with no blank line between them sit side by side,
 * including images under a list item. A blank line starts a new row.
 * Click an image to view it at full size.
 */
(function () {
  'use strict';

  var layingOut = false;

  function isMarkdown() {
    return document.body && document.body.getAttribute('data-text-formatting') === 'common_mark';
  }

  function isSpace(node) {
    return node && node.nodeType === 3 && !/\S/.test((node.textContent || '').replace(/\u00a0/g, ' '));
  }

  function isLineBreak(node) {
    return node && node.nodeType === 1 && node.tagName === 'BR';
  }

  function isImg(node) {
    return node && node.nodeType === 1 && node.tagName === 'IMG';
  }

  function nearestSignificant(node, direction) {
    var current = node[direction];
    while (current && isSpace(current)) current = current[direction];
    return current;
  }

  function isOwnLineImage(img) {
    var prev = nearestSignificant(img, 'previousSibling');
    var next = nearestSignificant(img, 'nextSibling');
    var prevOk = !prev || isLineBreak(prev) || isImg(prev);
    var nextOk = !next || isLineBreak(next) || isImg(next);
    return prevOk && nextOk;
  }

  function imageRuns(parent) {
    var children = Array.prototype.slice.call(parent.childNodes);
    var runs = [];
    var index = 0;
    while (index < children.length) {
      var node = children[index];
      if (!isImg(node) || !isOwnLineImage(node)) {
        index += 1;
        continue;
      }
      var run = [node];
      var cursor = index + 1;
      while (cursor < children.length) {
        var candidate = children[cursor];
        if (isSpace(candidate) || isLineBreak(candidate)) {
          cursor += 1;
          continue;
        }
        if (isImg(candidate) && isOwnLineImage(candidate)) {
          run.push(candidate);
          cursor += 1;
          continue;
        }
        break;
      }
      runs.push(run);
      index = cursor;
    }
    return runs;
  }

  function flushRun(imgs) {
    var parent = imgs[0].parentNode;
    if (!parent) return;
    var last = imgs[imgs.length - 1];
    var removable = [];
    var node = imgs[0].nextSibling;
    while (node && node !== last) {
      var next = node.nextSibling;
      if (isLineBreak(node) || isSpace(node)) removable.push(node);
      node = next;
    }
    var box = document.createElement('div');
    box.className = 'markdown-image-layout';
    parent.insertBefore(box, imgs[0]);
    imgs.forEach(function (img) { box.appendChild(img); });
    removable.forEach(function (extra) {
      if (extra.parentNode) extra.parentNode.removeChild(extra);
    });
    if (parent.tagName !== 'P' && parent.tagName !== 'DIV') return;
    var leftover = Array.prototype.some.call(parent.childNodes, function (child) {
      return child !== box && !isSpace(child) && !isLineBreak(child);
    });
    if (!leftover && parent.parentNode) {
      parent.parentNode.insertBefore(box, parent);
      parent.parentNode.removeChild(parent);
    }
  }

  function layoutElement(el) {
    if (!el || el.nodeType !== 1) return;
    if (el.classList.contains('markdown-image-layout')) return;
    if (el.classList.contains('markdown-image-layout-lightbox')) return;
    var tag = el.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA' || tag === 'PRE') return;
    imageRuns(el).forEach(flushRun);
    Array.prototype.forEach.call(el.children, layoutElement);
  }

  function layoutWiki(root) {
    layoutElement(root);
  }

  function layoutAll() {
    if (layingOut || !isMarkdown()) return;
    layingOut = true;
    try {
      Array.prototype.forEach.call(document.querySelectorAll('div.wiki'), layoutWiki);
    } finally {
      layingOut = false;
    }
  }

  function closeLightbox() {
    var overlay = document.querySelector('.markdown-image-layout-lightbox');
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    document.body.classList.remove('markdown-image-layout-open');
  }

  function openLightbox(src, alt) {
    closeLightbox();
    var overlay = document.createElement('div');
    overlay.className = 'markdown-image-layout-lightbox';
    overlay.setAttribute('role', 'dialog');
    var img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    overlay.appendChild(img);
    overlay.addEventListener('click', closeLightbox);
    document.body.appendChild(overlay);
    document.body.classList.add('markdown-image-layout-open');
  }

  function onClick(event) {
    var img = event.target && event.target.closest ? event.target.closest('.markdown-image-layout img') : null;
    if (!img) return;
    event.preventDefault();
    event.stopPropagation();
    openLightbox(img.currentSrc || img.src, img.alt);
  }

  function onKeydown(event) {
    if (event.key === 'Escape') closeLightbox();
  }

  function install() {
    if (!isMarkdown()) return;
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeydown);
    layoutAll();
    if (window.MutationObserver) {
      var observer = new MutationObserver(function () { layoutAll(); });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install);
  } else {
    install();
  }
})();
