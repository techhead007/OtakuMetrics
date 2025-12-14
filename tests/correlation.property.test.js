/**
 * Correlation Property Tests
 * **Feature: anime-aws-dashboard, Property 7: Correlation Coefficient Calculation**
 * **Feature: anime-aws-dashboard, Property 8: Correlation Significance Classification**
 * **Validates: Requirements 5.1, 5.2**
 */

const CorrelationTests = (function () {
  "use strict";

  const fc = window.fc || fastcheck;

  // Arbitrary for numeric arrays
  const numericArrayArb = fc.array(
    fc.float({ min: -1000, max: 1000, noNaN: true, noDefaultInfinity: true }),
    { minLength: 2, maxLength: 100 }
  );

  // Arbitrary for correlation coefficients
  const correlationCoeffArb = fc.float({ min: -1, max: 1, noNaN: true });

  const tests = [];

  /**
   * Property 7: Correlation Coefficient Calculation
   * For any two numeric arrays of equal length (n ≥ 2), the correlation function
   * SHALL compute the Pearson correlation coefficient within the range [-1, 1]
   */
  tests.push({
    name: "Property 7: Correlation Coefficient - Result is within [-1, 1]",
    property: function () {
      return fc.assert(
        fc.property(numericArrayArb, numericArrayArb, (array1, array2) => {
          const correlation = Correlation.calculatePearsonCorrelation(
            array1,
            array2
          );
          return correlation >= -1 && correlation <= 1;
        }),
        { numRuns: 100 }
      );
    },
  });

  tests.push({
    name: "Property 7: Correlation Coefficient - Perfect positive correlation for identical arrays",
    property: function () {
      return fc.assert(
        fc.property(
          fc.array(fc.float({ min: 1, max: 1000, noNaN: true }), {
            minLength: 3,
            maxLength: 50,
          }),
          (array) => {
            // Add some variance to avoid constant arrays
            const variedArray = array.map((v, i) => v + i * 0.1);
            const correlation = Correlation.calculatePearsonCorrelation(
              variedArray,
              variedArray
            );
            // Should be very close to 1 (perfect positive correlation)
            return Math.abs(correlation - 1) < 0.0001;
          }
        ),
        { numRuns: 100 }
      );
    },
  });

  tests.push({
    name: "Property 7: Correlation Coefficient - Perfect negative correlation for inverse arrays",
    property: function () {
      return fc.assert(
        fc.property(
          fc.array(fc.float({ min: 1, max: 1000, noNaN: true }), {
            minLength: 3,
            maxLength: 50,
          }),
          (array) => {
            // Add variance and create inverse
            const variedArray = array.map((v, i) => v + i * 0.1);
            const inverseArray = variedArray.map((v) => -v);
            const correlation = Correlation.calculatePearsonCorrelation(
              variedArray,
              inverseArray
            );
            // Should be very close to -1 (perfect negative correlation)
            return Math.abs(correlation + 1) < 0.0001;
          }
        ),
        { numRuns: 100 }
      );
    },
  });

  tests.push({
    name: "Property 7: Correlation Coefficient - Symmetric (corr(X,Y) = corr(Y,X))",
    property: function () {
      return fc.assert(
        fc.property(numericArrayArb, numericArrayArb, (array1, array2) => {
          const corrXY = Correlation.calculatePearsonCorrelation(
            array1,
            array2
          );
          const corrYX = Correlation.calculatePearsonCorrelation(
            array2,
            array1
          );
          return Math.abs(corrXY - corrYX) < 0.0001;
        }),
        { numRuns: 100 }
      );
    },
  });

  tests.push({
    name: "Property 7: Correlation Coefficient - Returns 0 for arrays with length < 2",
    property: function () {
      const singleElement = fc.array(
        fc.float({ min: -100, max: 100, noNaN: true }),
        { minLength: 0, maxLength: 1 }
      );
      return fc.assert(
        fc.property(singleElement, singleElement, (array1, array2) => {
          const correlation = Correlation.calculatePearsonCorrelation(
            array1,
            array2
          );
          return correlation === 0;
        }),
        { numRuns: 50 }
      );
    },
  });

  tests.push({
    name: "Property 7: Correlation Coefficient - Returns 0 for constant arrays",
    property: function () {
      return fc.assert(
        fc.property(
          fc.float({ min: -100, max: 100, noNaN: true }),
          fc.integer({ min: 2, max: 50 }),
          numericArrayArb,
          (constant, length, otherArray) => {
            const constantArray = Array(length).fill(constant);
            const correlation = Correlation.calculatePearsonCorrelation(
              constantArray,
              otherArray
            );
            // Constant array has zero variance, so correlation should be 0
            return correlation === 0;
          }
        ),
        { numRuns: 100 }
      );
    },
  });

  /**
   * Property 8: Correlation Significance Classification
   * For any correlation coefficient value, the classification function SHALL return
   * "strong" for |r| ≥ 0.7, "moderate" for 0.4 ≤ |r| < 0.7,
   * "weak" for 0.2 ≤ |r| < 0.4, and "none" for |r| < 0.2
   */
  tests.push({
    name: "Property 8: Classification - Strong for |r| >= 0.7",
    property: function () {
      return fc.assert(
        fc.property(
          fc.float({ min: 0.7, max: 1, noNaN: true }),
          fc.boolean(),
          (absValue, isNegative) => {
            const value = isNegative ? -absValue : absValue;
            return Correlation.classifyCorrelation(value) === "strong";
          }
        ),
        { numRuns: 100 }
      );
    },
  });

  tests.push({
    name: "Property 8: Classification - Moderate for 0.4 <= |r| < 0.7",
    property: function () {
      return fc.assert(
        fc.property(
          fc.float({ min: 0.4, max: 0.6999, noNaN: true }),
          fc.boolean(),
          (absValue, isNegative) => {
            const value = isNegative ? -absValue : absValue;
            return Correlation.classifyCorrelation(value) === "moderate";
          }
        ),
        { numRuns: 100 }
      );
    },
  });

  tests.push({
    name: "Property 8: Classification - Weak for 0.2 <= |r| < 0.4",
    property: function () {
      return fc.assert(
        fc.property(
          fc.float({ min: 0.2, max: 0.3999, noNaN: true }),
          fc.boolean(),
          (absValue, isNegative) => {
            const value = isNegative ? -absValue : absValue;
            return Correlation.classifyCorrelation(value) === "weak";
          }
        ),
        { numRuns: 100 }
      );
    },
  });

  tests.push({
    name: "Property 8: Classification - None for |r| < 0.2",
    property: function () {
      return fc.assert(
        fc.property(
          fc.float({ min: 0, max: 0.1999, noNaN: true }),
          fc.boolean(),
          (absValue, isNegative) => {
            const value = isNegative ? -absValue : absValue;
            return Correlation.classifyCorrelation(value) === "none";
          }
        ),
        { numRuns: 100 }
      );
    },
  });

  tests.push({
    name: "Property 8: Classification - Boundary test at 0.7",
    property: function () {
      return (
        Correlation.classifyCorrelation(0.7) === "strong" &&
        Correlation.classifyCorrelation(-0.7) === "strong"
      );
    },
  });

  tests.push({
    name: "Property 8: Classification - Boundary test at 0.4",
    property: function () {
      return (
        Correlation.classifyCorrelation(0.4) === "moderate" &&
        Correlation.classifyCorrelation(-0.4) === "moderate"
      );
    },
  });

  tests.push({
    name: "Property 8: Classification - Boundary test at 0.2",
    property: function () {
      return (
        Correlation.classifyCorrelation(0.2) === "weak" &&
        Correlation.classifyCorrelation(-0.2) === "weak"
      );
    },
  });

  return {
    name: "Correlation Tests",
    tests: tests,
  };
})();
