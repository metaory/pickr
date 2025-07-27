// Declarative action definition
const copyHtmlAction = {
  name: 'Copy HTML',
  key: 'h',
  aliases: [],
  category: 'Copy',
  description: 'Copy element HTML',
  execute: (element) => {
    const html = element.outerHTML || element.innerHTML || ''
    return html
      ? { feedback: 'HTML copied to clipboard', result: html }
      : { feedback: 'No HTML content found', result: null, error: true }
  }
}

// Grow element action
const growElementAction = {
  name: 'Grow Element',
  key: 'g',
  aliases: [],
  category: 'Manipulate',
  description: 'Increase element size',
  execute: (element) => {
    if (!state.isPaused) {
      return { feedback: 'Must be in paused mode to manipulate elements', result: null, error: true }
    }
    
    const currentScale = element.style.transform.match(/scale\(([^)]+)\)/) || [null, '1']
    const newScale = Math.min(parseFloat(currentScale[1]) + 0.1, 3)
    
    element.style.transform = `scale(${newScale})`
    element.style.transformOrigin = 'center center'
    
    return { feedback: `Element scaled to ${newScale.toFixed(1)}x`, result: newScale }
  }
}

// Shrink element action
const shrinkElementAction = {
  name: 'Shrink Element',
  key: 'r',
  aliases: [],
  category: 'Manipulate',
  description: 'Decrease element size',
  execute: (element) => {
    if (!state.isPaused) {
      return { feedback: 'Must be in paused mode to manipulate elements', result: null, error: true }
    }
    
    const currentScale = element.style.transform.match(/scale\(([^)]+)\)/) || [null, '1']
    const newScale = Math.max(parseFloat(currentScale[1]) - 0.1, 0.1)
    
    element.style.transform = `scale(${newScale})`
    element.style.transformOrigin = 'center center'
    
    return { feedback: `Element scaled to ${newScale.toFixed(1)}x`, result: newScale }
  }
}

// Register actions
window.pickrActionManager.register(copyHtmlAction)
window.pickrActionManager.register(growElementAction)
window.pickrActionManager.register(shrinkElementAction) 