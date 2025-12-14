/**
 * Formatting Property Tests
 * **Feature: anime-aws-dashboard, Property 9: Timestamp Formatting**
 * **Feature: anime-aws-dashboard, Property 10: Error Message Generation**
 * **Validates: Requirements 6.4, 7.2**
 */

const FormattingTests = (function () {
  "use strict";

  const fc = window.fc || fastcheck;

  // Arbitrary for valid dates
  const validDateArb = fc.date({
    min: new Date("2000-01-01"),
    max: new Date("2030-12-31"),
  });

  // Arbitrary for error types
  const errorTypeArb = fc.constantFrom(
    "network",
    "NetworkError",
    "fetch failed",
    "connection refused",
    "timeout",
    "AbortError",
    "request aborted",
    "parse",
    "JSON.parse",
    "SyntaxError",
    "invalid json",
    "api",
    "rate limit",
    "API error",
    "429",
    "unknown",
    "random error",
    "",
    null,
    undefined
  );

  const tests = [];

  /**
   * Property 9: Timestamp Formatting
   * For any valid Date object, the formatting function SHALL produce a
   * human-readable string containing the date and time components in a consistent format.
   */
  tests.push({
    name: "Property 9: Timestamp Formatting - Returns non-empty string for valid dates",
    property: function () {
      return fc.assert(
        fc.property(validDateArb, (date) => {
          const formatted = UIController.formatTimestamp(date);
          return (
            typeof formatted === "string" &&
            formatted.length > 0 &&
            formatted !== "--"
          );
        }),
        { numRuns: 100 }
      );
    },
  });

  tests.push({
    name: "Property 9: Timestamp Formatting - Contains year component",
    property: function () {
      return fc.assert(
        fc.property(validDateArb, (date) => {
          const formatted = UIController.formatTimestamp(date);
          const year = date.getFullYear().toString();
          return formatted.includes(year);
        }),
        { numRuns: 100 }
      );
    },
  });

  tests.push({
    name: "Property 9: Timestamp Formatting - Contains time component (AM/PM)",
    property: function () {
      return fc.assert(
        fc.property(validDateArb, (date) => {
          const formatted = UIController.formatTimestamp(date);
          return formatted.includes("AM") || formatted.includes("PM");
        }),
        { numRuns: 100 }
      );
    },
  });

  tests.push({
    name: "Property 9: Timestamp Formatting - Returns placeholder for invalid dates",
    property: function () {
      // Test with invalid date inputs
      const invalidInputs = [
        new Date("invalid"),
        null,
        undefined,
        "not a date",
        123,
      ];

      return invalidInputs.every((input) => {
        const formatted = UIController.formatTimestamp(input);
        return formatted === "--";
      });
    },
  });

  tests.push({
    name: "Property 9: Timestamp Formatting - Consistent format structure",
    property: function () {
      return fc.assert(
        fc.property(validDateArb, (date) => {
          const formatted = UIController.formatTimestamp(date);
          // Should contain comma (separating date parts) and colon (time)
          return formatted.includes(",") && formatted.includes(":");
        }),
        { numRuns: 100 }
      );
    },
  });

  /**
   * Property 10: Error Message Generation
   * For any error type (network, parsing, timeout, unknown), the error message
   * function SHALL return a non-empty, user-friendly string that does not expose
   * technical details or stack traces.
   */
  tests.push({
    name: "Property 10: Error Message Generation - Returns non-empty string",
    property: function () {
      return fc.assert(
        fc.property(errorTypeArb, (errorType) => {
          const message = UIController.getErrorMessage(errorType);
          return typeof message === "string" && message.length > 0;
        }),
        { numRuns: 100 }
      );
    },
  });

  tests.push({
    name: "Property 10: Error Message Generation - Does not contain stack traces",
    property: function () {
      return fc.assert(
        fc.property(errorTypeArb, (errorType) => {
          const message = UIController.getErrorMessage(errorType);
          // Stack traces typically contain "at " followed by function names
          const hasStackTrace =
            /at\s+\w+/.test(message) ||
            message.includes("Error:") ||
            message.includes("line ") ||
            message.includes(".js:");
          return !hasStackTrace;
        }),
        { numRuns: 100 }
      );
    },
  });

  tests.push({
    name: "Property 10: Error Message Generation - Does not expose technical details",
    property: function () {
      return fc.assert(
        fc.property(errorTypeArb, (errorType) => {
          const message = UIController.getErrorMessage(errorType);
          // Should not contain technical terms that users wouldn't understand
          const technicalTerms = [
            "undefined",
            "null",
            "NaN",
            "TypeError",
            "ReferenceError",
            "SyntaxError",
            "exception",
            "stack",
            "trace",
            "debug",
            "console",
            "localhost",
            "127.0.0.1",
            "http://",
            "https://",
          ];
          return !technicalTerms.some((term) =>
            message.toLowerCase().includes(term.toLowerCase())
          );
        }),
        { numRuns: 100 }
      );
    },
  });

  tests.push({
    name: "Property 10: Error Message Generation - Is user-friendly (contains actionable text)",
    property: function () {
      return fc.assert(
        fc.property(errorTypeArb, (errorType) => {
          const message = UIController.getErrorMessage(errorType);
          // User-friendly messages typically contain words like "please", "try", "check"
          const friendlyPatterns = [
            /please/i,
            /try/i,
            /check/i,
            /unable/i,
            /issue/i,
            /unavailable/i,
            /unexpected/i,
            /connection/i,
          ];
          return friendlyPatterns.some((pattern) => pattern.test(message));
        }),
        { numRuns: 100 }
      );
    },
  });

  tests.push({
    name: "Property 10: Error Message Generation - Network errors mention connection",
    property: function () {
      const networkErrors = [
        "network",
        "NetworkError",
        "fetch failed",
        "connection",
      ];
      return networkErrors.every((errorType) => {
        const message = UIController.getErrorMessage(errorType);
        return (
          message.toLowerCase().includes("connect") ||
          message.toLowerCase().includes("internet")
        );
      });
    },
  });

  tests.push({
    name: "Property 10: Error Message Generation - Timeout errors mention time",
    property: function () {
      const timeoutErrors = ["timeout", "AbortError"];
      return timeoutErrors.every((errorType) => {
        const message = UIController.getErrorMessage(errorType);
        return (
          message.toLowerCase().includes("long") ||
          message.toLowerCase().includes("time") ||
          message.toLowerCase().includes("again")
        );
      });
    },
  });

  return {
    name: "Formatting Tests",
    tests: tests,
  };
})();
