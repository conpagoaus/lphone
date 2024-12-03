import libphonenumber from 'google-libphonenumber'
import {
  isValidPhoneNumber,
  findPhoneNumbersInText,
  parsePhoneNumberWithError,
} from 'libphonenumber-js'

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance()
const PNF = libphonenumber.PhoneNumberFormat

const AUSTRALIA = 'AU'

export const isValidNumber = (value: string) => {
  if (!value) return false
  try {
    return isValidPhoneNumber(value, AUSTRALIA)
  } catch (err) {
    try {
      // fallback to  google-libphonenumber
      const valid = phoneUtil.isValidNumberForRegion(
        phoneUtil.parse(value, AUSTRALIA),
        AUSTRALIA
      )

      return valid
    } catch (err) {
      return value
    }
  }
}

export const formatNumber = (
  value: string,
  format: 'national' | 'e164' = 'national'
) => {
  if (!value) return ''
  try {
    if (typeof value !== 'string') return ''

    const phoneNumber = parsePhoneNumberWithError(value, AUSTRALIA)

    return format === 'national'
      ? phoneNumber.formatNational()
      : phoneNumber.format('E.164')
  } catch (err) {
    try {
      // fallback to  google-libphonenumber
      const proto = phoneUtil.parse(value, AUSTRALIA)

      const shape = format === 'national' ? PNF.NATIONAL : PNF.E164
      value = phoneUtil.format(proto, shape)

      return value
    } catch (err) {
      throw new TypeError(
        `Value is not a valid phone number of the form 0412 345 678 (7-15 digits): ${value}`
      )
    }
  }
}

export const findPhoneNumbers = (value: string) => {
  if (!value) return []
  try {
    if (typeof value !== 'string') return []

    const phoneNumbers = findPhoneNumbersInText(value, AUSTRALIA)

    return phoneNumbers
  } catch (err) {
    return []
  }
}
