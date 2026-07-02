export const jobFamilies = [
  "Investment & Finance",
  "Engineering & Infrastructure",
  "Supply Chain & Logistics",
  "Technology & Data",
  "Agriculture & Food Systems",
  "Commercial & Trading",
  "Operations",
  "Strategy & Transformation",
  "Marketing & Communications",
  "Corporate Services",
  "Legal & Governance",
] as const;

export const challengeMetrics = [
  { value: "24+ Million", label: "Residents" },
  { value: "₦14 Trillion", label: "Annual food consumption" },
  { value: "20-30%", label: "Local food production" },
  { value: "$8-10 Billion", label: "Annual post-harvest loss in Nigeria" },
  { value: "<10%", label: "Cold-chain penetration" },
] as const;

export const missionObjectives = [
  "Guarantee consistent, affordable, and high-quality food supply for Lagos.",
  "Bridge rural producers with urban consumers through structured linkages.",
  "Strengthen logistics, warehousing, and cold-chain networks.",
  "Stabilise food prices through structured offtake and market-making mechanisms.",
  "Reduce post-harvest losses through disciplined aggregation and traceability.",
] as const;

export const companies = [
  {
    name: "Lagos Food Systems and Infrastructure Company (LAFSINCO)",
    shortName: "LAFSINCO",
    headline: "Building Food Systems Infrastructure",
    body: "LAFSINCO develops, owns and operates the physical backbone of Lagos' food system-from integrated logistics hubs and wholesale markets to cold-chain facilities, processing centres and supporting infrastructure. It is creating the modern market architecture that enables food to move efficiently from producers to consumers.",
    logoSrc: "/images/lafsinco-logo.png",
  },
  {
    name: "Bulk Food Company (BFCON)",
    shortName: "BulkFood",
    headline: "Powering Structured Food Trading",
    body: "BulkFood is the commercial engine of the ecosystem. By aggregating demand, coordinating procurement and facilitating structured trade, it creates reliable market access for producers while providing buyers with consistent supplies of quality food at competitive prices.",
    logoSrc: "/images/bulk-food-company-logo.png",
  },
  {
    name: "Eko Logistics (EkoLog)",
    shortName: "EkoLog",
    headline: "Moving Food Better",
    body: "EkoLog provides the logistics backbone of the ecosystem, transforming fragmented transport networks into a coordinated, technology-enabled food movement system with traceability, performance monitoring, safety standards, and delivery reliability across the value chain.",
    logoSrc: "/images/ekolog-logo.svg",
  },
  {
    name: "Produce for Lagos Fund",
    shortName: "P4L Fund",
    headline: "Financing Food Security",
    body: "The Produce for Lagos Fund delivers the financial leverage that powers the ecosystem. It provides system-wide liquidity, trading capital, transaction-risk reduction, infrastructure finance, and the confidence farmers, businesses and investors need to participate in a more resilient food economy.",
    logoSrc: "/images/produce-for-lagos-programme-logo.png",
  },
] as const;

export const applicantFaqs = [
  {
    question: "Do applicants need an account?",
    answer: "No. The application flow is public and intentionally lightweight.",
  },
  {
    question: "Which CV formats work?",
    answer: "PDF, DOC, and DOCX files are accepted in the upload flow.",
  },
  {
    question: "Who reviews my application?",
    answer:
      "The hiring team for the role reviews your application, and you receive email updates as it progresses.",
  },
  {
    question: "How are applicants updated?",
    answer: "Application status updates will be sent by email.",
  },
] as const;
