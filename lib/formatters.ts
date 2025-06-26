// utils/formatters.js

/**
 * Format number with locale-specific formatting
 * @param {number} value - The number to format
 * @param {string} locale - The locale to use (default: 'en-US')
 * @returns {string} Formatted number
 */
export const formatNumber = (value: number, locale = 'en-US') => {
    if (value === null || value === undefined) return '0';
    return new Intl.NumberFormat(locale).format(value);
  };
  
  /**
   * Format currency value
   * @param {number} value - The value to format
   * @param {string} currency - The currency code
   * @param {string} suffix - Optional suffix (K, M, etc.)
   * @returns {string} Formatted currency
   */
  export const formatCurrency = (value: number, currency: string, suffix = '') => {
    if (value === null || value === undefined) return '0';
    return `${formatNumber(value)}${suffix}`;
  };
  
  /**
   * Format percentage change with appropriate color class
   * @param {number} change - The percentage change
   * @returns {object} Object with formatted text and color class
   */
  export const formatPercentageChange = (change: number) => {
    if (change === null || change === undefined) {
      return { text: '--', colorClass: 'text-gray-400' };
    }
    
    const sign = change > 0 ? '+' : '';
    const colorClass = change > 0 
      ? 'text-green-400' 
      : change < 0 
        ? 'text-red-400' 
        : 'text-gray-400';
    
    return {
      text: `${sign}${change.toFixed(2)}%`,
      colorClass
    };
  };
  
  /**
   * Format volume with dollar sign
   * @param {number} value - The volume value
   * @returns {string} Formatted volume
   */
  export const formatVolume = (value: number) => {
    if (value === null || value === undefined) return '$0';
    return `$${formatNumber(value)}`;
  };
  
  /**
   * Generate fallback image data URL
   * @param {string} text - Text to display in fallback
   * @returns {string} Data URL for fallback image
   */
  export const generateFallbackImage = (text = '?') => {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23374151'/%3E%3Ctext x='20' y='20' text-anchor='middle' dy='.3em' fill='%236B7280' font-size='12'%3E${text}%3C/text%3E%3C/svg%3E`;
  };
  
  /**
   * Truncate text with ellipsis
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated text
   */
  export const truncateText = (text: string, maxLength = 20) => {
    if (!text || text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };