export type ICAcumaticaCustomer = {
  CustomerID: {
    value: string;
  };
  CustomerName: {
    value: string;
  };
  CustomerClassID: {
    value: string;
  };
  CustomerCategory: {
    value: 'Individual' | 'Organization';
  },
  Email: {
    value: string;
  };
  MainContact: {
    Address: {
      AddressLine1: {
        value: string;
      };
      AddressLine2: {
        value: string;
      };
      City: {
        value: string;
      };
      State: {
        value: string;
      };
      PostalCode: {
        value: string;
      };
      Country: {
        value: string;
      };
    };
  };
};

export type IAcumaticaCustomer = {
  id: string;
  rowNumber: number;
  note: {
    value: string;
  };
  AccountRef: Record<string, any>;
  AutoApplyPayments: {
    value: boolean;
  };
  BAccountID: {
    value: number;
  };
  BillingAddressOverride: {
    value: boolean;
  };
  BillingContactOverride: {
    value: boolean;
  };
  CreatedDateTime: {
    value: string;
  };
  CreditLimit: {
    value: number;
  };
  CurrencyID: {
    value: string;
  };
  CurrencyRateType: Record<string, any>;
  CustomerCategory: {
    value: string;
  };
  CustomerClass: {
    value: string;
  };
  CustomerID: {
    value: string;
  };
  CustomerName: {
    value: string;
  };
  Email: {
    value: string;
  };
  EnableCurrencyOverride: {
    value: boolean;
  };
  EnableRateOverride: {
    value: boolean;
  };
  EnableWriteOffs: {
    value: boolean;
  };
  FOBPoint: Record<string, any>;
  IsGuestCustomer: {
    value: boolean;
  };
  LastModifiedDateTime: {
    value: string;
  };
  LeadTimedays: Record<string, any>;
  LocationName: {
    value: string;
  };
  MultiCurrencyStatements: {
    value: boolean;
  };
  NoteID: {
    value: string;
  };
  OrderPriority: {
    value: number;
  };
  ParentRecord: Record<string, any>;
  PriceClassID: Record<string, any>;
  PrimaryContactID: Record<string, any>;
  PrintInvoices: {
    value: boolean;
  };
  PrintStatements: {
    value: boolean;
  };
  ResidentialDelivery: {
    value: boolean;
  };
  SaturdayDelivery: {
    value: boolean;
  };
  SendInvoicesbyEmail: {
    value: boolean;
  };
  SendStatementsbyEmail: {
    value: boolean;
  };
  ShippingAddressOverride: Record<string, any>;
  ShippingBranch: Record<string, any>;
  ShippingContactOverride: Record<string, any>;
  ShippingRule: {
    value: string;
  };
  ShippingTerms: Record<string, any>;
  ShippingZoneID: Record<string, any>;
  ShipVia: Record<string, any>;
  StatementCycleID: {
    value: string;
  };
  StatementType: {
    value: string;
  };
  Status: {
    value: string;
  };
  TaxRegistrationID: Record<string, any>;
  TaxZone: Record<string, any>;
  Terms: {
    value: string;
  };
  WarehouseID: Record<string, any>;
  WriteOffLimit: {
    value: number;
  };
  custom: Record<string, any>;
  _links: {
    self: string;
    "files:put": string;
  };
};