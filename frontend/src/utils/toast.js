/**
 * Toast Notification Utility
 * Simple toast notification system
 */

const DEFAULT_DURATION = 4000;

// Callback to handle toast display
let toastCallback = null;

/**
 * Register the toast callback (called from React component)
 */
export const registerToastCallback = (callback) => {
  toastCallback = callback;
};

/**
 * Show success toast
 */
export const showSuccessToast = (message, duration = DEFAULT_DURATION) => {
  if (toastCallback) {
    toastCallback({
      message,
      type: 'success',
      duration,
    });
  } else {
    console.log('Success:', message);
  }
};

/**
 * Show error toast
 */
export const showErrorToast = (message, duration = DEFAULT_DURATION) => {
  if (toastCallback) {
    toastCallback({
      message,
      type: 'error',
      duration,
    });
  } else {
    console.error('Error:', message);
  }
};

/**
 * Show warning toast
 */
export const showWarningToast = (message, duration = DEFAULT_DURATION) => {
  if (toastCallback) {
    toastCallback({
      message,
      type: 'warning',
      duration,
    });
  } else {
    console.warn('Warning:', message);
  }
};

/**
 * Show info toast
 */
export const showInfoToast = (message, duration = DEFAULT_DURATION) => {
  if (toastCallback) {
    toastCallback({
      message,
      type: 'info',
      duration,
    });
  } else {
    console.info('Info:', message);
  }
};
