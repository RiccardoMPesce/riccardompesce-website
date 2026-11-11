import { education } from "./education";

type Focus = "leadership" | "systems" | "data" | "business";

type Experience = {
  readonly id: string;
  readonly employer: string;
  readonly role: string;
  readonly period: string;
  readonly location: string;
  readonly focus: readonly Focus[];
  readonly summary: string;
  readonly contributions: readonly string[];
  readonly tools: readonly string[];
};

type Portfolio = {
  readonly experiences: readonly Experience[];
  readonly projects: readonly {
    readonly name: string;
    readonly role: string;
    readonly description: string;
    readonly url: string;
    readonly tools: readonly string[];
  }[];
  readonly credentials: readonly {
    readonly name: string;
    readonly issuer: string;
    readonly issued: string;
  }[];
  readonly community: readonly {
    readonly role: string;
    readonly organization: string;
    readonly period: string;
  }[];
  readonly capabilities: readonly {
    readonly title: string;
    readonly description: string;
    readonly items: readonly string[];
  }[];
  readonly education: typeof education;
  readonly toolkit: readonly {
    readonly title: string;
    readonly tools: string;
  }[];
};

/**
 * @description Public career content reconciled with the English Google Doc and
 * LinkedIn profile on 11 November 2026; the author confirmed July 2026 for the ALTEN
 * role transition. Academic foundations remain separate from professional work;
 * private contact details and the source document's access URL are omitted.
 */
export const portfolio = {
  experiences: [
    {
      id: "alten-lead",
      employer: "ALTEN",
      role: "Technical Lead · Sisal Community",
      period: "Jul 2026 — Present",
      location: "Rome, Italy · Fully remote",
      focus: ["leadership", "systems", "business"],
      summary:
        "Technical ownership of a fixed-price project, connecting architecture, delivery and business priorities.",
      contributions: [
        "Lead solution architecture, feasibility studies, engineering standards, team coordination and release planning within budget constraints.",
        "Translate business requirements into technical solutions, negotiate scope and delivery trade-offs, and coordinate vendors and stakeholders across the UK, Thailand and Albania.",
        "Drive distributed systems integrations and migrations involving Kafka, Redis, Kubernetes, Azure Pub/Sub and GitOps.",
        "Manage integrations and migrations involving Tipster and Social Plus, aligning technical choices with vendor capabilities and delivery priorities.",
        "Oversee security and data governance, supporting GDPR-related compliance, technical audits and delivery quality.",
        "Led delivery of the agreed scope on time and within budget, contributing to negotiations for a one-year extension into 2027 and additional feature purchases, with further releases scheduled.",
        "Conduct technical interviews for ALTEN Italy and Switzerland.",
      ],
      tools: [
        "Java",
        "Spring Boot",
        "Kafka",
        "Redis",
        "Kubernetes",
        "Azure",
        "Argo CD",
        "GitOps",
      ],
    },
    {
      id: "alten-backend",
      employer: "ALTEN",
      role: "Backend Engineer · Sisal PAM",
      period: "May 2025 — Jul 2026",
      location: "Rome, Italy · Fully remote",
      focus: ["systems", "data"],
      summary:
        "Modernization of player account services, from a complex PL/SQL codebase to modular Java services.",
      contributions: [
        "Contributed, under the team lead’s coordination, to decomposing a PL/SQL codebase into approximately eight Java/Spring Boot microservices, streamlining development, testing and deployment within a time-and-materials engagement.",
        "Worked with event-driven services using Kafka, transactional outbox and CQRS patterns to support distributed data processing and integration.",
        "Developed integration and batch components with Spring Data, Spring Batch, Spring Kafka, Spring Security and Spring Cloud, using SQL databases, Oracle Cloud Infrastructure and Kubernetes.",
        "Supported observability, reliability and continuous modernization in collaboration with distributed engineering teams, including Sisal Albania.",
        "Participated in architecture discussions and technology evaluations, including experimentation with emerging Java releases.",
      ],
      tools: [
        "Java",
        "Spring Boot",
        "Spring Batch",
        "Spring Security",
        "Spring Cloud",
        "Kafka",
        "SQL",
        "Oracle Cloud",
        "Kubernetes",
      ],
    },
    {
      id: "discovery-reply",
      employer: "Discovery Reply",
      role: "Software & Solutions Engineer",
      period: "Jul 2023 — May 2025",
      location: "Rome, Italy · Fully remote",
      focus: ["systems", "business"],
      summary:
        "Enterprise integration, digital platforms and solution discovery across media and other client environments.",
      contributions: [
        "Developed contract-first microservices for Sky Italy with OpenAPI, Java/Spring Boot and Kong, contributing to enterprise integration with Kubernetes, Terraform and Jenkins.",
        "Customized a Digital Asset Management platform with Java, PHP and React, and contributed to image-editing and authentication features through AWS serverless modernization with Lambda, DynamoDB and Cognito.",
        "Joined an on-site consulting engagement for Sky Deutschland in Munich, interviewing stakeholders and documenting use cases for the replacement of ScheduALL.",
        "Delivered and maintained web solutions for Italgas, BAPS and Mediaset using WordPress, PHP and Figma, developed custom plugins and mentored a junior colleague.",
        "Explored Camunda workflow orchestration and experimented with AI-assisted development, including Cline and internal Reply tools.",
      ],
      tools: [
        "Java",
        "Spring Boot",
        "OpenAPI",
        "Kong",
        "AWS",
        "Terraform",
        "Jenkins",
        "PHP",
        "React",
        "WordPress",
        "Figma",
      ],
    },
    {
      id: "gig",
      employer: "Gaming Innovation Group",
      role: "Big Data Solutions Engineer",
      period: "Jan 2022 — Jul 2023",
      location: "Saint Julian, Malta · Fully remote",
      focus: ["systems", "data"],
      summary:
        "Event-driven data platforms supporting international products, regulatory reporting and downstream analytics.",
      contributions: [
        "Engineered microservices and distributed data pipelines supporting up to 5,000 messages per second across Lottery, Sports and Casino products.",
        "Designed and implemented ETL and data warehousing workflows with RabbitMQ, NiFi, Avro, Kafka and ClickHouse within a Lambda Architecture.",
        "Developed data reconciliation, validation and governance solutions for reporting requirements in markets including Serbia, Argentina, Croatia and Maryland, USA.",
        "Owned assigned projects from solution design through deployment, monitoring and troubleshooting, working with internal teams and external regulatory stakeholders.",
        "Implemented monitoring and alerting to detect processing failures and notify the relevant teams through Slack and email.",
        "Supported BI, Data Science and QA teams, with exposure to FastAPI-based machine learning deployment workflows.",
      ],
      tools: [
        "Kafka",
        "RabbitMQ",
        "NiFi",
        "Avro",
        "ClickHouse",
        "PostgreSQL",
        "Python",
        "Kubernetes/OpenShift",
      ],
    },
    {
      id: "evolution",
      employer: "Evolution Gaming",
      role: "Commercial & Business Intelligence Analyst",
      period: "Jan 2021 — Jun 2021",
      location: "Saint Julian’s, Malta · Hybrid",
      focus: ["data", "business"],
      summary:
        "Commercial analysis and reporting for international Key Account Managers and business leadership.",
      contributions: [
        "Designed and presented BI dashboards for Key Account Managers, supporting customer portfolio analysis and product performance evaluation across GGR, wagering, player activity, churn and retention, with month-on-month and year-on-year reporting.",
        "Supported US commercial teams in newly regulated markets and reporting for the integrated NetEnt and Red Tiger brands.",
        "Built analytical sources with Apache Hive and tailored Excel reports for commercial requirements and performance investigations.",
        "Collaborated with Commercial Directors and Business Strategy leadership, occasionally engaging with C-level stakeholders, to connect analysis with commercial delivery planning.",
      ],
      tools: ["Tableau", "Hive", "SQL", "Excel", "Jira"],
    },
    {
      id: "oney",
      employer: "Oney Insurance",
      role: "Business & Data Solutions Analyst",
      period: "Feb 2020 — Sep 2020",
      location: "Sliema, Malta · Hybrid",
      focus: ["data", "business"],
      summary:
        "Business reconciliation, data integration and feasibility analysis for insurance operations serving European markets within the French Oney Group.",
      contributions: [
        "Analyzed commercial and operational data to investigate discrepancies and support consistency across insurance systems.",
        "Worked with business stakeholders to translate requirements into data transformation and integration workflows.",
        "Contributed to feasibility analysis and machine learning proofs of concept for potential business applications.",
        "Connected analytics and data engineering with the operational requirements of European insurance products, working directly with business stakeholders.",
      ],
      tools: ["Java", "Groovy", "SQL", "Python", "Excel"],
    },
    {
      id: "teemwork",
      employer: "Teemwork.ai",
      role: "Independent Contractor · Search Relevance Evaluation",
      period: "Jul 2018 — Apr 2020",
      location: "Contract engagement",
      focus: ["data"],
      summary:
        "Evaluation of the match between search queries and keywords through an internal web-based tool.",
      contributions: [
        "Provided independent evaluation services, assessing query–keyword relevance through the company’s internal platform.",
      ],
      tools: ["Internal web-based evaluation platform"],
    },
    {
      id: "appen-pages",
      employer: "Appen",
      role: "Independent Contractor · Business Page Evaluation",
      period: "Jun 2018 — Oct 2018",
      location: "Contract engagement",
      focus: ["data", "business"],
      summary:
        "Evaluation of the accuracy of Facebook Business Page descriptions for Appen Butler Hill.",
      contributions: [
        "Assessed how accurately business-page descriptions represented their subject as part of an independent contractor engagement.",
      ],
      tools: ["Facebook Business Pages"],
    },
    {
      id: "appen-ads",
      employer: "Appen",
      role: "Independent Contractor · Advertising Relevance Evaluation",
      period: "Feb 2017 — Apr 2018",
      location: "Contract engagement",
      focus: ["data", "business"],
      summary:
        "Evaluation of local Facebook advertising relevance from the perspective of the target demographic.",
      contributions: [
        "Reviewed the relevance of local Facebook advertisements as an independent contractor, contributing demographic-context evaluations.",
      ],
      tools: ["Facebook Ads"],
    },
  ],
  projects: [
    {
      name: "CMD Call Graph",
      role: "Open-source contribution",
      description:
        "Contributed to a Python tool that turns calls within Windows CMD scripts into Graphviz visualizations, making legacy script structure easier to inspect. The project is hosted in Microsoft’s public GitHub organization.",
      url: "https://github.com/microsoft/cmd-call-graph",
      tools: ["Python", "Graphviz", "Static analysis", "Windows CMD"],
    },
  ],
  credentials: [
    {
      name: "First Certificate in English · Grade A, score 180",
      issuer: "Cambridge English",
      issued: "Mar 2022",
    },
    { name: "Data Engineer", issuer: "Databricks", issued: "Jul 2021" },
    { name: "Data Scientist", issuer: "Databricks", issued: "Jul 2021" },
    { name: "SQL Analyst", issuer: "Databricks", issued: "Jul 2021" },
    {
      name: "Data Analysis with Python",
      issuer: "University of Helsinki",
      issued: "Dec 2020",
    },
    { name: "Cloud Core", issuer: "IBM", issued: "Dec 2020" },
    {
      name: "Scientific Computing with Python",
      issuer: "freeCodeCamp",
      issued: "Nov 2020",
    },
    {
      name: "Natural Language Processing Specialization",
      issuer: "Coursera",
      issued: "Oct 2020",
    },
    {
      name: "AI for Medicine Specialization",
      issuer: "Coursera",
      issued: "Aug 2020",
    },
    {
      name: "DeepLearning.AI TensorFlow Developer Specialization",
      issuer: "Coursera",
      issued: "Jul 2020",
    },
    {
      name: "Deep Learning Specialization",
      issuer: "Coursera",
      issued: "Jun 2020",
    },
    {
      name: "Machine Learning by Stanford University on Coursera",
      issuer: "Coursera",
      issued: "Feb 2019",
    },
  ],
  community: [
    {
      role: "Community Relations Volunteer",
      organization: "IPSIA E. Fermi",
      period: "Dec 2013 — Feb 2014",
    },
    {
      role: "Volunteer Tourist Guide",
      organization: "eTwinning",
      period: "Oct 2013",
    },
  ],
  capabilities: [
    {
      title: "Engineering leadership",
      description:
        "From feasibility to delivery, with responsibility for the decisions in between.",
      items: [
        "Technical ownership",
        "Architecture and feasibility studies",
        "Team coordination",
        "Release planning and engineering standards",
      ],
    },
    {
      title: "Business & commercial engagement",
      description:
        "Connecting technical choices to the people, priorities and constraints behind them.",
      items: [
        "Requirements and stakeholder analysis",
        "International clients and vendors",
        "Scope negotiation",
        "Commercial intelligence and KPI analysis",
      ],
    },
    {
      title: "Systems & integration",
      description:
        "Making services, platforms and data flows work together in enterprise environments.",
      items: [
        "Distributed and event-driven systems",
        "Enterprise integration",
        "Cloud infrastructure",
        "Reliability and observability",
      ],
    },
    {
      title: "Data & governance",
      description:
        "Building the paths from operational data to reporting and business decisions.",
      items: [
        "Data engineering and BI",
        "Reconciliation and validation",
        "Regulatory reporting",
        "Data governance and information security",
      ],
    },
  ],
  education,
  toolkit: [
    {
      title: "Programming & frameworks",
      tools: "Java, Spring Boot, Python, SQL, PHP, JavaScript",
    },
    {
      title: "Cloud & infrastructure",
      tools:
        "AWS, Oracle Cloud, Azure, Kubernetes/OpenShift, Docker, Terraform, Argo CD, GitOps, CI/CD",
    },
    {
      title: "Data & integration",
      tools:
        "Kafka, RabbitMQ, NiFi, Avro, ClickHouse, PostgreSQL, Oracle, MySQL, Redis, Hive, DynamoDB",
    },
  ],
} as const satisfies Portfolio;
