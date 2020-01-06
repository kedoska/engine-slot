Standard Configuration Library
==============================

The following library contains configurations for the engine-slot.

Engine-slot is available in Github, under GPL-2.0, at the following link
https://github.com/kedoska/engine-slot


The primary purpose is to provide users with a ready-to-go configuration usable, without diving too much into statistics and complex game configurations.

## Configurations

All the configurations are built on top of a specific version of the engine-slot. Please make sure to double-check the version for your engine before to load a new configuration into it. A mismatch between configuration and _engine_ will result in a complete different RTP.

|Code | Ver| Min  | Max  | Lines | FS  |  Wild  |  Symbols  |
|---|---|---|---|---|---|---|---|
|`A001`| 0.0.4  | 0.8800  | 0.9500 | 21 _rtl_ | Yes  |  Yes | 10 +2 |
|`A001`| 0.0.4  | 0.9200  | 0.9700 | 21 _rtl_ | Yes  |  Yes | 10 +2 |
|   |   |   |   |   |   |   |   |

### Example

To use the configuration returning to the player (having RTP) up to 95% of its risk, assuming the `A001` has the feature you like, you can load the configuration into the `engine-slot` using the following code:

```javascript
import * as a001 from '@kedoska/engine-slot-scl/A001'

const config = a001.configure(a001.weights8895)
...
```