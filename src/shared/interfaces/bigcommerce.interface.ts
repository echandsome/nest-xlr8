export type IBigCommerceCustomer = {
    id: number;
    authentication: {
        force_password_reset: boolean;
    };
    company: string;
    customer_group_id: number;
    email: string;
    first_name: string;
    last_name: string;
    notes: string;
    phone: string;
    registration_ip_address: string;
    tax_exempt_category: string;
    date_created: string;
    date_modified: string;
    accepts_product_review_abandoned_cart_emails: boolean;
    origin_channel_id: number;
    channel_ids: number[];
};

export type IMeta = {
    pagination: {
        total: number;
        count: number;
        per_page: number;
        current_page: number;
        total_pages: number;
    },
    cursor_pagination: {
        count: number;
        per_page: number;
        start_cursor: string;
        end_cursor: string;
        links: {
            first: string;
            previous: string;
            next: string;
            last: string;
        };
    }
}

export type IBigCommerceCustomers = {
    data: IBigCommerceCustomer[];
    meta: IMeta;
}

export type IBigCommerceCustomerAddress = {
    id: number;
    address1: string;
    address2: string;
    address_type: string;
    city: string;
    company: string;
    country: string;
    country_code: string;
    customer_id: number;
    first_name: string;
    last_name: string;
    phone: string;
    postal_code: string;
    state_or_province: string;
}

export type IBigCommerceCustomerAddresses = {
    data: IBigCommerceCustomerAddress[];
    meta: IMeta;
}

export type IBigCommerceOrder = {
    id: number;
    customer_id: number;
    date_created: string;
    is_tax_inclusive_pricing: boolean;
    date_modified: string;
    date_shipped: string;
    status_id: number;
    status: string;
    subtotal_ex_tax: string;
    subtotal_inc_tax: string;
    subtotal_tax: string;
    base_shipping_cost: string;
    shipping_cost_ex_tax: string;
    shipping_cost_inc_tax: string;
    shipping_cost_tax: string;
    shipping_cost_tax_class_id: number;
    base_handling_cost: string;
    handling_cost_ex_tax: string;
    handling_cost_inc_tax: string;
    handling_cost_tax: string;
    handling_cost_tax_class_id: number;
    base_wrapping_cost: string;
    wrapping_cost_ex_tax: string;
    wrapping_cost_inc_tax: string;
    wrapping_cost_tax: string;
    wrapping_cost_tax_class_id: number;
    total_ex_tax: string;
    total_inc_tax: string;
    total_tax: string;
    items_total: number;
    items_shipped: number;
    payment_method: string;
    payment_provider_id: string;
    payment_status: string;
    refunded_amount: string;
    order_is_digital: boolean;
    store_credit_amount: string;
    gift_certificate_amount: string;
    ip_address: string;
    ip_address_v6: string;
    geoip_country: string;
    geoip_country_iso2: string;
    currency_id: number;
    currency_code: string;
    currency_exchange_rate: string;
    default_currency_id: number;
    default_currency_code: string;
    staff_notes: string;
    customer_message: string;
    discount_amount: string;
    coupon_discount: string;
    shipping_address_count: number;
    is_deleted: boolean;
    ebay_order_id: string;
    cart_id: string;
    billing_address: {
      first_name: string;
      last_name: string;
      company: string;
      street_1: string;
      street_2: string;
      city: string;
      state: string;
      zip: string;
      country: string;
      country_iso2: string;
      phone: string;
      email: string;
      form_fields: any[];
    };
    fees: {
      url: string;
      resource: string;
    };
    is_email_opt_in: boolean;
    credit_card_type: string;
    order_source: string;
    channel_id: number;
    external_source: string | null;
    consignments: {
      url: string;
      resource: string;
    };
    products: {
      url: string;
      resource: string;
    };
    shipping_addresses: {
      url: string;
      resource: string;
    };
    coupons: {
      url: string;
      resource: string;
    };
    external_id: string | null;
    external_merchant_id: string | null;
    tax_provider_id: string;
    customer_locale: string;
    external_order_id: string;
    store_default_currency_code: string;
    store_default_to_transactional_exchange_rate: string;
    custom_status: string;
};

export type IBigCommerceProduct = {
  id: number;
  order_id: number;
  product_id: number;
  variant_id: number;
  order_pickup_method_id: number;
  order_address_id: number;
  name: string;
  name_customer: string;
  name_merchant: string;
  sku: string;
  upc: string;
  type: string;
  base_price: string;
  price_ex_tax: string;
  price_inc_tax: string;
  price_tax: string;
  base_total: string;
  total_ex_tax: string;
  total_inc_tax: string;
  total_tax: string;
  weight: string;
  width: string;
  height: string;
  depth: string;
  quantity: number;
  base_cost_price: string;
  cost_price_inc_tax: string;
  cost_price_ex_tax: string;
  cost_price_tax: string;
  is_refunded: boolean;
  quantity_refunded: number;
  refund_amount: string;
  return_id: number;
  wrapping_id: number;
  wrapping_name: string;
  base_wrapping_cost: string;
  wrapping_cost_ex_tax: string;
  wrapping_cost_inc_tax: string;
  wrapping_cost_tax: string;
  wrapping_message: string;
  quantity_shipped: number;
  event_name: string | null;
  event_date: string;
  fixed_shipping_cost: string;
  ebay_item_id: string;
  ebay_transaction_id: string;
  option_set_id: number | null;
  parent_order_product_id: number | null;
  is_bundled_product: boolean;
  bin_picking_number: string;
  external_id: string | null;
  fulfillment_source: string;
  brand: string;
  gift_certificate_id: number | null;
  applied_discounts: any[];
  product_options: any[];
  configurable_fields: any[];
  discounted_total_inc_tax: string;
};

export type IBigCommerceProducts = IBigCommerceProduct[];