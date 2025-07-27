// Declarative action definition
const copyTextAction = {
  name: 'Copy Text',
  key: 't',
  aliases: [],
  category: 'Copy',
  description: 'Copy text content',
  execute: (element) => {
    const text = element.textContent?.trim() || element.innerText?.trim() || ''
    return text 
      ? { feedback: 'Text copied to clipboard', result: text }
      : { feedback: 'No text content found', result: null, error: true }
  }
}

// Left-click selection action
const selectElementAction = {
  name: 'Select Element',
  key: 'click',
  aliases: [],
  category: 'Select',
  description: 'Select and pause on element',
  execute: (element) => {
    // Use shared element state management
    if (window.pickrElementState) {
      window.pickrElementState.select(element)
    }
    
    return { feedback: 'Element selected and paused', result: null }
  }
}

// Register actions
window.pickrActionManager.register(copyTextAction)
window.pickrActionManager.register(selectElementAction) 