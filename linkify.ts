import { findPhoneNumbers } from "./phone_numbers";

import linkifyHtml from "linkify-html";

export const linkify = (origText: string) => {
  if (!origText?.length) {
    return "";
  }

  let newText = origText;

  // NOTE: this lib wont find phone numbers that are close together i.e. "0432227052, 0432227053"
  // it thinks thats one large phone number.
  try {
    const getPhoneNumbers = findPhoneNumbers(origText);
    console.warn(
      getPhoneNumbers,
      "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<,"
    );
    let tmpText = origText;

    let runningAdditionCount = 0;
    let lastIndex = 0;

    for (const foundPhoneNumber of getPhoneNumbers) {
      const validatedNumber = foundPhoneNumber.number.number;

      if (lastIndex > 0 && lastIndex > foundPhoneNumber.startsAt) continue;

      const pattern = origText.substring(
        foundPhoneNumber.startsAt,
        foundPhoneNumber.endsAt
      );

      // `/<a href="tel:\+61738572222".*>.*<\/a>/g`
      const testOne = generatePhoneATagRegex({ first: validatedNumber });
      // `/<a href="tel:.*".*>\+61738572222<\/a>/g`
      const testTwo = generatePhoneATagRegex({ second: validatedNumber });
      // `/<a href="tel:0432227352".*>.*<\/a>/g`
      const testThree = generatePhoneATagRegex({ first: pattern });
      // `/<a href="tel:.*".*>0432227352<\/a>/g`
      const testFour = generatePhoneATagRegex({ second: pattern });

      // only search where the number was found,
      // otherwise subsequent phone numbers in a description wouldn't get linkified
      const largestPhoneNumber = biggest([validatedNumber, pattern]);

      if (lastIndex > 0)
        tmpText = tmpText.substring(lastIndex, origText.length);

      const searchFromText = tmpText.match(
        new RegExp(`<a href="(.*?)${escapeRegExp(pattern)}(.*?)<\/a>`)
      );

      const searchFromHref = tmpText.match(
        new RegExp(
          `<a href="tel:${escapeRegExp(largestPhoneNumber)}"(.*?)<\/a>`
        )
      );

      let alreadyLinkified = false;
      const match = searchFromHref || searchFromText || false;

      if (match) {
        const foundIndex = match?.index ?? 0;
        const start = foundIndex + lastIndex;
        const areaToSearch = origText.substring(
          start,
          start + match?.[0]?.length
        );

        lastIndex = foundIndex + match?.[0]?.length;

        alreadyLinkified = [
          areaToSearch.search(testOne) > -1,
          areaToSearch.search(testTwo) > -1,
          areaToSearch.search(testThree) > -1,
          areaToSearch.search(testFour) > -1,
        ].some((r) => r);
      }
      if (!alreadyLinkified) {
        const toAdd = `<a href="tel:${validatedNumber}">${pattern}</a>`;

        newText = replaceBetween(
          newText,
          foundPhoneNumber.startsAt + runningAdditionCount,
          foundPhoneNumber.endsAt + runningAdditionCount,
          toAdd
        );

        runningAdditionCount += toAdd.length - pattern.length;
      }
    }
  } catch (error) {
    console.error(error);
  }

  newText = linkifyHtml(newText, {
    defaultProtocol: "https",
  });

  return newText;
};

/**
 * stolen from MDN as RegExp doesn't do this itself:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
 */
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * returns a string with between start and end replaced with `what`
 */
function replaceBetween(
  string: string,
  start: number,
  end: number,
  what: string
) {
  return string.substring(0, start) + what + string.substring(end);
}

/**
 * get the longest string in strings
 */
function biggest(strings: string[]) {
  let biggestString = strings[0];
  for (let i = 0; i < strings.length; i++) {
    const element = strings[i];
    if (element.length > biggestString.length) {
      biggestString = element;
    }
  }
  return biggestString;
}

/**
 * generates RegExp with args in first and second positions or anything (.*)
 * e.g. `/<a href="tel:\+61738572222".*>.*<\/a>/g`
 */
function generatePhoneATagRegex({
  first,
  second,
}: {
  first?: string;
  second?: string;
}) {
  const firstSearch = first ? escapeRegExp(first) : ".*";
  const secondSearch = second ? `(.*?)${escapeRegExp(second)}(.*?)` : ".*";
  return new RegExp(`<a href="tel:${firstSearch}".*>${secondSearch}<\/a>`, "g");
}

export default { linkify };
