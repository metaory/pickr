// Declarative action definition
const copySelectorAction = {
  name: 'Copy Selector',
  key: 's',
  aliases: [],
  category: 'Copy',
  description: 'Copy CSS selector',
  execute: (element) => {
    if (!element) {
      return { feedback: 'No element selected', result: null, error: true }
    }
    
    const selector = generateSelector(element)
    return selector
      ? { feedback: 'Selector copied to clipboard', result: selector }
      : { feedback: 'Could not generate selector', result: null, error: true }
  }
}

// Reset element action
const resetElementAction = {
  name: 'Reset Element',
  key: 'z',
  aliases: [],
  category: 'Manipulate',
  description: 'Reset element to original size',
  execute: (element) => {
    if (!state.isPaused) {
      return { feedback: 'Must be in paused mode to manipulate elements', result: null, error: true }
    }
    
    element.style.transform = ''
    element.style.transformOrigin = ''
    
    return { feedback: 'Element reset to original size', result: null }
  }
}

// Pure function for selector generation
const generateSelector = (element) => {
  if (element.id) return `#${element.id}`
  
  if (element.className) {
    const classes = element.className.split(' ').filter(c => c.trim())
    if (classes.length > 0) {
      const classSelector = `.${classes.join('.')}`
      if (document.querySelectorAll(classSelector).length === 1) {
        return classSelector
      }
    }
  }
  
  const tag = element.tagName.toLowerCase()
  const parent = element.parentElement
  if (!parent) return tag
  
  const siblings = Array.from(parent.children).filter(child => child.tagName === element.tagName)
  if (siblings.length === 1) {
    return `${parent.tagName.toLowerCase()} > ${tag}`
  }
  
  const index = siblings.indexOf(element) + 1
  return `${parent.tagName.toLowerCase()} > ${tag}:nth-child(${index})`
}

// Register actions
window.pickrActionManager.register(copySelectorAction)
window.pickrActionManager.register(resetElementAction) 