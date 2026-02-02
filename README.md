<img width="1522" height="1134" alt="Screenshot 2026-02-02 132947" src="https://github.com/user-attachments/assets/ac0f0af2-e95e-4591-b848-e30c89675822" />

## Running Liquid

1. **Install Shopify CLI:**
```bash
npm install -g @shopify/cli @shopify/theme
```

2. **Theme directory:**
```bash
cd Liquid-main
```

3. **Development server [2, IDE browser]:**
```bash
shopify theme dev
```


## MCP (Model Context Protocol, Cursor)

1. **Install MCP Server Dependencies:**
```bash
cd mcp-server
npm install
npm run build
```

2. **Copy .mcp-config.json:**
```bash
Copy-Item .mcp-config.example.json .mcp-config.json
```

3. **Add MCP server in Cursor:**
   1. Create the file `.cursor/mcp.json` in the project root (create the `.cursor` folder if needed).
   2. Add a server entry like this (working directory = project root):
      ```json
      {
        "mcpServers": {
          "storefront-api": {
            "command": "node",
            "args": ["./mcp-server/dist/index.js"],
            "cwd": "."
          }
        }
      }
      ```

4. **Verify MCP server is connected:**
   - File → Preferences → Cursor Settings
   - Navigate to **Tools & MCP**
   - Verify the "storefront-api" server shows as connected/running


## Storefront API WebAssembly Module

### 1. Install

# Install wasm-pack
cargo install wasm-pack

# Add WebAssembly target
rustup target add wasm32-unknown-unknown
```

### 2. Build the WebAssembly Module

**Windows:**
```cmd
cd storefront-api-wasm
build.bat
```

This will create the WebAssembly files in `Liquid-main/assets/wasm/`:
- `storefront_api_wasm.js` - JavaScript bindings
- `storefront_api_wasm_bg.wasm` - Compiled WebAssembly binary
- Etc

### 3. Get Your Storefront API Token

**Option A — Headless channel (recommended)**

1. Go to **Apps** (or **Settings** > **Apps and sales channels**)
2. Click **App Store**, install **Headless**.
3. Click **Create storefront** , manage
4. Copy the **private access token**. Next, add it to your theme using the steps in **Add to Your Theme** below.

### 4. Add to Your Theme

**Quick (development only)**  
1. Open your theme’s `layout/theme.liquid`.  
2. Adding the Storefront API script block and your token before the closing </body> tag.  
3. Replace `'YOUR_STOREFRONT_API_ACCESS_TOKEN'` with the token you copied.  
4. Save. Don’t commit this file with the real token.

**Better for production (theme setting)**  
1. In the theme editor: **Online Store** → **Themes** → **Customize** → **Theme settings** (or **App embeds** / a section that supports custom settings). Add a text setting (e.g. name: `Storefront API token`) and paste the token there. Save.  
2. In your theme’s `config/settings_schema.json`, define the setting if it doesn’t exist (e.g. `{ "type": "text", "id": "storefront_api_token", "label": "Storefront API token" }`).  
3. In `layout/theme.liquid`, add the script block below and set `accessToken` from the setting, e.g. `const accessToken = {{ settings.storefront_api_token | json }};`.  
4. Save. The token stays in the editor, not in your repo.

---

In `layout/theme.liquid`, before the closing `</body>` tag:

```liquid
<script src="{{ 'storefront-api.js' | asset_url }}" defer></script>
<script src="{{ 'storefront-api-integration.js' | asset_url }}" defer></script>

<script type="module">
  const apiIntegration = new StorefrontApiIntegration();
  
  // Quick: paste token here (dev only). Production: use theme setting (see above).
  const accessToken = 'YOUR_STOREFRONT_API_ACCESS_TOKEN';
  
  if (accessToken && accessToken !== 'YOUR_STOREFRONT_API_ACCESS_TOKEN') {
    await apiIntegration.init(accessToken);
    window.storefrontApi = apiIntegration; // Make available globally
  }
</script>
```

For production, use: `const accessToken = {{ settings.storefront_api_token | json }};` and remove the placeholder check if desired.

### 5. Use It

```javascript
// Fetch a product
const product = await window.storefrontApi.fetchProduct('product-handle');

// Fetch a collection
const collection = await window.storefrontApi.fetchCollection('collection-handle', 20);

// Search products
const results = await window.storefrontApi.searchProducts('search term', 10);

// Create a cart
const cart = await window.storefrontApi.createCart([
  {
    variantId: 'gid://shopify/ProductVariant/123456789',
    quantity: 1
  }
]);
```

### Function

Shopify Liquid theme setup, Storefront API WebAssembly module, MCP (Model Context Protocol) server for Cursor.

### History

2006, Liquid was created by Shopify in  as the templating language for themes; the Storefront API and headless/storefront use followed in later years. 
2025, Liquid and the Storefront API are used for custom storefronts, theme app extensions, and programmatic access to catalog and cart from JS/WASM, alongside Hydrogen and other stacks.

### Structure

```text
storefront-api-wasm/
├── src/
│   └── lib.rs                      # Rust Storefront API WASM logic                   (Backend)  (Source)
├── Cargo.toml                      # Rust project and dependency configuration        (Backend)  (Config)
├── build.sh                        # Build script for Linux/macOS                     (Backend)  (Config)
├── build.bat                       # Build script for Windows                         (Backend)  (Config)
└── .cargo/
    └── config.toml                 # Rust compiler configuration                     (Backend)  (Config)

Liquid-main/assets/
├── storefront-api.js               # WebAssembly wrapper client                      (Frontend) (Static / Script)
├── storefront-api-integration.js   # High-level integration helper                   (Frontend) (Static / Script)
└── wasm/                           # Compiled WebAssembly output                     (Frontend) (Static / WASM)
    ├── storefront_api_wasm.js
    ├── storefront_api_wasm_bg.wasm
    └── ...

mcp-server/
├── src/
│   └── index.ts                    # MCP server implementation                       (Backend)  (Source)
├── package.json                    # Node.js dependencies                            (Backend)  (Config)
├── tsconfig.json                   # TypeScript configuration                        (Backend)  (Config)
└── README.md                       # MCP server documentation                        (Config)   (Docs)
