// src/lib/logger.js
/**
 * Logger utility that only logs in development environment.
 * All debug/info logs are stripped in production.
 */

const isDevelopment = import.meta.env.DEV;

const logger = {
  /**
   * Debug level - only shows in development
   */
  debug: (...args) => {
    if (isDevelopment) {
      console.log("[DEBUG]", ...args);
    }
  },

  /**
   * Info level - only shows in development
   */
  info: (...args) => {
    if (isDevelopment) {
      console.info("[INFO]", ...args);
    }
  },

  /**
   * Warning level - always shows (potential issues)
   */
  warn: (...args) => {
    console.warn("[WARN]", ...args);
  },

  /**
   * Error level - always shows, consider sending to error tracking
   */
  error: (...args) => {
    console.error("[ERROR]", ...args);
    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
  },
};

export default logger;
