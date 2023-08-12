import { FC } from "react";

const BlobDefinitions: FC = () =>
  // prettier-ignore
  <svg
    aria-hidden
    className="sr-only"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <defs>
      <symbol id="blob-card-full" viewBox="0 0 489 195">
        <g filter="url(#blob-blur)">
          <path d="M71.5397 191.177C71.5397 230.123 -66.7031 302.828 -105.648 302.828C-144.593 302.828 -192.897 222.7 -192.897 183.755C-192.897 144.809 -61.4274 37 -22.4822 37C16.4629 37 71.5397 152.232 71.5397 191.177Z" className="fill-secondary-80 dark:fill-secondary-20" />
          <path d="M248.14 253.343C248.14 292.288 33.1642 306.694 -5.78099 306.694C-44.7261 306.694 -81.0913 238.782 -81.0913 199.837C-81.0913 160.892 -9.93185 155.61 29.0133 155.61C67.9585 155.61 248.14 214.398 248.14 253.343Z" className="fill-primary-90 dark:fill-primary-20" />
          <path d="M486.442 113.028C525.388 113.028 592.681 123.698 574.742 40.6554C556.804 -42.387 425.823 -119.862 385.616 -62.7997C345.409 -5.73705 447.497 113.028 486.442 113.028Z" className="fill-primary-90 dark:fill-primary-20" />
        </g>
      </symbol>
      <filter id="blob-blur" x="-275" y="-164" width="934" height="553" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur stdDeviation="40" result="blur" />
      </filter>
    </defs>
  </svg>;

export default BlobDefinitions;
