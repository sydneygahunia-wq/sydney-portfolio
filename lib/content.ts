// All portfolio copy lives here so components stay presentational.

export const profile = {
  firstName: "sydney",
  name: "Sydney Gahunia",
  subtitle: "systems design engineering @ uwaterloo · welcome to my pond :)",
  email: "sydneygahunia@gmail.com",
  linkedin: "https://www.linkedin.com/in/sydney-gahunia-b9a704318",
  github: "https://github.com/sydneygahunia-wq",
};

export type Bullet = {
  text: string;
  group?: string; // sub-project name; consecutive bullets with the same group are listed under one label
};

export type Experience = {
  role: string;
  org: string;
  period: string;
  location?: string;
  stack: string[];
  bullets: Bullet[];
};

export const experiences: Experience[] = [
  {
    role: "Software Engineer",
    org: "Steele Foundation",
    period: "Sep 2026 – Present",
    location: "Waterloo, ON",
    stack: ["Python", "FastAPI", "Microsoft Azure", "pytest", "CI/CD"],
    bullets: [
      {
        text: "Build backend features in Python and FastAPI for an AI tool that reads job postings and automatically fills in 19 fields on Waterloo's co-op job board, used to process thousands of postings each term.",
      },
      {
        text: "Improved how the tool sorts job details into the correct fields, expanding support to 200+ new section types.",
      },
      {
        text: "Wrote automated tests for every change and verified each release with a regression test suite and automated deployments to Microsoft Azure.",
      },
    ],
  },
  {
    role: "AI Engineer",
    org: "Hennick Humber Hospital",
    period: "Jan 2026 – Apr 2026",
    location: "Toronto, ON",
    stack: ["React", "FastAPI", "Claude API", "RAG", "Retell AI", "ElevenLabs", "Docker", "Nginx", "CI/CD"],
    bullets: [
      {
        text: "Built a full-stack AI help desk app with React and FastAPI that automatically troubleshoots common IT issues for 700+ hospital staff.",
      },
      {
        text: "Built a retrieval-augmented generation (RAG) system that finds the right hospital IT guide for each question and uses the Claude API to give staff accurate, step-by-step answers.",
      },
      {
        text: "Built a real-time AI phone agent with Retell AI and ElevenLabs that understands caller requests, looks up on-call physicians and routes calls.",
      },
      {
        text: "Packaged the app with Docker and Nginx for on-site deployment, with automated testing, CI/CD and monitoring.",
      },
    ],
  },
];

export type Project = {
  name: string;
  tagline: string;
  period?: string;
  stack: string[];
  links: { label: string; href: string }[];
  /** Pinged when someone opens the portfolio, so a demo hosted on a free
   * tier that sleeps when idle is already awake by the time they click it. */
  wakeUrl?: string;
  bullets: string[];
};

export const projects: Project[] = [
  {
    name: "Forma",
    tagline: "Full-stack e-commerce simulation",
    stack: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL", "Redis", "WebSockets"],
    links: [
      { label: "Live demo", href: "https://forma-ten-bice.vercel.app" },
      { label: "GitHub", href: "https://github.com/sydneygahunia-wq/Forma" },
    ],
    wakeUrl: "https://forma-api-je9l.onrender.com/api/ping",
    bullets: [
      "Built a full-stack e-commerce simulation where virtual robots pick and pack orders in a warehouse, using WebSockets to stream each order's progress live.",
      "Programmed robots to find the shortest route with A* pathfinding and avoid collisions, and built a batch-greedy scheduler that assigns jobs to the nearest free robot, cutting average fulfillment time 15.7% vs. a FIFO baseline.",
      "Prevented overselling and duplicate orders with PostgreSQL transactions and idempotency keys, backed by 80+ automated tests run in GitHub Actions.",
    ],
  },
  {
    name: "Ventra",
    tagline: "iOS heart-rate monitoring app",
    stack: ["Swift", "SwiftUI", "SwiftData", "Swift Charts", "XCTest"],
    links: [{ label: "GitHub", href: "https://github.com/sydneygahunia-wq/svt-monitor" }],
    bullets: [
      "Created a SwiftUI iOS app that monitors heart rate and sends push notifications when it detects an episode of supraventricular tachycardia, a sudden rapid heartbeat.",
      "Designed a state machine that detects episodes from sustained or sudden heart-rate spikes, validated against simulated real-time data.",
      "Built episode tracking with SwiftData and interactive Swift Charts that reveal heart-rate trends over 30 and 90 days.",
      "Wrote XCTest unit tests to verify detection accuracy, breathing guidance timing and trend calculations.",
    ],
  },
];
