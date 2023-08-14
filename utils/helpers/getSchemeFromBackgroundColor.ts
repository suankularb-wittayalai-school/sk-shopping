// Imports
import { sift } from "radash";

/**
 * Calculate what scheme the page should use based on the luminance of the
 * background color.
 *
 * @param hexColor The hex of the background color.
 *
 * @returns The page scheme: `light` or `dark`.
 */
export default function getSchemeFromBackgroundColor(hexColor: string) {
  const rgb = sift(
    hexColor
      .replace("#", "")
      .toLowerCase()
      .split(/([0-9a-f]{2})/),
  ).map((channel) => parseInt(channel, 16));
  const luminance = rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114;
  return luminance > 128 ? "light" : "dark";
}
