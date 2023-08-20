import { Shop } from "@/utils/types/shop";
import { NextApiHandler } from "next";
import { ImageResponse } from "next/server";

export const config = {
  runtime: "edge",
};

/**
 * Creates an Open Graph image for the Shop page.
 */
const handler: NextApiHandler = async (req) => {
  const shop = JSON.parse(
    decodeURIComponent(new URL(req.url!).searchParams.get("shop")!),
  ) as Pick<Shop, "logo_url" | "accent_color" | "background_color">;

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: `#${shop.background_color}`,
          backgroundImage:
            // Top 40%, bpttom 0%, accent color
            `linear-gradient(
              to bottom,
              #${shop.accent_color}66,
              transparent
            )`,
          width: "100%",
          height: "100%",
          display: "flex",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {shop.logo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={shop.logo_url}
            alt=""
            width={240}
            height={240}
            style={{ objectFit: "contain" }}
          />
        )}
      </div>
    ),
    { width: 1200, height: 630 },
  );
};

export default handler;
