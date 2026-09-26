import abb from "@/assets/customers/abb.svg";
import aventis from "@/assets/customers/aventis.svg";
import basware from "@/assets/customers/basware.svg";
import businessFinland from "@/assets/customers/businessfinland.svg";
import citibank from "@/assets/customers/citibank.svg";
import exxonMobil from "@/assets/customers/exxonmobil.svg";
import fortum from "@/assets/customers/fortum.svg";
import hewlettPackard from "@/assets/customers/hewlett-packard.svg";
import huoneistokeskus from "@/assets/customers/huoneistokeskus.svg";
import jpmorgan from "@/assets/customers/jpmorgan.svg";
import kesko from "@/assets/customers/kesko.svg";
import metso from "@/assets/customers/metso.svg";
import neste from "@/assets/customers/neste.svg";
import nynas from "@/assets/customers/nynas.svg";
import saarioinen from "@/assets/customers/saarioinen.svg";
import tapiola from "@/assets/customers/tapiola.svg";
import threeDegrees from "@/assets/customers/3degrees.png";
import tradeka from "@/assets/customers/tradeka.svg";
import turva from "@/assets/customers/turva.svg";
import wartsila from "@/assets/customers/wartsila.svg";

/**
 * Organisations delivered for since 2000, directly and through employers and
 * partners, grouped by sector. Logos are the companies' current marks from
 * their own sites or Wikimedia Commons (public-domain text logos); where a
 * brand has since been absorbed or has no usable mark, the name is shown as
 * text. `href` links the mark to the company's site.
 */
export type Customer = { name: string; href?: string; logo?: string };
export type CustomerGroup = { sector: string; customers: readonly Customer[] };

export const customerGroups: readonly CustomerGroup[] = [
  {
    sector: "Banking & finance",
    customers: [
      { name: "3 Degrees", href: "https://www.3degrees.co/", logo: threeDegrees },
      { name: "Basware", href: "https://www.basware.com/", logo: basware },
      { name: "Citibank", href: "https://www.citi.com/", logo: citibank },
      { name: "J.P. Morgan", href: "https://www.jpmorgan.com/", logo: jpmorgan },
      { name: "Tapiola Group · LähiTapiola", href: "https://www.lahitapiola.fi/", logo: tapiola },
      { name: "Turva", href: "https://www.turva.fi/", logo: turva },
      { name: "Finular Group", href: "https://www.finular.com/" },
    ],
  },
  {
    sector: "Energy & oil",
    customers: [
      { name: "Fortum", href: "https://www.fortum.com/", logo: fortum },
      { name: "ABB", href: "https://global.abb/", logo: abb },
      { name: "Neste", href: "https://www.neste.com/", logo: neste },
      { name: "ExxonMobil", href: "https://corporate.exxonmobil.com/", logo: exxonMobil },
      { name: "Nynas", href: "https://www.nynas.com/", logo: nynas },
      { name: "Sähköinfo", href: "https://www.sahkoinfo.fi/" },
      { name: "SETI", href: "https://www.seti.fi/" },
    ],
  },
  {
    sector: "Retail",
    customers: [
      { name: "Kesko", href: "https://www.kesko.fi/", logo: kesko },
      { name: "Tradeka", href: "https://www.tradeka.fi/", logo: tradeka },
      { name: "HOK-Elanto", href: "https://hok-elanto.fi/" },
      { name: "Saarioinen", href: "https://www.saarioinen.fi/", logo: saarioinen },
    ],
  },
  {
    sector: "Technology",
    customers: [
      { name: "Hewlett-Packard", href: "https://www.hp.com/", logo: hewlettPackard },
      { name: "WM-data" },
      { name: "Infonet" },
      { name: "Flucticiel" },
      { name: "Exidio" },
      { name: "Analyse² Solutions", href: "https://www.analyse2.com/" },
    ],
  },
  {
    sector: "Industry & services",
    customers: [
      { name: "Wärtsilä", href: "https://www.wartsila.com/", logo: wartsila },
      { name: "Metso", href: "https://www.metso.com/", logo: metso },
      { name: "Aventis Pharma · Sanofi", href: "https://www.sanofi.com/", logo: aventis },
      {
        name: "Tekes · Business Finland",
        href: "https://www.businessfinland.fi/",
        logo: businessFinland,
      },
      { name: "Delta-Auto" },
      { name: "Trackway" },
      { name: "KissFM", href: "https://www.kiss.fi/" },
      { name: "Huoneistokeskus", href: "https://www.huoneistokeskus.fi/", logo: huoneistokeskus },
    ],
  },
];
