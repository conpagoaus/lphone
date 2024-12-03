import { linkify } from "../linkify";
import { describe, it } from "node:test";
import expect from "expect";

const tests = [
  ["0479083575", '<a href="tel:+61479083575">0479083575</a>'],
  // [
  //   '<a href="tel:+61479083575">0479083575</a>',
  //   '<a href="tel:+61479083575">0479083575</a>',
  // ],
  // [
  //   "this is a long string with multiple phone numbers like this one 0432227352 and then we need to have another one a fair whack away just to test that it will do both 0432227352",
  //   'this is a long string with multiple phone numbers like this one <a href="tel:+61432227352">0432227352</a> and then we need to have another one a fair whack away just to test that it will do both <a href="tel:+61432227352">0432227352</a>',
  // ],
  // [
  //   'this is a long string with multiple phone numbers like this one <a href="tel:+61432227352">0432227352</a> and then we need to have another one a fair whack away just to test that it will do both 0432227352',
  //   'this is a long string with multiple phone numbers like this one <a href="tel:+61432227352">0432227352</a> and then we need to have another one a fair whack away just to test that it will do both <a href="tel:+61432227352">0432227352</a>',
  // ],
  // /**
  //  * This case fails because libphonenumber-js thinks "0432227352, 0432227354" is one phone number
  //  */
  // // [
  // //   "what if there are two numbers close together like 0431117051, 0437772345",
  // //   'what if there are two numbers close together like <a href="tel:+0431117051">0431117051</a>, <a href="tel:+0437772345">0437772345</a>',
  // // ],
  // [
  //   '<p><strong>Physiotherapy by Appointment</strong></p><p><strong style="color: rgb(0, 176, 80);">Fizzio Clinics appointments please call </strong><a href="tel:+611300693499" rel="noopener noreferrer" target="_blank"><strong>1300 693 499</strong></a><strong style="color: rgb(0, 176, 80);"> </strong></p>',
  //   '<p><strong>Physiotherapy by Appointment</strong></p><p><strong style="color: rgb(0, 176, 80);">Fizzio Clinics appointments please call </strong><a href="tel:+611300693499" rel="noopener noreferrer" target="_blank"><strong>1300 693 499</strong></a><strong style="color: rgb(0, 176, 80);"> </strong></p>',
  // ],
  // [
  //   '<p>this is my phone number <a href="tel:+61431117051">0431117051</a></p>',
  //   '<p>this is my phone number <a href="tel:+61431117051">0431117051</a></p>',
  // ],
  // [
  //   '<p>this is my phone number <a href="tel:+61431117051" rel="noopener noreferrer" target="_blank">0431117051</a></p>',
  //   '<p>this is my phone number <a href="tel:+61431117051" rel="noopener noreferrer" target="_blank">0431117051</a></p>',
  // ],
  // [
  //   '<a href="www.google.com">google</a>',
  //   '<a href="www.google.com">google</a>',
  // ],
  // ["(04) 7908 3838", '<a href="tel:+61479083838">(04) 7908 3838</a>'],
  // ["04 3888 8888", '<a href="tel:+61438888888">04 3888 8888</a>'],
  // ["(07) 3857 2222", '<a href="tel:+61738572222">(07) 3857 2222</a>'],
  // ["073857222", "073857222"],
  // ["google.com.au", '<a href="https://google.com.au">google.com.au</a>'],
  // [
  //   "google.com.au and test@gmail.com address",
  //   '<a href="https://google.com.au">google.com.au</a> and <a href="mailto:test@gmail.com">test@gmail.com</a> address',
  // ],
];

describe.skip("linkify", () => {
  for (const [a, expected] of tests) {
    it(`${a} to be parsed to ${expected}`, async () => {
      const parsed = linkify(a);

      expect(parsed).toBe(expected);
    });
  }
});
