<img width="337" height="468" alt="1" src="https://github.com/user-attachments/assets/b7091ea3-78bf-45af-89dd-176fe1772a9b" />

## Liquid

1. **Install Shopify CLI:**
```bash
npm install -g @shopify/cli @shopify/theme
```

2. **Theme directory:**
```bash
cd Liquid-main
```

3. **Development server [2]:**
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

# Install wasm-pack
```cmd
cargo install wasm-pack
```

### 2. Build the WebAssembly Module

```cmd
cd storefront-api-wasm
build.bat
```

This will create the WebAssembly files in `Liquid-main/assets/wasm/`:
- `storefront_api_wasm.js` - JavaScript bindings
- `storefront_api_wasm_bg.wasm` - Compiled WebAssembly binary
- Etc

### 3. Get Your Storefront API Token

1. Go to **Apps** (or **Settings** > **Apps and sales channels**)
2. Click **App Store**, install **Headless**.
3. Click **Storefront API** , manage
4. Copy the **private access token**. 

In `Liquid-main/layout/theme.liquid`, before the closing `</body>` tag:

```
    <script src="{{ 'storefront-api.js' | asset_url }}" defer></script>
    <script src="{{ 'storefront-api-integration.js' | asset_url }}" defer></script>
    <script type="module">
      const apiIntegration = new StorefrontApiIntegration();
      const accessToken = 'API_ACCESS_TOKEN'; // paste token
      if (accessToken) {
        await apiIntegration.init(accessToken);
        window.storefrontApi = apiIntegration;
      }
    </script>

  </body>
```

```cmd
window.storefrontApi  //Console, check if the API is loaded.
```

### Function

Shopify Liquid theme setup, Storefront API WebAssembly module, MCP (Model Context Protocol) server for Cursor.

### History

2006, Liquid was created by Shopify in  as the templating language for themes; the Storefront API and headless/storefront use followed in later years. 
2025, Liquid and the Storefront API are used for custom storefronts, theme app extensions, and programmatic access to catalog and cart from JS/WASM, alongside Hydrogen and other stacks.

### Structure

```text
Liquid-main/
├── layout/                         # Theme layout templates                          (Frontend) (Liquid)
│   ├── theme.liquid                # Main layout (Storefront API script injection)   (Frontend) (Liquid)
│   ├── password.liquid             # Password page layout                            (Frontend) (Liquid)
│   └── config/                     # Theme settings                                  (Config)
│       ├── settings_data.json
│       └── settings_schema.json

mcp-server/                         # MCP server for Cursor (storefront-api)
├── src/
│   └── index.ts                    # MCP server implementation                       (Backend)  (Source)
├── package.json                    # Node.js dependencies                            (Backend)  (Config)
├── tsconfig.json                   # TypeScript configuration                        (Backend)  (Config)

storefront-api-wasm/
├── src/
│   └── lib.rs                      # Rust Storefront API WASM logic                   (Backend)  (Source)
├── Cargo.toml                      # Rust project and dependency configuration        (Backend)  (Config)
├── build.sh                        # Build script for Linux/macOS                     (Backend)  (Config)
├── build.bat                       # Build script for Windows                         (Backend)  (Config)
└── .cargo/
    └── config.toml                 # Rust compiler configuration                      (Backend)  (Config)
