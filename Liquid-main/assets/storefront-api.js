/**
 * Shopify Storefront API WebAssembly Wrapper
 * 
 * This module provides a JavaScript interface to the Rust-based
 * WebAssembly Storefront API client.
 */

class StorefrontApiClient {
  constructor(shopDomain, accessToken, apiVersion = '2024-01') {
    this.shopDomain = shopDomain;
    this.accessToken = accessToken;
    this.apiVersion = apiVersion;
    this.wasmModule = null;
    this.api = null;
    this.initialized = false;
  }

  /**
   * Initialize the WebAssembly module
   */
  async init() {
    if (this.initialized) {
      return;
    }

    try {
      // Import the WebAssembly module
      const wasmModule = await import('./wasm/storefront_api_wasm.js');
      await wasmModule.default();
      
      // Get the StorefrontApi class from the module
      const { StorefrontApi } = await import('./wasm/storefront_api_wasm.js');
      
      // Initialize the API client
      this.api = new StorefrontApi(
        this.shopDomain,
        this.accessToken,
        this.apiVersion
      );
      
      this.initialized = true;
      console.log('Storefront API WebAssembly module initialized');
    } catch (error) {
      console.error('Failed to initialize Storefront API WebAssembly module:', error);
      throw error;
    }
  }

  /**
   * Execute a custom GraphQL query
   * @param {string} query - GraphQL query string
   * @param {Object} variables - Optional query variables
   * @returns {Promise<Object>} Query result
   */
  async query(query, variables = null) {
    if (!this.initialized) {
      await this.init();
    }

    try {
      const result = await this.api.query(query, variables);
      return result;
    } catch (error) {
      console.error('Storefront API query error:', error);
      throw error;
    }
  }

  /**
   * Get product by handle
   * @param {string} handle - Product handle
   * @returns {Promise<Object>} Product data
   */
  async getProduct(handle) {
    if (!this.initialized) {
      await this.init();
    }

    try {
      const result = await this.api.get_product(handle);
      return result;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  /**
   * Get collection by handle
   * @param {string} handle - Collection handle
   * @param {number} first - Number of products to fetch (default: 20)
   * @returns {Promise<Object>} Collection data
   */
  async getCollection(handle, first = 20) {
    if (!this.initialized) {
      await this.init();
    }

    try {
      const result = await this.api.get_collection(handle, first);
      return result;
    } catch (error) {
      console.error('Error fetching collection:', error);
      throw error;
    }
  }

  /**
   * Search products
   * @param {string} query - Search query
   * @param {number} first - Number of results (default: 20)
   * @returns {Promise<Object>} Search results
   */
  async searchProducts(query, first = 20) {
    if (!this.initialized) {
      await this.init();
    }

    try {
      const result = await this.api.search_products(query, first);
      return result;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  /**
   * Create a cart with items
   * @param {Array<{variantId: string, quantity: number}>} items - Cart items
   * @returns {Promise<Object>} Cart data
   */
  async createCart(items) {
    if (!this.initialized) {
      await this.init();
    }

    try {
      const result = await this.api.create_cart(items);
      return result;
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorefrontApiClient;
}

// Make available globally
if (typeof window !== 'undefined') {
  window.StorefrontApiClient = StorefrontApiClient;
}

