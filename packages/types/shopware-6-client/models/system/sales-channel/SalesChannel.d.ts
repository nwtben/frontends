import { CurrencyTranslation } from "../currency/CurrencyTranslation";
import { Language } from "../../framework/language/Language";
import { SalesChannelType } from "./SalesChannelType";
import { Currency } from "../currency/Currency";
import { PaymentMethod } from "../../checkout/payment/PaymentMethod";
import { ShippingMethodPrice } from "../../checkout/shipping/ShippingMethodPrice";
import { Country } from "../country/Country";
import { Order } from "../../checkout/order/Order";
import { Customer } from "../../checkout/customer/Customer";
import { Category } from "../../content/category/Category";
import { ProductVisibility } from "../../content/product/ProductVisibility";
import { MailTemplateSalesChannel } from "../../content/mail-template/MailTemplateSalesChannel";
import { NumberRangeSalesChannel } from "../number-range/NumberRangeSalesChannel";
import { MailHeaderFooter } from "../../content/mail-template/MailHeaderFooter";
import { CustomerGroup } from "../../checkout/customer/CustomerGroup";
import { NewsletterRecipient } from "../../content/newsletter/NewsletterRecipient";
import { PromotionSalesChannel } from "../../checkout/promotion/PromotionSalesChannel";
import { DocumentBaseConfigDefinition } from "../../checkout/document/DocumentBaseConfigDefinition";
import { ShippingMethod } from "../../checkout/shipping/ShippingMethod";
import { SalesChannelTranslation } from "./SalesChannelTranslation";
import { SalesChannelDomain } from "./SalesChannelDomain";
import { SystemConfig } from "../system-config/SystemConfig";
import { ProductReview } from "../../content/product/ProductReview";
import { CustomField } from "../../common/CustomField";

/**
 * @public
 */
export type SalesChannel = {
  typeId: string;
  languageId: string;
  currencyId: string;
  paymentMethodId: string;
  shippingMethodId: string;
  countryId: string;
  navigationCategoryId: string;
  footerCategoryId: string | null;
  serviceCategoryId: string | null;
  name: string | null;
  shortName: string | null;
  accessKey: string;
  currencies: CurrencyTranslation[] | null;
  languages: Language[] | null;
  configuration: [] | null;
  active: boolean;
  type: SalesChannelType | null;
  currency: Currency | null;
  language: Language | null;
  paymentMethod: PaymentMethod | null;
  shippingMethod: ShippingMethodPrice | null;
  country: Country | null;
  orders: Order[] | null;
  customers: Customer[] | null;
  countries: Country[] | null;
  paymentMethods: PaymentMethod[] | null;
  shippingMethods: ShippingMethod[] | null;
  translations: SalesChannelTranslation[] | null;
  domains: SalesChannelDomain[] | null;
  systemConfigs: SystemConfig[] | null;
  customFields: CustomField[];
  navigationCategory: Category | null;
  footerCategory: Category | null;
  serviceCategory: Category | null;
  productVisibilities: ProductVisibility[] | null;
  mailTemplates: MailTemplateSalesChannel[] | null;
  mailHeaderFooterId: string | null;
  numberRangeSalesChannels: NumberRangeSalesChannel[] | null;
  mailHeaderFooter: MailHeaderFooter | null;
  customerGroupId: string | null;
  customerGroup: CustomerGroup | null;
  newsletterRecipients: NewsletterRecipient[] | null;
  promotionSalesChannels: PromotionSalesChannel[] | null;
  documentBaseConfigSalesChannels: DocumentBaseConfigDefinition | null;
  productReviews: ProductReview[] | null;
};
