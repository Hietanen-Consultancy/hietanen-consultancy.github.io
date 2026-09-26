/**
 * Third-party services wired into the platforms on the reference list, in
 * production, grouped the way a fintech buyer asks about them ("have you done
 * TransUnion? ClearBank? Plaid?"). Names only: these are counterparties of
 * delivered work, not endorsements, and no vendor marks are reproduced. Plain
 * data with no asset imports so `scripts/llms-txt.ts` can load it under Node.
 */
export type IntegrationGroup = { name: string; items: readonly string[] };

export const integrationGroups: readonly IntegrationGroup[] = [
  {
    name: "Credit bureaus & data",
    items: ["TransUnion UK", "TransUnion US", "LexisNexis", "MicroBilt"],
  },
  {
    name: "Identity, KYC & fraud",
    items: [
      "Onfido",
      "Jumio",
      "ThreatMetrix",
      "Emailage",
      "Prove",
      "FullCircl",
      "Google reCAPTCHA",
    ],
  },
  {
    name: "Banking, payments & ACH",
    items: [
      "ClearBank",
      "ShieldPay",
      "GoCardless",
      "Stripe",
      "Plaid",
      "Repay",
      "Checkbook.io",
      "Carmel",
      "Nacha ACH via partner banks",
    ],
  },
  {
    name: "FX & international payouts",
    items: [
      "Wise",
      "Airwallex",
      "Corpay",
      "dLocal",
      "Mercury",
      "Monex USA",
      "Moneycorp",
      "Revolut",
      "Bitso",
      "Cobre",
    ],
  },
  {
    name: "Open banking",
    items: ["OpenWrks", "Open Bank Vision", "Yodlee"],
  },
  {
    name: "Regulatory reporting",
    items: ["FCA Gabriel returns", "HMRC ISA reporting"],
  },
  {
    name: "CRM, comms & operations",
    items: [
      "Salesforce",
      "Salesforce Marketing Cloud",
      "Mailchimp",
      "TextMagic",
      "Telnyx",
      "TrueAccord",
      "USPS Addresses",
      "Ideal Postcodes",
      "Google Maps",
    ],
  },
];
