/**
 * Reference projects, roughly most recent first, in pages of eight. Drawn from delivery history across
 * Hietanen Consultancy, Finular Group and earlier employers; `client` is named
 * only where the engagement is already public. Keep `outcome` to the result
 * the customer got, and `metric` to one hard number where there is one.
 */
export type ReferenceProject = {
  sector: string;
  title: string;
  client: string;
  outcome: string;
  metric?: string;
  stack: readonly string[];
};

export const referenceProjects: readonly ReferenceProject[] = [
  {
    sector: "Fintech · FX & payouts",
    title: "FX and international payouts platform",
    client: "3 Degrees, United States",
    outcome:
      "A new FX platform for international payouts on .NET 10 and AWS, integrating Wise, Airwallex, Corpay, dLocal, Mercury, Monex USA, Moneycorp, Revolut, Bitso and Cobre, delivered in 2026 alongside leading an AI-agent engineering team working across several model providers.",
    stack: ["C#", ".NET 10", "AWS", "Payments", "AI agents"],
  },
  {
    sector: "Fintech · Lending",
    title: "FCA-regulated peer-to-peer lending platform",
    client: "Fund Ourselves Ltd (UK) and WeLendUs Inc (US) · Finular Group",
    outcome:
      "Built from the ground up on a cloud-first functional architecture, then converted for the US market with new payment rails, credit policies and regulatory rules. Machine-learning credit decisioning, full infrastructure as code, in-house support operation. Integrations spanned credit bureaus (TransUnion UK and US, LexisNexis), identity and fraud (Onfido, Jumio, ThreatMetrix), banking and payments (ClearBank, GoCardless, Stripe, Plaid, ACH), open banking, FCA and HMRC reporting and Salesforce.",
    metric: "800K+ registered users · 99.99% uptime · $200M+ capital raised",
    stack: ["F#", "Azure", "Machine learning", "Farmer IaC"],
  },
  {
    sector: "Enterprise · Procurement",
    title: "Purchase-to-Pay for global enterprises",
    client: "Basware",
    outcome:
      "Lead engineer and coding architect on the next-generation invoice-automation and order-matching product: straight-through accounts payable with 100% paperless processing and ERP integration, in a Scrum programme of over a hundred developers across Finland and India.",
    metric: "1M+ users · 2,000 enterprise customers",
    stack: ["C#", "Reactive Extensions", "WCF", "Entity Framework", "SQL Server"],
  },
  {
    sector: "Insurance",
    title: "Online insurance store",
    client: "Tapiola Group",
    outcome:
      "Consolidated separate insurance product calculators into one consumer web store with a shopping cart, delivered with test-driven development and continuous integration.",
    stack: ["ASP.NET MVC", "F#", "WCF", "SQL Server"],
  },
  {
    sector: "Insurance · Finance",
    title: "Forms application framework",
    client: "Tapiola Group",
    outcome:
      "Architecture and framework for over seventy internet form applications, more than a thousand pages in total, running across load-balanced web servers and a SQL cluster.",
    metric: "5-person team, one year · per-application cost cut to a third",
    stack: ["C#", "SQL Server", "Content Management Server"],
  },
  {
    sector: "Retail · Analytics",
    title: "Daily retail sales analytics",
    client: "Analyse Solutions Finland",
    outcome:
      "A service analysing daily product sales across the major Finnish store chains for retailers and manufacturers: terabyte-scale data warehouse processed through multidimensional OLAP cubes.",
    stack: ["Analysis Services", "Teradata", "OLAP"],
  },
  {
    sector: "Corporate treasury",
    title: "Global treasury management",
    client: "Worldwide industrial enterprise",
    outcome:
      "Browser-based centralised treasury for a multinational: cash-flow forecasting, currency-risk management, internal FX trade and group-wide reporting, later customised for further clients.",
    stack: ["SQL Server", "Visual Basic", ".NET"],
  },
  {
    sector: "Energy",
    title: "Power-plant outage optimisation",
    client: "Fortum",
    outcome:
      "An intranet tool that models plant outages and computes the minimum-cost plan for resources and time on a dedicated optimisation server, reporting as text and project schedules.",
    stack: ["SQL Server", "Visual Basic", "RISKOptimizer"],
  },
  {
    sector: "Insurance · Integration",
    title: "Service interface for a content management platform",
    client: "Tapiola Group",
    outcome:
      "A REST web-service layer over Microsoft Content Management Server, which had no interface of its own, decoupling custom applications from the CMS and clearing the path for a later platform migration. Delivered independently in F#.",
    stack: ["F#", "WCF", "REST"],
  },
  {
    sector: "Insurance",
    title: "Insurance product calculators over mainframe services",
    client: "Tapiola Group",
    outcome:
      "Customer-facing pricing calculators on .NET, drawing live rates from mainframe systems through a service-oriented integration layer, and maintained as products changed.",
    stack: ["C#", ".NET 3.5", "SOA", "SQL Server"],
  },
  {
    sector: "Insurance · Engineering practice",
    title: "Test-driven delivery and continuous integration",
    client: "Tapiola Group",
    outcome:
      "Moved a team of changing size to test-driven development, agile methods and an automated build server covering tests, code analysis, version baselines and deployment packages, while migrating the framework to .NET 3.5.",
    stack: ["MSBuild", "NUnit", "CruiseControl.NET", "FxCop"],
  },
  {
    sector: "Oil & energy",
    title: "Customer extranet with ordering",
    client: "International oil company",
    outcome:
      "An extranet where customers browse products, place orders and review their order history, with all data maintenance done online. Designed and delivered independently.",
    stack: ["ASP.NET", "C#", "SQL Server"],
  },
  {
    sector: "Energy · Billing",
    title: "Invoicing for two energy companies",
    client: "Energy sector",
    outcome:
      "A billing system gathering consumption data from surrounding systems, generating monthly invoices and PDFs and forwarding them to bookkeeping.",
    stack: [".NET", "SQL Server", "Reporting"],
  },
  {
    sector: "Events · Ticketing",
    title: "Ticketing for the World Championships in Athletics",
    client: "Helsinki 2005",
    outcome:
      "Multilingual sign-up and ticket ordering for the international athletics championships, delivered independently on .NET.",
    stack: [".NET", "SQL Server"],
  },
  {
    sector: "Pharma · Analytics",
    title: "Sales reporting over a CRM database",
    client: "Aventis Pharma",
    outcome:
      "Intranet reporting on medicines, representatives and doctor visits from an Oracle-backed CRM: statistical, grouped and detailed reports with paging, sorting and print layouts.",
    stack: ["ASP.NET", "Crystal Reports", "Oracle"],
  },
  {
    sector: "Logistics",
    title: "Ocean cargo vessel tracking",
    client: "Shipping",
    outcome:
      "Intranet monitoring of voyages, cargo and real-time vessel positions from satellite GPS, with generated reports and RTF documents and RSA-secured XML data exchange.",
    stack: ["Visual Basic", "SQL Server", "XML/XSL"],
  },
  {
    sector: "Project management",
    title: "Project tracking with Gantt reporting",
    client: "Software consultancy and its clients",
    outcome:
      "A web application where developers log daily progress and customers follow it: unlimited subtask trees, completion by hours, days or percentage, and reports as text or Gantt charts.",
    stack: ["Visual InterDev", "SQL Server"],
  },
  {
    sector: "Platform · Reuse",
    title: "Shared data-access and utility components",
    client: "Software consultancy",
    outcome:
      "Generic data-access layer and supporting components for .NET, from charting and image generation to file upload and registry access, used as the base for a series of later customer projects.",
    stack: ["C#", ".NET", "SQL Server"],
  },
  {
    sector: "Energy · Optimisation",
    title: "Gas-turbine filter and compressor optimisation",
    client: "Power plant operator",
    outcome:
      "An intranet tool storing historical operating values and computing optimal settings against cost, with comparison of alternative parameter sets for future runs.",
    stack: [".NET", "SQL Server"],
  },
  {
    sector: "Events · Logistics",
    title: "Guest and transport management for a world-rally event",
    client: "Motorsport event organiser",
    outcome:
      "Register of invited guests for Finland's largest motorsport event: tickets per event, seat allocation on chartered aircraft and trains keeping parties together, and invoicing and sales reports. Updated yearly.",
    stack: [".NET", "SQL Server"],
  },
  {
    sector: "Public data · Construction",
    title: "Public contractor register",
    client: "Electrical contracting sector",
    outcome:
      "A public internet database of specialist contractors searchable by region, field and turnover, maintained through a desktop application and also generating the content of a yearly printed directory.",
    stack: ["ASP", "Access", "SQL"],
  },
  {
    sector: "Real estate",
    title: "Property listings for sale and rent",
    client: "Huoneistokeskus",
    outcome:
      "Search over available houses and apartments by multiple criteria, with detail pages and photo galleries for each listing.",
    stack: [".NET", "SQL Server"],
  },
  {
    sector: "Industrial design tools",
    title: "Heated glass-wall design software",
    client: "Glass manufacturer",
    outcome:
      "Major update to a designer's drawing-board application for heated glass walls: parametric wall series, component and glass calculations, reporting, and new multilingual support.",
    stack: ["Visual Basic"],
  },
  {
    sector: "Energy · Reference data",
    title: "Electrical network component catalogue",
    client: "Electricity sector",
    outcome:
      "Intranet application for browsing, searching and maintaining the standard component catalogue used in planning electrical network construction, operating in several languages with more addable at runtime.",
    stack: ["Visual Basic", "MTS", "SQL Server"],
  },
  {
    sector: "HR · Security",
    title: "Key-person register",
    client: "Corporate client",
    outcome:
      "Secured browser application for finding people with given qualifications for assignments, with layered user permissions and printable profiles.",
    stack: ["Visual Basic", "MTS", "SQL Server"],
  },
  {
    sector: "HR · Surveys",
    title: "Questionnaire builder and reporting",
    client: "Corporate client",
    outcome:
      "Fully customisable intranet questionnaires for employees, with answers stored for later analysis in a companion reporting application.",
    stack: ["Visual InterDev", "SQL Server"],
  },
  {
    sector: "Finance · Integration",
    title: "Invoicing data transfer between billing systems",
    client: "Corporate client",
    outcome:
      "Software acting as the protocol between two large invoicing systems, moving the company's billing data monthly; a second system of the same kind followed two years later.",
    stack: [".NET", "SQL"],
  },
  {
    sector: "Integration · Governance",
    title: "Interface configuration register",
    client: "Corporate client",
    outcome:
      "Application database holding detailed data on the interfaces between information systems, supporting control of their configurations and the ordering of new ones as part of a larger information system.",
    stack: [".NET", "SQL Server"],
  },
  {
    sector: "Sales · Analytics",
    title: "Competitor pricing analysis",
    client: "Corporate client",
    outcome:
      "Extraction of competitors' monthly brochure prices from read-only PDFs into a database, analysed over long timescales with parameterised reports and charts.",
    stack: ["Access", "PDF extraction"],
  },
  {
    sector: "Operations",
    title: "Working-hours recording",
    client: "Corporate client",
    outcome:
      "Internet time recording with Active Directory sign-in and multiple user levels; monthly exports for payroll and billing.",
    stack: ["Visual Basic", "SQL Server", "Active Directory"],
  },
  {
    sector: "Enterprise Java",
    title: "Maintenance of custom J2EE applications",
    client: "Tapiola Group",
    outcome:
      "Development tasks across custom IBM Java enterprise applications: JSF front ends, JAX-WS services, EJB and message-driven beans over DB2.",
    stack: ["Java EE", "WebSphere", "DB2"],
  },
  {
    sector: "Defence · Logistics",
    title: "Garrison logistics planner",
    client: "Finnish military fortress",
    outcome:
      "Weekly planning for an island fortress off Helsinki: provisions, ferry passengers and service-member and crew counts, computed for the coming week.",
    stack: ["Lotus 1-2-3"],
  },
];
