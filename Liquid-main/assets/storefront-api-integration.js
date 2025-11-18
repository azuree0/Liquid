/**
 * Storefront API Integration Example
 * 
 * This file demonstrates how to use the Storefront API WebAssembly client
 * in your Shopify theme.
 */

class StorefrontApiIntegration {
  constructor() {
    this.client = null;
    this.shopDomain = window.shopUrl?.replace(/^https?:\/\//, '') || '';
    this.accessToken = null; // Set this from your theme settings or environment
    this.apiVersion = '2024-01';
  }

  /**
   * Initialize the Storefront API client
   * Note: You need to set your Storefront API access token
   */
  async init(accessToken) {
    if (!accessToken) {
      console.warn('Storefront API access token is required');
      return;
    }

    this.accessToken = accessToken;
    this.client = new StorefrontApiClient(
      this.shopDomain,
      this.accessToken,
      this.apiVersion
    );

    await this.client.init();
    console.log('Storefront API Integration initialized');
  }

  /**
   * Fetch product data using Storefront API
   */
  async fetchProduct(handle) {
    if (!this.client) {
      throw new Error('Storefront API client not initialized');
    }

    try {
      const result = await this.client.getProduct(handle);
      return result?.product || null;
    } catch (error) {
      console.error('Failed to fetch product:', error);
      return null;
    }
  }

  /**
   * Fetch collection data using Storefront API
   */
  async fetchCollection(handle, limit = 20) {
    if (!this.client) {
      throw new Error('Storefront API client not initialized');
    }

    try {
      const result = await this.client.getCollection(handle, limit);
      return result?.collection || null;
    } catch (error) {
      console.error('Failed to fetch collection:', error);
      return null;
    }
  }

  /**
   * Search products using Storefront API
   */
  async searchProducts(searchTerm, limit = 20) {
    if (!this.client) {
      throw new Error('Storefront API client not initialized');
    }

    try {
      const result = await this.client.searchProducts(searchTerm, limit);
      return result?.products?.edges || [];
    } catch (error) {
      console.error('Failed to search products:', error);
      return [];
    }
  }

  /**
   * Create a cart using Storefront API
   */
  async createCart(items) {
    if (!this.client) {
      throw new Error('Storefront API client not initialized');
    }

    try {
      const result = await this.client.createCart(items);
      const cart = result?.cartCreate?.cart;
      
      if (result?.cartCreate?.userErrors?.length > 0) {
        console.error('Cart creation errors:', result.cartCreate.userErrors);
        return null;
      }

      return cart;
    } catch (error) {
      console.error('Failed to create cart:', error);
      return null;
    }
  }
}

// Make available globally
if (typeof window !== 'undefined') {
  window.StorefrontApiIntegration = StorefrontApiIntegration;
}

