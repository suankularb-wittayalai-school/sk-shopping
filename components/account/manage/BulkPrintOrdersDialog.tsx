// Imports
import useForm from "@/utils/helpers/useForm";
import { StylableFC } from "@/utils/types/common";
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
  TextField
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
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
    // in the format of YYYY-MM-DD
    {
      key: "dateStart",
      defaultValue: new Date().toISOString().split("T")[0],
      required: true,
    },
    {
      key: "dateEnd",
      defaultValue: new Date().toISOString().split("T")[0],
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
      `/account/manage/${fromUUID(shopID)}/orders/print?${new URLSearchParams(
        form,
      )}`,
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
        title="ตั้งค่าการพิมพ์การสั่งซื้อ"
        desc="เลือกจากรายการด้านล่าง แล้วกด “พิมพ์” เมื่อพร้อม"
      />

      <DialogContent height={320} className="space-y-4 p-6 pt-3">
        <div className="grid grid-cols-2 gap-6">
          {/* Shipment Status */}
          <FormGroup label="สถานะการสั่งซื้อ">
            <FormItem label="ยกเลิกไปแล้ว">
              <Radio
                value={form.shipmentStatus === "canceled"}
                onChange={() =>
                  setForm({ ...form, shipmentStatus: "canceled" })
                }
              />
            </FormItem>
            <FormItem label="ยังไม่ได้จัดส่ง">
              <Radio
                value={form.shipmentStatus === "not_shipped_out"}
                onChange={() =>
                  setForm({ ...form, shipmentStatus: "not_shipped_out" })
                }
              />
            </FormItem>
            <FormItem label="กำลังส่ง/พร้อมรับ">
              <Radio
                value={form.shipmentStatus === "pending"}
                onChange={() => setForm({ ...form, shipmentStatus: "pending" })}
              />
            </FormItem>
            <FormItem label="รับสินค้าแล้ว">
              <Radio
                value={form.shipmentStatus === "delivered"}
                onChange={() =>
                  setForm({ ...form, shipmentStatus: "delivered" })
                }
              />
            </FormItem>
          </FormGroup>

          {/* Delivery Type */}
          <FormGroup label="วิธีการจัดส่ง">
            <FormItem label="รับที่หน้าร้าน">
              <Radio
                value={form.deliveryType === "pos"}
                onChange={() => setForm({ ...form, deliveryType: "pos" })}
              />
            </FormItem>
            <FormItem label="รับที่โรงเรียน">
              <Radio
                value={form.deliveryType === "school_pickup"}
                onChange={() =>
                  setForm({ ...form, deliveryType: "school_pickup" })
                }
              />
            </FormItem>
            <FormItem label="รับที่ที่อยู่">
              <Radio
                value={form.deliveryType === "delivery"}
                onChange={() => setForm({ ...form, deliveryType: "delivery" })}
              />
            </FormItem>
          </FormGroup>
        </div>

        {/* Date range */}
        <FormGroup
          label="ขอบเขตวันที่"
          className="[&>label:not(:last-child)]:mb-4 [&>legend]:mb-2"
        >
          <TextField<string>
            appearance="outlined"
            label="ตั้งแต่วันที่"
            onChange={(value) => console.log(value)}
            inputAttr={{ type: "date" }}
            {...formProps.dateStart}
          />
          <TextField<string>
            appearance="outlined"
            label="ถึงวันที่"
            inputAttr={{ type: "date" }}
            {...formProps.dateEnd}
          />
        </FormGroup>

        {/* Type */}
        <FormGroup label="สิ่งที่จะพิมพ์">
          <FormItem label="ใบเสร็จ (A6)">
            <Radio
              value={form.type === "receipt"}
              onChange={(value) =>
                value && setForm({ ...form, type: "receipt" })
              }
            />
          </FormItem>
          <FormItem label="ใบติดกล่องสินค้า (A5)">
            <Radio
              value={form.type === "label_a5"}
              onChange={(value) =>
                value && setForm({ ...form, type: "label_a5" })
              }
            />
          </FormItem>
          <FormItem label="ใบติดกล่องสินค้า (A4)">
            <Radio
              value={form.type === "label_a4"}
              onChange={(value) =>
                value && setForm({ ...form, type: "label_a4" })
              }
            />
          </FormItem>
        </FormGroup>
      </DialogContent>

      <Actions>
        <Button appearance="text" onClick={handleSubmit}>
          พิมพ์
        </Button>
      </Actions>
    </Dialog>
  );
};

export default BulkPrintOrdersDialog;
