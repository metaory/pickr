// Copy element HTML action
try {
  const copyHtmlAction = {
    name: 'Copy HTML',
    key: 'h',
    description: 'Copy element HTML',
    category: 'copy',
    execute: (element) => {
      const html = element.outerHTML
      navigator.clipboard.writeText(html)
      return {
        feedback: `Copied HTML (${html.length} chars)`,
        result: html
      }
    }
  }
  if (window.pickrActionManager) {
    window.pickrActionManager.register(copyHtmlAction)
  }
} catch (e) {
  // Action already registered, ignore
} 