// Imports
import { logError } from "@/utils/helpers/logError";
import useJimmy from "@/utils/helpers/useJimmy";
import { IDOnly } from "@/utils/types/common";

/**
 * Returns a function that checks if the current user is a manager of the given Shop.
 */
export default function useIsManagerOfShop() {
  const jimmy = useJimmy();

  return (
    /**
     * Checks if the current user is a manager of the given Shop.
     *
     * @param shopID The ID of the Shop to check.
     */
    async (shopID: string) => {
      // Check if the user is authenticated
      const { user, status } = jimmy.user;
      if (status !== "authenticated") return false;

      // Fetch the Shops that the user is managing
      const { data: managingShops, error: shopsError } = await jimmy.fetch<
        IDOnly[]
      >(`/shops`, {
        query: { filter: { data: { manager_ids: [user?.id] } } },
      });
      if (shopsError) {
        logError("useIsManagerOfShop", shopsError);
        return;
      }

      // Check if the user is managing the given Shop
      return managingShops?.find((managingShop) => shopID === managingShop.id);
    }
  );
}
