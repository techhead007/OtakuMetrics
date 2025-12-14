/**
 * Test Runner - Executes all property tests and displays results
 */

(function () {
  "use strict";

  const output = document.getElementById("test-output");
  const summary = document.getElementById("summary");

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  function createTestSuiteElement(suiteName) {
    const suiteDiv = document.createElement("div");
    suiteDiv.className = "test-suite";
    suiteDiv.innerHTML = `<h2>${suiteName}</h2>`;
    return suiteDiv;
  }

  function createTestResultElement(testName, passed, error = null) {
    const resultDiv = document.createElement("div");
    resultDiv.className = `test-result ${passed ? "pass" : "fail"}`;

    let content = `${passed ? "✓" : "✗"} ${testName}`;
    if (error) {
      content += `<br><small style="color: #ff6b6b; margin-left: 20px;">${error}</small>`;
    }

    resultDiv.innerHTML = content;
    return resultDiv;
  }

  async function runTestSuite(suite) {
    const suiteElement = createTestSuiteElement(suite.name);
    output.appendChild(suiteElement);

    for (const test of suite.tests) {
      totalTests++;
      let passed = false;
      let error = null;

      try {
        const result = test.property();
        // Handle both sync and async results
        if (result instanceof Promise) {
          await result;
        }
        passed = true;
        passedTests++;
      } catch (e) {
        failedTests++;
        error = e.message || String(e);
        console.error(`Test failed: ${test.name}`, e);
      }

      suiteElement.appendChild(
        createTestResultElement(test.name, passed, error)
      );
    }
  }

  async function runAllTests() {
    output.innerHTML = "<p>Running tests...</p>";

    // Collect all test suites
    const testSuites = [];

    if (typeof DataAlignmentTests !== "undefined") {
      testSuites.push(DataAlignmentTests);
    }
    if (typeof KPITests !== "undefined") {
      testSuites.push(KPITests);
    }
    if (typeof FilteringTests !== "undefined") {
      testSuites.push(FilteringTests);
    }
    if (typeof CorrelationTests !== "undefined") {
      testSuites.push(CorrelationTests);
    }
    if (typeof FormattingTests !== "undefined") {
      testSuites.push(FormattingTests);
    }

    output.innerHTML = "";

    for (const suite of testSuites) {
      await runTestSuite(suite);
    }

    // Display summary
    const allPassed = failedTests === 0;
    summary.className = `summary ${allPassed ? "all-pass" : "has-fail"}`;
    summary.innerHTML = `
            <h2>Test Summary</h2>
            <p>Total: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}</p>
            <p style="font-size: 1.5rem; margin-top: 10px;">
                ${allPassed ? "🎉 All tests passed!" : "❌ Some tests failed"}
            </p>
        `;
  }

  // Run tests when page loads
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runAllTests);
  } else {
    runAllTests();
  }
})();
