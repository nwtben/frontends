import { SalesChannel } from "../sales-channel/SalesChannel";
import { NumberRange } from "./NumberRange";
import { NumberRangeType } from "./NumberRangeType";

/**
 * @public
 */
export type NumberRangeSalesChannel = {
  numberRangeId: string;
  salesChannelId: string;
  numberRange: NumberRange | null;
  salesChannel: SalesChannel | null;
  numberRangeType: NumberRangeType | null;
};
