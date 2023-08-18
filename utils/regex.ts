/**
 * A very basic email validation regex.
 * 
 * Just checks for an @ with stuff around it.
 */
export const EMAIL_REGEX = /^(.+)@(.+)$/;

/**
 * Thai zipcode validation regex.
 * 
 * The first 2 digits are checked against
 * [this list on Wikipedia](https://en.wikipedia.org/wiki/Postal_codes_in_Thailand#Province_codes).
 */
export const THAI_ZIPCODE_REGEX =
  /^(1[0-8]|2[0-7]|3[0-9]|4[0-9]|5[0-8]|6[0-7]|7[0-7]|8[0-6]|9[0-6])\d{3}$/;

/**
 * Thai phone number validation regex.
 * 
 * Checks for a 9-to-10-digit phone numbers with an option extenstion.
 */
  export const THAI_PHONE_NUMBER_REGEX = /^0\d{8,9}(-\d+)?$/;
