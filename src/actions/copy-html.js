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

// Register action
window.pickrActionManager.register(copyHtmlAction) 