/* eslint-disable no-unused-vars */
/**
 * A global function to format currency.
 * It respects the currency code stored on the loan.
 * Defaults to USD if no currency is provided.
 */
export const formatCurrency = (amount, currencyCode = "USD") => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      // --- FIX: REMOVED THE FOLLOWING TWO LINES ---
      // minimumFractionDigits: 2,
      // maximumFractionDigits: 2,
    }).format(amount);
  } catch (err) {
    // Fallback for invalid currency code
    console.warn(`Invalid currency code: ${currencyCode}. Defaulting to USD.`);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      // --- FIX: ALSO REMOVED HERE FOR CONSISTENCY ---
      // minimumFractionDigits: 2,
      // maximumFractionDigits: 2,
    }).format(amount);
  }
};
