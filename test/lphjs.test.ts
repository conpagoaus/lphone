import { expect } from "expect";
import { describe, it } from "node:test";
// import { findPhoneNumbersInText } from "libphonenumber-js";

const tests = ["0479083575"];
describe("findPhoneNumbersInText", async () => {
  const { findPhoneNumbersInText } = await import("libphonenumber-js");
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
