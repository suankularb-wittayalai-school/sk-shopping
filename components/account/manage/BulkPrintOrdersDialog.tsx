// Imports
import useForm from "@/utils/helpers/useForm";
import { StylableFC } from "@/utils/types/common";
import { DeliveryType, OrderStatus } from "@/utils/types/order";
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  FormGroup,
  FormItem,
  MaterialIcon,
  Radio,
  TextField,
} from "@suankularb-components/react";
import { addDays, addMinutes } from "date-fns";
import { useTranslation } from "next-i18next";
import { camel, snake } from "radash";
import shortUUID from "short-uuid";

/**
 * The Bulk Print Orders Dialog allows Shop Managers to bulk print Orders.
 *
 * @param shopID The ID of the Shop to bulk print Orders for. Used in the redirect URL.
 * @param open If the Dialog is open and shown.
 * @param onClose Triggers when the Dialog is closed.
 */
const BulkPrintOrdersDialog: StylableFC<{
  shopID: string;
  open: boolean;
  onClose: () => void;
}> = ({ shopID, open, onClose, style, className }) => {
  const { t } = useTranslation("manage", {
    keyPrefix: "orders.dialog.bulkPrint",
  });

  const { fromUUID } = shortUUID();

  const { form, setForm, formOK, formProps } = useForm<
    "shipmentStatus" | "deliveryType" | "dateStart" | "dateEnd" | "type"
  >([
    {
      key: "shipmentStatus",
      defaultValue: "not_shipped_out",
    },
    {
      key: "deliveryType",
      defaultValue: "school_pickup",
    },
    // The defaults for `dateStart` and `dateEnd` are today’s date
    // in the format of YYYY-MM-DDTHH:mm
    {
      key: "dateStart",
      defaultValue: new Date().toISOString().split("T")[0] + "T00:00",
      required: true,
    },
    {
      key: "dateEnd",
      defaultValue:
        addDays(new Date(), 1).toISOString().split("T")[0] + "T00:00",
      required: true,
    },
    {
      key: "type",
      defaultValue: "receipt",
    },
  ]);

  /**
   * Open a new tab for printing with the specified form values as query.
   */
  function handleSubmit() {
    if (!formOK) return;
    // URLSearchParams is used to encode the form values as query
    // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    window.open(
      `/account/manage/${fromUUID(shopID)}/orders/print?${new URLSearchParams({
        // Convert form keys to snake case
        ...Object.fromEntries(
          Object.entries(form).map(([key, value]) => [snake(key), value]),
        ),
        // Convert `dateStart` and `dateEnd` to ISO 8601 format at UTC time
        // (We are converting to UTC time just for Vercel; note that the time
        // would be wrong on localhost. No idea why only Vercel requires UTC.)
        ...Object.fromEntries(
          (["dateStart", "dateEnd"] as ("dateStart" | "dateEnd")[]).map(
            (key) => [
              snake(key),
              // Remove timezone offset
              addMinutes(
                new Date(form[key]),
                new Date().getTimezoneOffset(),
              ).toISOString(),
            ],
          ),
        ),
      })}`,
    );
  }

  return (
    <Dialog
      open={open}
      width={380}
      onClose={onClose}
      style={style}
      className={className}
    >
      <DialogHeader
        icon={<MaterialIcon icon="print" />}
        title={t("title")}
        desc={t("desc")}
      />

      <DialogContent height={320} className="space-y-4 p-6 pt-3">
        <div className="grid grid-cols-2 gap-6">
          {/* Shipment Status */}
          <FormGroup label={t("shipmentStatus.label")}>
            {(
              [
                "canceled",
                "not_shipped_out",
                "pending",
                "delivered",
              ] as OrderStatus[]
            ).map((key) => (
              <FormItem
                key={key}
                label={t(`shipmentStatus.option.${camel(key)}`)}
              >
                <Radio
                  value={form.shipmentStatus === key}
                  onChange={() => setForm({ ...form, shipmentStatus: key })}
                />
              </FormItem>
            ))}
          </FormGroup>

          {/* Delivery Type */}
          <FormGroup label={t("deliveryType.label")}>
            {(["pos", "school_pickup", "delivery"] as DeliveryType[]).map(
              (key) => (
                <FormItem
                  key={key}
                  label={t(`deliveryType.option.${camel(key)}`)}
                >
                  <Radio
                    value={form.deliveryType === key}
                    onChange={() => setForm({ ...form, deliveryType: key })}
                  />
                </FormItem>
              ),
            )}
          </FormGroup>
        </div>

        {/* Date range */}
        <FormGroup
          label={t("dateRange.label")}
          className="[&>label:not(:last-child)]:mb-4 [&>legend]:mb-2"
        >
          <TextField<string>
            appearance="outlined"
            label={t("dateRange.start")}
            onChange={(value) => console.log(value)}
            inputAttr={{ type: "datetime-local" }}
            {...formProps.dateStart}
          />
          <TextField<string>
            appearance="outlined"
            label={t("dateRange.end")}
            inputAttr={{ type: "datetime-local" }}
            {...formProps.dateEnd}
          />
        </FormGroup>

        {/* Type */}
        <FormGroup label={t("type.label")}>
          {["receipt", "label_a5", "label_a4"].map((key) => (
            <FormItem key={key} label={t(`type.option.${camel(key)}`)}>
              <Radio
                value={form.type === key}
                onChange={() => setForm({ ...form, type: key })}
              />
            </FormItem>
          ))}
        </FormGroup>
      </DialogContent>

      <Actions>
        <Button appearance="text" onClick={handleSubmit}>
          {t("action.print")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default BulkPrintOrdersDialog;
