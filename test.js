extensions = {}
global.htmx = {
  defineExtension: (name, ext) => {
    extensions[name] = ext;
  }
}

require("./json-enc-nested.js");

if (!extensions.hasOwnProperty("json-enc-nested")) {
  console.error("Extension not registered");
  process.exit(1);
}

const xhrMock = { overrideMimeType: () => { } };
const enc = extensions["json-enc-nested"].encodeParameters;

const tests = [
  // Should handle empty objects
  [{}, {}],
  // Should handle non-nested objects
  [{ a: 1, b: 2 }, { a: 1, b: 2 }],
  // Should handle single nested values
  [{ a: 1, "b[x]": 2 }, { a: 1, b: { x: 2 } }],
  // Should handle multiple nested values
  [{ a: 1, "b[x]": 2, "c[y]": 3 }, { a: 1, b: { x: 2, }, c: { y: 3 } }],
  // Should handle multiple values in same nested object
  [{ a: 1, "b[x]": 2, "b[y]": 3 }, { a: 1, b: { x: 2, y: 3 } }],
  // Should handle two levels of nested objects
  [{ a: 1, "b[x][y]": 3 }, { a: 1, b: { x: { y: 3 } } }],
  // Should handle three levels of nested objects
  [{ a: 1, "b[x][y][z]": 4 }, { a: 1, b: { x: { y: { z: 4 } } } }],
  // Should handle four levels of nested objects
  [{ a: 1, "b[x][y][z][w]": 5 }, { a: 1, b: { x: { y: { z: { w: 5 } } } } }],
  // Should leave invalid fields untouched
  [{ "a[": 1, "b]": 2, "c][": 3, "d[]": 4, "e[x]a": 5 }, { "a[": 1, "b]": 2, "c][": 3, "d[]": 4, "e[x]a": 5 }],
];

let failed = 0;

tests.forEach(t => {
  const inp = JSON.stringify(t[0]);
  const exp = JSON.stringify(t[1]);
  const out = enc(xhrMock, t[0], undefined);
  if (out !== exp) {
    console.log(`Test failed:\n  Input:    ${inp}\n  Result:   ${out}\n  Expected: ${exp}`);
    failed++;
  }
})

if (failed === 0) {
  console.log(`All ${tests.length} tests passed!`);
} else {
  console.log(`${failed} of ${tests.length} tests failed`);
  process.exit(1);
}

