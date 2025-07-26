// Highlight element action
try {
  const highlightElementAction = {
    name: 'Highlight Element',
    key: 'l',
    description: 'Add permanent highlight to element',
    category: 'modify',
    execute: (element) => {
      const originalBackground = element.style.backgroundColor
      const originalOutline = element.style.outline
      element.style.backgroundColor = 'rgba(255, 255, 0, 0.3)'
      element.style.outline = '2px solid #f59e0b'
      element.style.outlineOffset = '2px'
      element.dataset.pickrOriginalBackground = originalBackground
      element.dataset.pickrOriginalOutline = originalOutline
      return {
        feedback: `Highlighted ${element.tagName.toLowerCase()} element`,
        result: {
          element: element.tagName,
          originalBackground,
          originalOutline
        }
      }
    }
  }
  if (window.pickrActionManager) {
    window.pickrActionManager.register(highlightElementAction)
  }
} catch (e) {
  // Action already registered, ignore
} 