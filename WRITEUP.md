## Summary

When enabling the allowJs option in the tsconfig.json, the tests fail with the following error:

```less
✖ 0479083575 to be parsed to a valid number (0.881922ms)
  TypeError [Error]: Cannot read properties of undefined (reading 'hasOwnProperty')
      at isSupportedCountry (/path/to/project/node_modules/.pnpm/libphonenumber-js@1.11.15/node_modules/libphonenumber-js/source/metadata.js:510:28)
      at new PhoneNumberMatcher (/path/to/project/node_modules/.pnpm/libphonenumber-js@1.11.15/node_modules/libphonenumber-js/source/PhoneNumberMatcher.js:157:49)
      at findPhoneNumbersInText (/path/to/project/node_modules/.pnpm/libphonenumber-js@1.11.15/node_modules/libphonenumber-js/source/findPhoneNumbersInText.js:6:18)
      at call (/path/to/project/node_modules/.pnpm/libphonenumber-js@1.11.15/node_modules/libphonenumber-js/min/index.cjs.js:14:14)
      at findPhoneNumbersInText (/path/to/project/node_modules/.pnpm/libphonenumber-js@1.11.15/node_modules/libphonenumber-js/min/index.cjs.js:63:9)
      at TestContext.<anonymous> (/path/to/project/test/test-file.test.ts:10:24)
```

## Steps to Reproduce

1. Set up a TypeScript project with the following tsconfig.json

```json
{
  "compilerOptions": {
    "allowJs": true,
    "outDir": "dist",
    "moduleResolution": "node16",
    "esModuleInterop": true,
    "strict": false,
    "resolveJsonModule": true
  }
}
```

2. Install libphonenumber-js (version: 1.11.15).
3. Create the following test file:

```typescript
import { expect } from "expect";
import { describe, it } from "node:test";
import { findPhoneNumbersInText } from "libphonenumber-js";

const tests = ["0479083575"];
describe("findPhoneNumbersInText", async () => {
  for (const item of tests) {
    it(`${item} to be parsed to a valid number`, async () => {
      const [parsed] = findPhoneNumbersInText(item, "AU");
      expect(parsed).toEqual(
        expect.objectContaining({
          endsAt: 10,
          startsAt: 0,
          number: expect.objectContaining({
            country: "AU",
            number: "+61479083575",
          }),
        })
      );
    });
  }
});
```

4. Run the test using node:test or any compatible runner.

## Expected Behaviour

The test should parse the phone number correctly, returning a valid result.

## Actual Behaviour

The test fails with a `TypeError`:

```javacript
TypeError [Error]: Cannot read properties of undefined (reading 'hasOwnProperty')
```

## Additional Context

- This issue is not present when `allowJs` is disabled in tsconfig.json.
- The error originates in the isSupportedCountry method from the metadata.js file in libphonenumber-js.
- The problem seems to be related to the interaction between the library's code and the TypeScript configuration when JavaScript files are allowed.

## Environment

- libphonenumber-js version: 1.11.15
- Node.js version: 22.x
- TypeScript version: 5.x
- Test Runner: node:test
