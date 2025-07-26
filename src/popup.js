// Settings popup with toggle functionality
const elements = {
  autoSidebar: document.getElementById('auto-sidebar'),
  showHelp: document.getElementById('show-help'),
  highlightElements: document.getElementById('highlight-elements'),
  copyClipboard: document.getElementById('copy-clipboard'),
  showNotifications: document.getElementById('show-notifications')
}

// Functional utilities
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x)
const tap = fn => x => { fn(x); return x }

// Settings state
const settings = {
  autoSidebar: true,
  showHelp: true,
  highlightElements: true,
  copyClipboard: true,
  showNotifications: true
}

// Toggle functionality
const toggleSetting = (settingName) => {
  settings[settingName] = !settings[settingName]
  elements[settingName].classList.toggle('active', settings[settingName])
  
  // Save to storage
  chrome.storage.sync.set({ [settingName]: settings[settingName] })
  
  // Notify content script of setting change
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'setting-change',
        setting: settingName,
        value: settings[settingName]
      })
    }
  })
}

// Load settings from storage
const loadSettings = () => {
  chrome.storage.sync.get(Object.keys(settings), (result) => {
    Object.keys(settings).forEach(key => {
      if (result[key] !== undefined) {
        settings[key] = result[key]
        elements[key].classList.toggle('active', settings[key])
      }
    })
  })
}

// Event listeners
Object.keys(elements).forEach(key => {
  elements[key].addEventListener('click', () => toggleSetting(key))
})

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  loadSettings()
}) 