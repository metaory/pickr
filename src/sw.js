// Functional service worker with modern patterns
const commands = {
  'mouse-selector': async (tab) => {
    try {
      // Check if mouse mode is already active
      const isActive = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const sidebar = document.getElementById('pickr-sidebar')
          const legend = document.getElementById('pickr-legend-overlay')
          const compactHelp = document.getElementById('pickr-compact-help')
          return !!(sidebar && legend && compactHelp && sidebar.style.transform === 'translateX(0px)')
        }
      })
      
      if (isActive[0]?.result) {
        // Mode is active, exit it
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            const event = new KeyboardEvent('keydown', { key: 'Escape' })
            document.dispatchEvent(event)
          }
        })
        return
      }
      
      // Check if scripts are already loaded
      const isLoaded = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          return !!(window.pickrMouseSelector && window.pickrActionManager)
        }
      })
      
      if (!isLoaded[0]?.result) {
        // Inject action manager first
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['src/actions/action-manager.js']
        })
        
        // Then inject all individual actions
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: [
            'src/actions/copy-text.js',
            'src/actions/copy-html.js',
            'src/actions/copy-selector.js',
            'src/actions/copy-attributes.js',
            'src/actions/copy-url.js',
            'src/actions/inspect-element.js',
            'src/actions/highlight-element.js'
          ]
        })
        
        // Then inject element selector
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['src/element-selector.js']
        })
      }
      
      // Then call the function
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          if (window.pickrMouseSelector) {
            window.pickrMouseSelector()
          } else {
            console.error('Mouse selector not available')
          }
        }
      })
    } catch (error) {
      console.error('Error in mouse selector:', error)
    }
  },
  
  'input-selector': async (tab) => {
    try {
      // Check if input mode is already active
      const isActive = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const sidebar = document.getElementById('pickr-sidebar')
          const legend = document.getElementById('pickr-legend-overlay')
          const compactHelp = document.getElementById('pickr-compact-help')
          const inputOverlay = document.getElementById('pickr-input-overlay')
          return !!(sidebar && legend && compactHelp && inputOverlay && sidebar.style.transform === 'translateX(0px)')
        }
      })
      
      if (isActive[0]?.result) {
        // Mode is active, exit it
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            const event = new KeyboardEvent('keydown', { key: 'Escape' })
            document.dispatchEvent(event)
          }
        })
        return
      }
      
      // Check if scripts are already loaded
      const isLoaded = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          return !!(window.pickrInputSelector && window.pickrActionManager)
        }
      })
      
      if (!isLoaded[0]?.result) {
        // Inject action manager first
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['src/actions/action-manager.js']
        })
        
        // Then inject all individual actions
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: [
            'src/actions/copy-text.js',
            'src/actions/copy-html.js',
            'src/actions/copy-selector.js',
            'src/actions/copy-attributes.js',
            'src/actions/copy-url.js',
            'src/actions/inspect-element.js',
            'src/actions/highlight-element.js'
          ]
        })
        
        // Then inject element selector
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['src/element-selector.js']
        })
      }
      
      // Then call the function
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          if (window.pickrInputSelector) {
            window.pickrInputSelector()
          } else {
            console.error('Input selector not available')
          }
        }
      })
    } catch (error) {
      console.error('Error in input selector:', error)
    }
  }
}

// Functional command handler
const handleCommand = async (command) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tab) {
    console.error('No active tab found')
    return
  }
  
  const handler = commands[command]
  if (handler) {
    await handler(tab)
  } else {
    console.error('No handler for command:', command)
  }
}

// Event listener
chrome.commands.onCommand.addListener(handleCommand)

// Service worker ready 