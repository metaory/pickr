// Declarative action definition
const inspectElementAction = {
  name: 'Inspect Element',
  key: 'i',
  aliases: [],
  category: 'Inspect',
  description: 'Open browser dev tools',
  execute: (element) => {
    // Highlight element temporarily
    const originalOutline = element.style.outline
    element.style.outline = '3px solid #ff6b6b'
    element.style.outlineOffset = '2px'
    
    setTimeout(() => {
      element.style.outline = originalOutline
      element.style.outlineOffset = ''
    }, 2000)
    
    return { feedback: 'Element highlighted - check dev tools', result: null }
  }
}

// Register action
window.pickrActionManager.register(inspectElementAction) 