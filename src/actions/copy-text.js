// Copy element text content action
try {
  const copyTextAction = {
    name: 'Copy Inner Text',
    key: 'y',
    description: 'Copy element text content',
    category: 'copy',
    execute: (element) => {
      const text = element.innerText || element.textContent || ''
      navigator.clipboard.writeText(text)
      return {
        feedback: `Copied ${text.length} characters`,
        result: text
      }
    }
  }
  if (window.pickrActionManager) {
    window.pickrActionManager.register(copyTextAction)
  }
} catch (e) {
  // Action already registered, ignore
} 