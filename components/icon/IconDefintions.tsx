// Imports
import { FC } from "react";

/**
 * Definitions of custom SVG icons that can be used via `UseVector`.
 *
 * @returns A hidden `<svg>`.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use \<use\>}
 */
const IconDefinitions: FC = () => (
  <svg
    aria-hidden
    className="sr-only"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <defs>
      <symbol id="icon-mysk" viewBox="0 0 24 24">
        <path
          d="M16.363 1.92281C16.2503 2.08051 16.0701 2.39593 16.0025 2.59869C15.7997 3.1394 15.3942 3.11687 15.3942 2.55363C15.3942 2.03546 14.6958 1.94534 13.7045 2.32834C13.1413 2.5311 13.1187 2.62122 13.1863 3.95047C13.2539 5.39236 13.6594 5.93307 13.9073 4.91924C14.0875 4.19829 14.448 4.19829 14.7183 4.91924C14.876 5.30224 15.1013 5.48247 15.4843 5.48247C15.8673 5.48247 16.0701 5.32477 16.1602 4.91924C16.3404 4.24335 16.8812 4.17576 17.0389 4.82912C17.3317 5.93307 17.7598 5.09947 17.7598 3.43229C17.7598 1.81016 17.7373 1.7651 17.174 1.69751C16.8586 1.65245 16.4982 1.7651 16.363 1.92281Z M18.9088 2.80147C18.4807 5.0319 18.9989 5.93308 20.7562 5.93308C22.0179 5.93308 22.2206 6.04573 21.9052 6.63149C21.6349 7.14967 21.2744 7.1722 19.8776 6.67655C18.5258 6.1809 18.0977 6.47379 17.94 8.02833C17.7823 9.31251 17.8499 9.33504 20.4633 9.1548C23.257 8.97457 23.5048 8.72674 22.9641 6.60896C22.7614 5.84296 22.6037 4.91925 22.6037 4.55878C22.6037 3.65759 21.9954 3.4323 21.4321 4.13072C20.8689 4.82913 20.2606 4.49119 20.1705 3.4323C20.1029 2.75641 19.6298 2.10306 19.2017 2.10306C19.1341 2.10306 18.9989 2.41847 18.9088 2.80147Z M3.1156 5.59513C2.5073 5.77536 1.92154 5.91054 1.85395 5.93307C1.44842 5.9556 0.75 6.9469 0.75 7.51014C0.75 8.61408 1.65118 10.6868 2.59742 11.7006C3.7239 12.9398 4.58002 13.3228 7.03574 13.7058C9.19858 14.0662 10.1223 14.3816 10.3025 14.8548C10.6855 15.8686 7.0808 16.0939 4.55749 15.1927C2.3496 14.4267 1.80889 14.5619 1.58359 15.9362C1.24565 17.9638 1.85395 18.6172 4.80532 19.4283C10.4152 20.9828 14.4254 18.1666 13.1412 13.5706C12.7808 12.2639 12.1274 11.8583 9.64917 11.3402C6.54009 10.7093 5.68397 10.056 6.87803 9.22238C7.55392 8.74926 8.38751 8.77179 10.28 9.33503C12.0824 9.87574 12.7357 9.78562 13.0962 8.97456C13.4567 8.20855 13.4341 6.78919 13.0962 6.31607C12.3978 5.39236 5.61638 4.89671 3.1156 5.59513Z M14.9661 7.14967C14.7859 7.37496 14.7183 8.74926 14.7634 11.7006C14.8084 15.7109 14.7859 16.0263 14.2903 17.3105C13.2539 19.9239 13.3891 21.0279 14.7634 21.0279C15.597 21.0279 16.0701 20.2619 16.0701 18.9551C16.0701 16.95 17.1065 17.4907 17.7823 19.8563C18.7286 23.1006 20.6436 22.8302 22.0404 19.2706C22.8515 17.2204 22.6938 16.7473 21.0717 16.2065C19.8551 15.801 18.6835 14.8773 18.8187 14.4267C18.8638 14.2915 19.4721 13.8409 20.1705 13.4805C22.4685 12.2413 22.874 11.5429 21.7926 10.6868C21.0266 10.0785 19.7649 10.0785 18.8863 10.6643C17.3993 11.633 16.6333 11.0923 16.8586 9.24491C17.1065 7.37496 15.8899 6.04572 14.9661 7.14967Z"
          fill="currentColor"
        />
      </symbol>

      <symbol id="icon-t-shirt" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.125 13L1.125 7.8L7.725 4H9C9.26667 4.8 9.58333 5.5 9.95 6.1C10.3167 6.7 11 7 12 7C13 7 13.6833 6.7 14.05 6.1C14.4167 5.5 14.7333 4.8 15 4H16.275L22.85 7.825L19.875 13L18 11.975V21H6V11.975L4.125 13ZM16 19V8.57501L19.125 10.3L20.125 8.55001L16.3 6.32501C15.9 7.14168 15.3125 7.79168 14.5375 8.27501C13.7625 8.75835 12.9167 9.00001 12 9.00001C11.0833 9.00001 10.2375 8.75835 9.46251 8.27501C8.68751 7.79168 8.10001 7.14168 7.70001 6.32501L3.85001 8.55001L4.87501 10.3L8.00001 8.57501V19H16Z"
          fill="currentColor"
        />
      </symbol>
      <symbol id="icon-t-shirt-filled" viewBox="0 0 24 24">
        <path
          d="M1.125 7.8L4.125 13L6 11.975V21H18V11.975L19.875 13L22.85 7.825L16.275 4H15C14.7333 4.8 14.4167 5.5 14.05 6.1C13.6833 6.7 13 7 12 7C11 7 10.3167 6.7 9.95 6.1C9.58333 5.5 9.26667 4.8 9 4H7.725L1.125 7.8Z"
          fill="currentColor"
        />
      </symbol>

      <symbol id="icon-sleeveless-shirt" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6 5.00352L7.725 4H9C9.26667 4.8 9.58333 5.5 9.95 6.1C10.3167 6.7 11 7 12 7C13 7 13.6833 6.7 14.05 6.1C14.4167 5.5 14.7333 4.8 15 4H16.275L18 5.00352V21H6V5.00352ZM16 19L16 6.85328C15.6355 7.59741 15.3645 7.76457 14.7329 8.15404C14.6713 8.19201 14.6063 8.23208 14.5375 8.27501C13.7625 8.75835 12.9167 9.00001 12 9.00001C11.0833 9.00001 10.2375 8.75835 9.46251 8.27501C9.39367 8.23208 9.32868 8.19201 9.26712 8.15404C8.63555 7.76457 8.36448 7.59741 8 6.85328V19H16Z"
          fill="currentColor"
        />
      </symbol>
      <symbol id="icon-sleeveless-shirt-filled" viewBox="0 0 24 24">
        <path
          d="M7.725 4L6 5.00352V21H18V5.00352L16.275 4H15C14.7333 4.8 14.4167 5.5 14.05 6.1C13.6833 6.7 13 7 12 7C11 7 10.3167 6.7 9.95 6.1C9.58333 5.5 9.26667 4.8 9 4H7.725Z"
          fill="currentColor"
        />
      </symbol>

      <symbol id="icon-hat" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20 14.5C20 13.5151 19.7931 12.5398 19.391 11.6299C18.989 10.7199 18.3997 9.89314 17.6569 9.1967C16.914 8.50026 16.0321 7.94781 15.0615 7.5709C14.0909 7.19399 13.0506 7 12 7C10.9494 7 9.90914 7.19399 8.93853 7.5709C7.96793 7.94781 7.08601 8.50026 6.34315 9.1967C5.60028 9.89314 5.011 10.7199 4.60896 11.6299C4.20693 12.5398 4 13.5151 4 14.5L2 14.5V16.5H22V14.5H20ZM17.5433 12.3952C17.8448 13.0625 18 13.7777 18 14.5H12L6 14.5C6 13.7777 6.15519 13.0625 6.45672 12.3952C6.75825 11.728 7.20021 11.1216 7.75736 10.6109C8.31451 10.1002 8.97595 9.69506 9.7039 9.41866C10.4319 9.14226 11.2121 9 12 9C12.7879 9 13.5681 9.14226 14.2961 9.41866C15.0241 9.69506 15.6855 10.1002 16.2426 10.6109C16.7998 11.1216 17.2417 11.728 17.5433 12.3952Z"
          fill="currentColor"
        />
        <rect x="11" y="6" width="2" height="2" fill="currentColor" />
      </symbol>
      <symbol id="icon-hat-filled" viewBox="0 0 24 24">
        <path
          d="M13 6H11V7.05882C10.293 7.14233 9.59962 7.31419 8.93853 7.5709C7.96793 7.94781 7.08601 8.50026 6.34315 9.1967C5.60028 9.89314 5.011 10.7199 4.60896 11.6299C4.20693 12.5398 4 13.5151 4 14.5L2 14.5V16.5H22V14.5H20C20 13.5151 19.7931 12.5398 19.391 11.6299C18.989 10.7199 18.3997 9.89314 17.6569 9.1967C16.914 8.50026 16.0321 7.94781 15.0615 7.5709C14.4004 7.31419 13.707 7.14233 13 7.05882V6Z"
          fill="currentColor"
        />
      </symbol>
    </defs>
  </svg>
);

export default IconDefinitions;