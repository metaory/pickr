// Modern functional element selector with overlay-based interface
// Focuses on overlay UI with sidebar previews and comprehensive legend hints

// Declarative configuration
const config = {
  // Event mappings
  events: {
    mouse: {
      contextmenu: 'contextmenu' // Right click for context menu
    },
    keyboard: {
      keydown: (e) => e.key.toLowerCase()
    }
  },
  
  // UI settings
  ui: {
    colors: {
      primary: '#60a5fa',
      success: '#22c55e',
      warning: '#fbbf24',
      mouse: '#ec4899'
    },
    timing: {
      toast: 2000,
      debounce: 100
    }
  },
  
  // Element selectors
  selectors: {
    pickrElements: '[id^="pickr-"]',
    highlightedElements: '[style*="outline: 2px solid"]'
  }
}

// Guard against multiple script injection
if (window.pickrMouseSelector && window.pickrInputSelector) {
  console.log('pickr element selector already loaded')
} else {

// Declarative event mappings
const eventMappings = config.events

// Functional utility composition
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x)
const tap = (fn) => x => { fn(x); return x }

// Proxy-based state management
const createState = (initial = {}) => {
  const state = { ...initial }
  const listeners = new Set()
  
  return new Proxy(state, {
    get(target, key) { return target[key] },
    set(target, key, value) {
      target[key] = value
      listeners.forEach(listener => listener(state))
      return true
    },
    apply(target, thisArg, args) {
      listeners.add(args[0])
      return () => listeners.delete(args[0])
    }
  })
}

// Immutable element operations
const elementOps = {
  getSelector: el => {
    const tag = el.tagName.toLowerCase()
    const classes = [...el.classList].map(c => '.' + c).join('')
    const id = el.id ? '#' + el.id : ''
    return tag + id + classes
  },
  
  getContent: el => el?.innerText || el?.content || el?.href || '',
  
  getStats: el => ({
    tagName: el.tagName.toLowerCase(),
    className: el.className,
    id: el.id,
    children: el.children.length,
    selector: elementOps.getSelector(el),
    content: elementOps.getContent(el),
    attributes: Object.fromEntries([...el.attributes].map(attr => [attr.name, attr.value]))
  }),
  
  queryAll: selector => [...document.querySelectorAll(selector)],
  
  isValidSelector: selector => {
    try {
      document.querySelector(selector)
      return true
    } catch {
      return false
    }
  }
}

// Functional DOM manipulation
const domOps = {
  create: (tag, props = {}) => {
    const el = document.createElement(tag)
    Object.entries(props).forEach(([key, value]) => {
      if (key === 'style' && typeof value === 'object') {
        Object.assign(el.style, value)
      } else if (key === 'innerHTML') {
        el.innerHTML = value
      } else {
        el[key] = value
      }
    })
    return el
  },
  
  append: (parent, child) => {
    parent.appendChild(child)
    return child
  },
  
  remove: el => el?.remove(),
  
  setStyles: (el, styles) => {
    Object.assign(el.style, styles)
    return el
  }
}

// Debounced function factory
const debounce = (fn, ms = 50) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), ms)
  }
}

// Functional event management system
const eventManager = {
  // Declarative event registration
  add: (element, event, handler, options = {}) => {
    const useCapture = event === 'keydown' || options.capture
    element.addEventListener(event, handler, { capture: useCapture, ...options })
    return () => element.removeEventListener(event, handler, { capture: useCapture, ...options })
  },
  
  // Functional cleanup
  removeAll: (cleanups) => {
    if (Array.isArray(cleanups)) {
      cleanups.forEach(cleanup => {
        if (typeof cleanup === 'function') {
          try {
            cleanup()
          } catch (error) {
            console.warn('Event cleanup failed:', error)
          }
        }
      })
    }
  },
  
  // Declarative event registration helpers
  register: {
    mouse: (element, handlers, options = {}) => {
      return Object.entries(handlers).map(([event, handler]) => 
        eventManager.add(element, event, handler, options)
      )
    },
    
    keyboard: (element, handlers, options = { capture: true }) => {
      return Object.entries(handlers).map(([event, handler]) => 
        eventManager.add(element, event, handler, options)
      )
    }
  }
}

// Toast notification system
const toastSystem = {
  create: (message, type = 'info', duration = 3000) => {
    const toast = domOps.create('div', {
      id: `pickr-toast-${Date.now()}`,
      innerHTML: /*html*/`
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 16px;">${toastSystem.getIcon(type)}</span>
          <span style="font-weight: 500;">${message}</span>
        </div>
      `
    })
    
    return pipe(
      tap(el => domOps.setStyles(el, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: toastSystem.getColor(type),
        color: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        zIndex: '999999',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        backdropFilter: 'blur(10px)'
      })),
      tap(el => domOps.append(document.body, el)),
      tap(el => {
        setTimeout(() => el.style.transform = 'translateX(0)', 10)
        setTimeout(() => {
          el.style.transform = 'translateX(100%)'
          setTimeout(() => el.remove(), 300)
        }, duration)
      })
    )(toast)
  },
  
  getIcon: (type) => ({ success: '✓', error: '✗', warning: '⚠', info: 'ℹ' }[type] || 'ℹ'),
  getColor: (type) => ({
    success: 'rgba(34, 197, 94, 0.8)',
    error: 'rgba(239, 68, 68, 0.8)',
    warning: 'rgba(245, 158, 11, 0.8)',
    info: 'rgba(59, 130, 246, 0.8)'
  }[type] || 'rgba(59, 130, 246, 0.8)')
}

// Compact help overlay with separated VIEW and ACTION sections
const compactHelpOverlay = {
  create: (mode) => {
    const overlay = domOps.create('div', {
      id: 'pickr-compact-help',
      innerHTML: compactHelpOverlay.getContent(mode)
    })
    
    return pipe(
      tap(el => domOps.setStyles(el, {
        position: 'fixed',
        top: '10px',
        left: '10px',
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(15px)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        zIndex: '999995',
        opacity: '0.9',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      })),
      tap(el => domOps.append(document.body, el))
    )(overlay)
  },
  
  getContent: (mode) => {
    const viewShortcuts = mode === 'input' 
      ? 'S:Sidebar H:Help I:Input ?:FullHelp ESC:Exit'
      : 'S:Sidebar H:Help ?:FullHelp ESC:Exit'
    
    const moveShortcuts = 'W:Up A:Left X:Down D:Right Q:Prev E:Next'
    
    // Get action shortcuts
    const actions = window.pickrActionManager ? window.pickrActionManager.getAll() : []
    const actionShortcuts = actions
      .slice(0, 4) // Show first 4 actions to keep compact
      .map(action => `${action.key.toUpperCase()}:${action.name.split(' ')[0]}`)
      .join(' ')
    
    // Add mouse actions for mouse mode
    const mouseActions = mode === 'mouse' ? 'Right:Context Menu' : ''
    
    return /*html*/`
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-weight: 600; color: #60a5fa; font-size: 11px;">${mode.toUpperCase()}</span>
          <span style="opacity: 0.8; color: #60a5fa;">${viewShortcuts}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 4px; opacity: 0.7; font-size: 11px;">
          <span style="color: #22c55e; font-weight: 600;">Move:</span>
          <span style="color: #22c55e;">${moveShortcuts}</span>
        </div>
        ${actionShortcuts ? `
          <div style="display: flex; align-items: center; gap: 4px; opacity: 0.7; font-size: 11px;">
            <span style="color: #fbbf24; font-weight: 600;">Actions:</span>
            <span style="color: #fbbf24;">${actionShortcuts}</span>
          </div>
        ` : ''}
        ${mouseActions ? `
          <div style="display: flex; align-items: center; gap: 4px; opacity: 0.7; font-size: 11px;">
            <span style="color: #ec4899; font-weight: 600;">Mouse:</span>
            <span style="color: #ec4899;">${mouseActions}</span>
          </div>
        ` : ''}
      </div>
    `
  },
  
  update: (mode) => {
    const overlay = document.getElementById('pickr-compact-help')
    if (overlay) overlay.innerHTML = compactHelpOverlay.getContent(mode)
  },
  
  remove: () => {
    const overlay = document.getElementById('pickr-compact-help')
    if (overlay) overlay.remove()
  }
}

// Enhanced legend overlay system with separated VIEW and ACTION sections
const legendOverlay = {
  create: (mode) => {
    const overlay = domOps.create('div', {
      id: 'pickr-legend-overlay',
      innerHTML: legendOverlay.getContent(mode)
    })
    
    return pipe(
      tap(el => domOps.setStyles(el, {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        right: '370px', // Leave space for sidebar
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(20px)',
        color: 'white',
        padding: '16px 24px',
        borderRadius: '12px',
        fontSize: '14px',
        zIndex: '999996',
        opacity: '0',
        display: 'none',
        mixBlendMode: 'normal',
        transition: 'opacity 0.3s ease',
        maxHeight: '60vh',
        overflowY: 'auto',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      })),
      tap(el => domOps.append(document.body, el))
    )(overlay)
  },
  
  getContent: (mode) => {
    const viewControls = {
      'S': 'Toggle Sidebar',
      'H': 'Toggle Compact Help',
      '?': 'Toggle Full Help',
      'I': 'Toggle Input (Input Mode)',
      'P': 'Pause/Resume',
      'ESC': 'Exit Mode'
    }
    
    const moveControls = {
      'W': 'Move Up',
      'A': 'Move Left', 
      'X': 'Move Down',
      'D': 'Move Right',
      'Q': 'Move Previous',
      'E': 'Move Next'
    }
    
    const viewKeys = Object.entries(viewControls)
      .map(([key, action]) => `
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <div style="
            background: rgba(96, 165, 250, 0.2); 
            border: 2px solid rgba(96, 165, 250, 0.8); 
            border-radius: 8px; 
            padding: 6px 10px; 
            font-weight: 600; 
            font-size: 12px; 
            font-family: 'SF Mono', Monaco, monospace;
            min-width: 24px;
            text-align: center;
            color: #60a5fa;
          ">${key}</div>
          <span style="color: rgba(255,255,255,0.9); font-size: 13px;">${action}</span>
        </div>
      `).join('')
    
    const moveKeys = Object.entries(moveControls)
      .map(([key, action]) => `
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <div style="
            background: rgba(34, 197, 94, 0.2); 
            border: 2px solid rgba(34, 197, 94, 0.8); 
            border-radius: 8px; 
            padding: 6px 10px; 
            font-weight: 600; 
            font-size: 12px; 
            font-family: 'SF Mono', Monaco, monospace;
            min-width: 24px;
            text-align: center;
            color: #22c55e;
          ">${key}</div>
          <span style="color: rgba(255,255,255,0.9); font-size: 13px;">${action}</span>
        </div>
      `).join('')
    
    // Get comprehensive action help content
    const actionHelp = window.pickrActionManager ? window.pickrActionManager.getLegendContent() : ''
    
    return /*html*/`
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 12px;">
          <span style="font-weight: 600; font-size: 16px; color: #60a5fa;">${mode.toUpperCase()} MODE</span>
          <span class="pause-indicator" style="display: none; color: #fbbf24; font-weight: 600; margin-left: 8px;">⏸️ PAUSED</span>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div style="background: rgba(96, 165, 250, 0.1); border: 1px solid rgba(96, 165, 250, 0.3); border-radius: 8px; padding: 12px;">
            <div style="font-weight: 600; font-size: 12px; color: #60a5fa; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
              VIEW CONTROLS
            </div>
            ${viewKeys}
          </div>
          
          <div style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 8px; padding: 12px;">
            <div style="font-weight: 600; font-size: 12px; color: #22c55e; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
              MOVE CONTROLS
            </div>
            ${moveKeys}
          </div>
        </div>
        
        ${actionHelp ? `
          <div style="background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.3); border-radius: 8px; padding: 12px;">
            <div style="font-weight: 600; font-size: 12px; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
              ACTION CONTROLS
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
              ${actionHelp}
            </div>
          </div>
        ` : ''}
        
        <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 12px; font-size: 12px; opacity: 0.7;">
          <strong>Tip:</strong> Compact help is always visible in top-left • Use <kbd style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px;">?</kbd> for full help • Double-press any action key to toggle sidebar
        </div>
      </div>
    `
  },
  
  update: (mode) => {
    const overlay = document.getElementById('pickr-legend-overlay')
    if (overlay) {
      overlay.innerHTML = legendOverlay.getContent(mode)
    }
  },
  
  remove: () => {
    const overlay = document.getElementById('pickr-legend-overlay')
    if (overlay) overlay.remove()
  }
}

// Enhanced sidebar with comprehensive previews
const createSidebar = () => {
  const sidebar = domOps.create('div', {
    id: 'pickr-sidebar',
    innerHTML: /*html*/`
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
        <div>
          <h3 style="margin: 0; color: #1f2937; font-size: 18px;">pickr</h3>
          <div style="font-size: 12px; color: #6b7280; margin-top: 2px;">Element Inspector</div>
        </div>
        <button id="pickr-close" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #6b7280; padding: 4px; border-radius: 4px; transition: background 0.2s;">×</button>
      </div>
      <div id="pickr-content">
        <div style="color: #6b7280; text-align: center; padding: 40px 20px;">
          <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;">🔍</div>
          <div style="font-weight: 500; margin-bottom: 8px;">Select elements to see results</div>
          <div style="font-size: 13px;">Hover over page elements or use input selector</div>
        </div>
      </div>
    `
  })
  
  return pipe(
    tap(el => domOps.setStyles(el, {
      position: 'fixed',
      top: '0',
      right: '0',
      width: '350px',
      height: '100vh',
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(25px)',
      borderLeft: '1px solid #e2e8f0',
      zIndex: '999999',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '14px',
      padding: '20px',
      boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease',
      overflowY: 'auto'
    })),
    tap(el => domOps.append(document.body, el))
  )(sidebar)
}

// Enhanced highlight management
const createHighlight = () => 
  pipe(
    () => domOps.create('div', { id: 'pickr-highlight' }),
    tap(el => domOps.setStyles(el, {
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: '999998',
      background: 'rgba(59, 130, 246, 0.15)',
      mixBlendMode: 'multiply',
      border: '2px solid rgba(59, 130, 246, 0.8)',
      borderRadius: '6px',
      transition: 'all 0.1s ease',
      boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.3)'
    })),
    tap(el => domOps.append(document.body, el))
  )()

const updateHighlight = (element) => {
  const highlight = document.getElementById('pickr-highlight') || createHighlight()
  
  if (element) {
    const rect = element.getBoundingClientRect()
    domOps.setStyles(highlight, {
      left: rect.left + 'px',
      top: rect.top + 'px',
      width: rect.width + 'px',
      height: rect.height + 'px',
      display: 'block'
    })
  } else {
    highlight.style.display = 'none'
  }
}

// Enhanced template generators
const templates = {
  mouseStats: (stats) => /*html*/`
    <div style="margin-bottom: 20px;">
      <h4 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px;">Mouse Selector</h4>
      
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="font-size: 12px; background: #3b82f6; color: white; padding: 2px 8px; border-radius: 12px; font-weight: 500;">${stats.tagName}</span>
          ${stats.id ? `<span style="font-size: 12px; background: #10b981; color: white; padding: 2px 8px; border-radius: 12px;">#${stats.id}</span>` : ''}
        </div>
        <div style="font-size: 13px; color: #6b7280; margin-bottom: 4px;">Children: ${stats.children}</div>
        ${stats.className ? `<div style="font-size: 13px; color: #6b7280;">Classes: ${stats.className}</div>` : ''}
      </div>
      
      <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <div style="font-weight: 500; margin-bottom: 8px; color: #0369a1;">CSS Selector</div>
        <code style="font-size: 13px; color: #0369a1; background: rgba(59, 130, 246, 0.1); padding: 8px 12px; border-radius: 6px; display: block; word-break: break-all;">${stats.selector}</code>
      </div>
      
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
        <div style="font-weight: 500; margin-bottom: 8px; color: #374151;">Content Preview</div>
        <div style="font-size: 13px; color: #374151; max-height: 120px; overflow-y: auto; line-height: 1.4; background: white; padding: 8px; border-radius: 4px; border: 1px solid #e5e7eb;">${stats.content || '(empty)'}</div>
      </div>
    </div>
  `,
  
  inputResults: (selector, elements) => {
    const count = elements.length
    const samples = elements.slice(0, 3).map(el => elementOps.getStats(el))
    
    return /*html*/`
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px;">Input Selector</h4>
        
        <div style="background: #dcfce7; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
          <div style="color: #166534; font-weight: 600; font-size: 16px; margin-bottom: 8px;">✓ Found ${count} element${count > 1 ? 's' : ''}</div>
          <div style="font-size: 13px; color: #059669;">Selector: <code style="background: rgba(5, 150, 105, 0.1); padding: 4px 8px; border-radius: 4px;">${selector}</code></div>
        </div>
        
        ${samples.map((sample, index) => /*html*/`
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="font-weight: 500; color: #1f2937;">Sample ${index + 1}</span>
              <span style="font-size: 12px; background: #3b82f6; color: white; padding: 2px 8px; border-radius: 12px;">${sample.tagName}</span>
            </div>
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 6px;">Selector: <code style="background: rgba(59, 130, 246, 0.1); padding: 2px 6px; border-radius: 3px;">${sample.selector}</code></div>
            <div style="font-size: 12px; color: #374151; max-height: 80px; overflow-y: auto; line-height: 1.4; background: white; padding: 6px; border-radius: 4px; border: 1px solid #e5e7eb;">${sample.content || '(empty)'}</div>
          </div>
        `).join('')}
      </div>
    `
  },
  
  error: (message) => /*html*/`
    <div style="margin-bottom: 20px;">
      <h4 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px;">Error</h4>
      <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px;">
        <div style="color: #991b1b; font-weight: 500;">⚠️ ${message}</div>
      </div>
    </div>
  `,
  
  actionResult: (feedback, result) => /*html*/`
    <div style="margin-bottom: 20px;">
      <div style="background: #dcfce7; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
        <div style="color: #166534; font-weight: 600; margin-bottom: 8px;">✓ ${feedback}</div>
      </div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
        <div style="font-weight: 500; margin-bottom: 8px; color: #374151;">Result</div>
        <pre style="font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace; font-size: 12px; color: #374151; background: white; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb; max-height: 300px; overflow: auto; margin: 0; white-space: pre-wrap; word-break: break-all;">${typeof result === 'string' ? result : JSON.stringify(result, null, 2)}</pre>
      </div>
    </div>
  `
}

// Unified action handler
const handleAction = (key, element) => {
  if (!window.pickrActionManager || !element) return false
  
  const actionResult = window.pickrActionManager.executeByKey(key, element)
  if (!actionResult) return false
  
  const toastType = actionResult.error ? 'error' : 'success'
  const toastMessage = actionResult.feedback || `Action ${key} executed`
  toastSystem.create(toastMessage, toastType)
  
  sidebar.update(templates.actionResult(actionResult.feedback, actionResult.result))
  return true
}

// Enhanced element selection that avoids our own overlays
const isPickrElement = (element) => {
  if (!element) return false
  
  const pickrSelectors = [
    '#pickr-sidebar',
    '#pickr-legend-overlay',
    '#pickr-compact-help',
    '#pickr-input-overlay',
    '#pickr-highlight',
    '[id^="pickr-toast-"]'
  ]
  
  return pickrSelectors.some(selector => {
    try {
      return element.closest(selector) !== null
    } catch {
      return false
    }
  })
}

// Simple event handler
const createEventHandler = (mapping) => async (e) => {
  if (isPickrElement(e.target)) {
    e.preventDefault()
    e.stopPropagation()
    return false
  }
  
  e.preventDefault()
  e.stopPropagation()
  
  // Show context menu on right-click
  if (e.button === 2 && state.currentElement) {
    contextMenu.show(state.currentElement, e)
    return false
  }
  
  // Handle other mouse events if needed
  const actionKey = typeof mapping === 'function' ? mapping(e) : mapping
  if (state.currentElement && window.pickrActionManager && actionKey) {
    const result = await window.pickrActionManager.executeByKey(actionKey, state.currentElement)
    if (result) {
      toastSystem.create(result.feedback, result.error ? 'error' : 'success', config.ui.timing.toast)
    }
  }
  
  return false
}

// Unified keyboard handler for both modes
const createKeyboardHandler = (cleanups, additionalHandlers = {}) => {
  const keyHandlers = {
    escape: () => exitMode(cleanups),
    p: () => togglePause(),
    s: () => toggleSidebar(),
    h: () => toggleLegend(),
    '?': () => toggleFullHelp(),
    w: () => moveSelection('up'),
    a: () => moveSelection('left'),
    x: () => moveSelection('down'),
    d: () => moveSelection('right'),
    q: () => moveSelection('previous'),
    e: () => moveSelection('next'),
    g: () => {}, // Future selection expansion features
    r: () => {}, // Future selection expansion features
  }
  
  return (e) => {
    const key = e.key.toLowerCase()
    
    // Early return for input fields (except our own)
    const activeElement = document.activeElement
    const isInputField = activeElement && (
      activeElement.tagName === 'INPUT' || 
      activeElement.tagName === 'TEXTAREA' || 
      activeElement.contentEditable === 'true' ||
      activeElement.id === 'pickr-selector-input'
    )
    
    if (isInputField && activeElement.id !== 'pickr-selector-input') return
    
    // Check if this is one of our keys
    const isActionKey = window.pickrActionManager && window.pickrActionManager.getByKey(key)
    const isInterfaceKey = keyHandlers[key] || additionalHandlers[key]
    
    if (!isActionKey && !isInterfaceKey) return
    
    // Prevent default for our keys
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
    
    // Handle action keys first
    if (handleAction(key, state.currentElement)) return
    
    // Handle interface keys
    if (keyHandlers[key]) {
      keyHandlers[key]()
      return
    }
    
    if (additionalHandlers[key]) {
      additionalHandlers[key](e)
    }
  }
}

// Enhanced state management functions
const createToggle = (getElement, showMessage, hideMessage) => () => {
  const element = getElement()
  if (!element) return
  
  const isVisible = element.style.opacity !== '0' && element.style.display !== 'none'
  
  if (!isVisible) {
    showElement(element, showMessage)
    return
  }
  
  hideElement(element, hideMessage)
}

const showElement = (element, message) => {
  element.style.opacity = '0.95'
  element.style.display = 'block'
  toastSystem.create(message, 'info', config.ui.timing.toast)
}

const hideElement = (element, message) => {
  element.style.opacity = '0'
  setTimeout(() => {
    if (element.style.opacity === '0') element.style.display = 'none'
  }, 300)
  toastSystem.create(message, 'info', config.ui.timing.toast)
}

const toggleSidebar = () => {
  if (state.isSidebarOpen) {
    sidebar.close()
    return
  }
  sidebar.open()
}

const toggleLegend = createToggle(
  () => document.getElementById('pickr-legend-overlay'),
  'Legend shown',
  'Legend hidden'
)

const toggleFullHelp = createToggle(
  () => document.getElementById('pickr-legend-overlay'),
  'Full help opened',
  'Full help closed'
)

const togglePause = () => {
  setState({ isPaused: !state.isPaused })
  
  const legend = document.getElementById('pickr-legend-overlay')
  if (legend) {
    const pauseIndicator = legend.querySelector('.pause-indicator')
    if (pauseIndicator) {
      pauseIndicator.textContent = state.isPaused ? '⏸️ PAUSED' : ''
      pauseIndicator.style.display = state.isPaused ? 'inline' : 'none'
    }
  }
  
  const message = state.isPaused ? 'Selection paused' : 'Selection resumed'
  const type = state.isPaused ? 'warning' : 'success'
  toastSystem.create(message, type, config.ui.timing.toast)
}

// Move selection functionality
const moveSelection = (direction) => {
  if (!state.currentElement) {
    toastSystem.create('No element selected', 'warning', config.ui.timing.toast)
    return
  }
  
  const nextElement = getNextElement(direction, state.currentElement)
  
  if (!nextElement || isPickrElement(nextElement)) {
    toastSystem.create(`No element ${direction}`, 'warning', config.ui.timing.toast)
    return
  }
  
  selectElement(nextElement)
  nextElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  toastSystem.create(`Moved ${direction}`, 'info', config.ui.timing.toast)
}

const getNextElement = (direction, element) => {
  const directionMap = {
    up: () => findElementInDirection(element, 'up'),
    down: () => findElementInDirection(element, 'down'),
    left: () => findElementInDirection(element, 'left'),
    right: () => findElementInDirection(element, 'right'),
    previous: () => findPreviousElement(element),
    next: () => findNextElement(element)
  }
  
  return directionMap[direction]?.() || null
}

const selectElement = (element) => {
  // Clear previous selection
  if (state.currentElement) {
    state.currentElement.style.outline = ''
    state.currentElement.style.outlineOffset = ''
  }
  
  // Set new selection
  setState({ currentElement: element })
  domOps.setStyles(element, {
    outline: '2px solid rgba(59, 130, 246, 0.6)',
    outlineOffset: '2px'
  })
  
  updateHighlight(element)
  sidebar.update(templates.mouseStats(elementOps.getStats(element)))
}

// Helper functions for element navigation
const findElementInDirection = (element, direction) => {
  const rect = element.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  
  const directionMap = {
    up: { x: centerX, y: rect.top - 10 },
    down: { x: centerX, y: rect.bottom + 10 },
    left: { x: rect.left - 10, y: centerY },
    right: { x: rect.right + 10, y: centerY }
  }
  
  const target = directionMap[direction]
  if (!target) return null
  
  const elementAtPoint = document.elementFromPoint(target.x, target.y)
  return elementAtPoint && elementAtPoint !== element ? elementAtPoint : null
}

const findPreviousElement = (element) => {
  const allElements = [...document.querySelectorAll('*')].filter(el => 
    !isPickrElement(el) && 
    el.offsetWidth > 0 && 
    el.offsetHeight > 0 &&
    window.getComputedStyle(el).display !== 'none'
  )
  
  const currentIndex = allElements.indexOf(element)
  if (currentIndex > 0) {
    return allElements[currentIndex - 1]
  }
  return null
}

const findNextElement = (element) => {
  const allElements = [...document.querySelectorAll('*')].filter(el => 
    !isPickrElement(el) && 
    el.offsetWidth > 0 && 
    el.offsetHeight > 0 &&
    window.getComputedStyle(el).display !== 'none'
  )
  
  const currentIndex = allElements.indexOf(element)
  if (currentIndex < allElements.length - 1) {
    return allElements[currentIndex + 1]
  }
  return null
}

// Simple cleanup system
const cleanup = {
  // Cleanup tasks
  events: (cleanups) => eventManager.removeAll(cleanups),
  highlight: () => updateHighlight(null),
  overlays: () => {
    legendOverlay.remove()
    compactHelpOverlay.remove()
    contextMenu.hide()
  },
  sidebar: () => sidebar.close(),
  inputOverlay: () => {
    const inputOverlay = document.getElementById('pickr-input-overlay')
    if (inputOverlay) domOps.remove(inputOverlay)
  },
  outlines: () => {
    document.querySelectorAll(config.selectors.highlightedElements).forEach(el => {
      el.style.outline = ''
      el.style.outlineOffset = ''
    })
  },
  state: () => setState({ activeMode: null, currentElement: null, isPaused: false }),
  feedback: () => toastSystem.create('Mode exited', 'info', config.ui.timing.toast),
  
  // Execute cleanup
  all: (cleanups) => {
    cleanup.events(cleanups)
    cleanup.highlight()
    cleanup.overlays()
    cleanup.sidebar()
    cleanup.inputOverlay()
    cleanup.outlines()
    cleanup.state()
    cleanup.feedback()
  }
}

// Simple exit function
const exitMode = (cleanups) => cleanup.all(cleanups)

// Simple state management
const state = createState({
  sidebar: null,
  isSidebarOpen: false,
  activeMode: null,
  isPaused: false,
  currentElement: null
})

// Simple state helpers
const setState = (updates) => Object.assign(state, updates)
const getState = () => ({ ...state })

// Sidebar operations
const sidebar = {
  open: () => {
    if (state.isSidebarOpen) return
    state.sidebar = state.sidebar || createSidebar()
    state.sidebar.style.transform = 'translateX(0)'
    setState({ isSidebarOpen: true })
    state.sidebar.querySelector('#pickr-close').onclick = sidebar.close
  },
  
  close: () => {
    if (!state.sidebar || !state.isSidebarOpen) return
    state.sidebar.style.transform = 'translateX(100%)'
    setState({ isSidebarOpen: false, activeMode: null })
  },
  
  update: (content) => {
    if (!state.sidebar) return
    state.sidebar.querySelector('#pickr-content').innerHTML = content
  }
}

// Simple context menu
const contextMenu = {
  show: (element, event) => {
    contextMenu.hide()
    
    const menu = domOps.create('div', {
      id: 'pickr-context-menu',
      innerHTML: contextMenu.getContent()
    })
    
    domOps.setStyles(menu, {
      position: 'fixed',
      left: `${event.clientX}px`,
      top: `${event.clientY}px`,
      background: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      padding: '8px 0',
      fontSize: '14px',
      zIndex: '999999',
      minWidth: '180px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    })
    
    domOps.append(document.body, menu)
    
    // Handle menu item clicks
    menu.addEventListener('click', async (e) => {
      const item = e.target.closest('.context-menu-item')
      if (item) {
        const actionKey = item.dataset.action
        if (actionKey && window.pickrActionManager) {
          const result = await window.pickrActionManager.executeByKey(actionKey, element)
          if (result) {
            toastSystem.create(result.feedback, result.error ? 'error' : 'success', config.ui.timing.toast)
          }
        }
        contextMenu.hide()
      }
    })
    
    // Hide menu on outside click
    setTimeout(() => {
      document.addEventListener('click', (e) => {
        if (!menu.contains(e.target)) contextMenu.hide()
      })
    }, 100)
  },
  
  getContent: () => {
    const actions = window.pickrActionManager ? window.pickrActionManager.getAll() : []
    const grouped = actions.reduce((acc, action) => {
      if (!acc[action.category]) acc[action.category] = []
      acc[action.category].push(action)
      return acc
    }, {})
    
    return Object.entries(grouped).map(([category, categoryActions]) => `
      <div class="context-menu-category">
        <div class="context-menu-category-header" style="
          padding: 4px 16px;
          font-size: 11px;
          color: rgba(255,255,255,0.6);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          margin-bottom: 4px;
        ">${category}</div>
        ${categoryActions.map(action => `
          <div class="context-menu-item" data-action="${action.key}" style="
            padding: 8px 16px;
            cursor: pointer;
            color: white;
            transition: background 0.2s;
            display: flex;
            justify-content: space-between;
            align-items: center;
          " onmouseenter="this.style.background='rgba(255,255,255,0.1)'" onmouseleave="this.style.background='transparent'">
            <span>${action.description}</span>
            <kbd style="
              background: rgba(255,255,255,0.2);
              color: white;
              border-radius: 4px;
              padding: 2px 6px;
              font-size: 11px;
              font-family: monospace;
              border: 1px solid rgba(255,255,255,0.3);
            ">${action.key.toUpperCase()}</kbd>
          </div>
        `).join('')}
      </div>
    `).join('')
  },
  
  hide: () => {
    const menu = document.getElementById('pickr-context-menu')
    if (menu) menu.remove()
  }
}

// Mouse selector mode
const pickrMouseSelector = () => {
  setState({ activeMode: 'mouse', isPaused: false, currentElement: null })
  sidebar.open()
  legendOverlay.create('mouse')
  compactHelpOverlay.create('mouse')
  
  const cleanups = []
  
  const handleMouseMove = (e) => {
    if (state.isPaused) return
    
    const element = e.target
    
    // Early return for pickr elements
    if (isPickrElement(element)) {
      clearCurrentElement()
      return
    }
    
    // Early return if same element
    if (element === state.currentElement) return
    
    // Clear previous element
    clearCurrentElement()
    
    // Set new element
    setCurrentElement(element)
  }
  
  const clearCurrentElement = () => {
    if (!state.currentElement) return
    state.currentElement.style.outline = ''
    state.currentElement.style.outlineOffset = ''
    setState({ currentElement: null })
    updateHighlight(null)
  }
  
  const setCurrentElement = (element) => {
    setState({ currentElement: element })
    domOps.setStyles(element, {
      outline: '2px solid rgba(59, 130, 246, 0.6)',
      outlineOffset: '2px'
    })
    updateHighlight(element)
    sidebar.update(templates.mouseStats(elementOps.getStats(element)))
  }
  
  const handleKeyDown = createKeyboardHandler(cleanups)
  
  // Declarative event registration
  const mouseHandlers = {
    mousemove: handleMouseMove,
    ...Object.fromEntries(
      Object.entries(eventMappings.mouse).map(([event, alias]) => [
        event, 
        createEventHandler(alias)
      ])
    )
  }
  
  const keyboardHandlers = {
    keydown: handleKeyDown
  }
  
  cleanups.push(
    ...eventManager.register.mouse(document, mouseHandlers),
    ...eventManager.register.keyboard(document, keyboardHandlers)
  )
}

// Input selector mode
const pickrInputSelector = () => {
  setState({ activeMode: 'input', isPaused: false, currentElement: null })
  sidebar.open()
  legendOverlay.create('input')
  compactHelpOverlay.create('input')
  
  const inputOverlay = domOps.create('div', {
    id: 'pickr-input-overlay',
    innerHTML: /*html*/`
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="color: #6b7280; font-size: 14px; font-weight: 500;">CSS Selector:</span>
        <input type="text" id="pickr-selector-input" placeholder="Enter CSS selector (e.g., .class, #id, tag)" style="
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 14px;
          font-family: 'SF Mono', Monaco, monospace;
          width: 350px;
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        ">
        <button id="pickr-close-input" style="
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #6b7280;
          padding: 6px;
          border-radius: 6px;
          transition: background 0.2s;
        ">×</button>
      </div>
    `
  })
  
  pipe(
    tap(el => domOps.setStyles(el, {
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: '999997',
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(25px)',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    })),
    tap(el => domOps.append(document.body, el))
  )(inputOverlay)
  
  const input = inputOverlay.querySelector('#pickr-selector-input')
  input.focus()
  
  const cleanups = []
  
  const updateResults = debounce((selector) => {
    if (state.isPaused) return
    
    // Early return for empty selector
    if (!selector.trim()) {
      updateHighlight(null)
      sidebar.update(/*html*/`
        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px;">Input Selector</h4>
          <div style="color: #6b7280; text-align: center; padding: 40px 20px;">
            <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;">⌨️</div>
            <div style="font-weight: 500; margin-bottom: 8px;">Enter a CSS selector</div>
            <div style="font-size: 13px;">Examples: .class, #id, tag, tag.class</div>
          </div>
        </div>
      `)
      return
    }
    
    // Clear existing outlines
    document.querySelectorAll(config.selectors.highlightedElements).forEach(el => {
      el.style.outline = ''
      el.style.outlineOffset = ''
    })
    
    // Early return for invalid selector
    if (!elementOps.isValidSelector(selector)) {
      updateHighlight(null)
      sidebar.update(templates.error(`Invalid selector: ${selector}`))
      return
    }
    
    const elements = elementOps.queryAll(selector)
    
    // Early return for no elements
    if (elements.length === 0) {
      updateHighlight(null)
      sidebar.update(templates.error(`No elements found for selector: ${selector}`))
      return
    }
    
    const validElements = elements.filter(el => !isPickrElement(el))
    
    // Early return for no valid elements
    if (validElements.length === 0) {
      updateHighlight(null)
      sidebar.update(templates.error(`No valid elements found (excluding interface elements)`))
      return
    }
    
    // Process valid elements
    validElements.forEach((el, index) => {
      if (index === 0) {
        updateHighlight(el)
        setState({ currentElement: el })
      }
      domOps.setStyles(el, {
        outline: '2px solid rgba(59, 130, 246, 0.6)',
        outlineOffset: '2px'
      })
    })
    
    sidebar.update(templates.inputResults(selector, validElements))
  }, config.ui.timing.debounce)
  
  const handleInput = (e) => updateResults(e.target.value)
  
  const handleKeyDown = createKeyboardHandler(cleanups, {
    enter: (e) => {
      e.preventDefault()
      updateResults(input.value)
    }
  })
  
  inputOverlay.querySelector('#pickr-close-input').onclick = () => {
    exitMode(cleanups)
  }
  
  // Declarative event registration
  const inputHandlers = {
    input: handleInput
  }
  
  const keyboardHandlers = {
    keydown: handleKeyDown
  }
  
  cleanups.push(
    ...eventManager.register.mouse(input, inputHandlers),
    ...eventManager.register.keyboard(document, keyboardHandlers)
  )
}

// Export functions to global scope for service worker access
window.pickrMouseSelector = pickrMouseSelector
window.pickrInputSelector = pickrInputSelector

// Element selector ready
}