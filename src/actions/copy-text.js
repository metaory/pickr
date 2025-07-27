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

// Register action
window.pickrActionManager.register(copyTextAction) 