# Actions System

This directory contains the modular action plugin system for pickr.

## Action Contract

Each action file should define an action object and register it with the global manager:

```javascript
// Define the action
const myAction = {
  name: 'Action Name',
  key: 'single_character_key',
  description: 'Brief description of what the action does',
  category: 'copy|inspect|modify|navigate',
  execute: (element) => {
    // Action logic here
    return {
      feedback: 'User-friendly feedback message',
      result: 'The actual result data'
    }
  }
}

// Register with global manager
if (window.pickrActionManager) window.pickrActionManager.register(myAction)
```

## Required Properties

- **name**: Human-readable name for the action
- **key**: Single character keyboard shortcut (a-z, 0-9)
- **description**: Brief description shown in help overlay
- **category**: One of: copy, inspect, modify, navigate
- **execute**: Function that takes an element and returns { feedback, result }

## Return Contract

The execute function must return an object with:

- **feedback**: String message shown to user
- **result**: The actual data/result of the action
- **error** (optional): Boolean indicating if an error occurred

## Categories

- **copy**: Actions that copy data to clipboard
- **inspect**: Actions that show element details
- **modify**: Actions that change element appearance/behavior
- **navigate**: Actions that navigate or focus elements

## Adding New Actions

1. Create a new file in this directory (e.g., `my-action.js`)
2. Define an action object following the contract above
3. Register it with `window.pickrActionManager.register(myAction)`
4. The action will be automatically available when the action manager loads

## Key Conflicts

If you choose a key that's already taken, the system will warn you but still register the action. Use `actionManager.getAvailableKeys()` to see available keys.

## Loading Order

1. `action-manager.js` - Creates the global manager
2. Individual action files - Each registers itself with the manager
3. The manager is available as `window.pickrActionManager` 