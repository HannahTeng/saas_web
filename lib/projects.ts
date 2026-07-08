export type Project = {
  slug: string
  no: string
  title: string
  subtitle: string
  description: string
  tags: string[]
  highlight?: string
  status: string
  /** decorative console metadata for the case-file page */
  meta: { k: string; v: string }[]
}

export const projects: Project[] = [
  {
    slug: 'agentic-dispatch-dashboard',
    no: '01',
    title: 'Dispatchers Approve Loads in One Click',
    subtitle: 'Logistics · Cross-border trucking · Human-in-the-loop',
    description:
      'A dispatcher’s real load limits (100 CBM / 44,000 lb) became an agent’s decision rules. The agent proposes load plans; dispatchers review them in a dashboard that mirrors their existing ERP and approve with one click — the repetitive matching is gone, the judgment stays human.',
    tags: ['Logistics', 'Human-in-the-loop', 'Agentic AI', 'Dashboard'],
    highlight: 'Shipped',
    status: 'SHIPPED',
    meta: [
      { k: 'industry', v: 'Cross-border logistics & trucking' },
      { k: 'rules encoded', v: '100 CBM / 44,000 lb thresholds' },
      { k: 'pattern', v: 'Agent proposes · human approves' },
      { k: 'outcome', v: 'One-click load approval' },
    ],
  },
  {
    slug: 'clinical-nl-query-agent',
    no: '02',
    title: 'Ask Your Data Questions in Plain English',
    subtitle: 'Clinical trials · USC-ATRI · Natural language → answers',
    description:
      'Clinical data managers used to hunt through files and columns by hand to run quality checks. Now they type a question in plain English and an in-platform agent queries the trial datasets (CSV + text) for them — no SQL, no file lookups, deployed inside the tools they already use.',
    tags: ['Clinical Data', 'NL Interface', 'Agentic AI', 'Deployed On-site'],
    highlight: 'In production use',
    status: 'ACTIVE',
    meta: [
      { k: 'industry', v: 'Clinical trial research (USC-ATRI)' },
      { k: 'before', v: 'Manual file & column lookups' },
      { k: 'after', v: 'Plain-English questions → answers' },
      { k: 'status', v: 'In active deployment' },
    ],
  },
  {
    slug: 'customs-copilot',
    no: '03',
    title: 'A Co-pilot for 300 Customs Entries a Day',
    subtitle: 'Trade compliance · US customs brokerage · Discovery-led',
    description:
      'Ran discovery with a broker with 30 years of experience processing 300+ entries a day, and designed a human-in-the-loop co-pilot: the repetitive filing is automated, while staff keep every judgment call. Proof that agent design starts with the operator, not the technology.',
    tags: ['Trade Compliance', 'Discovery', 'Co-pilot Design', 'Human-in-the-loop'],
    status: 'DESIGNED',
    meta: [
      { k: 'industry', v: 'US customs brokerage' },
      { k: 'volume', v: '300+ entries per day' },
      { k: 'approach', v: 'Discovery with a 30-year operator' },
      { k: 'split', v: 'Agent files · humans judge' },
    ],
  },
  {
    slug: 'ableedu-ai-educational-agent',
    no: '04',
    title: 'An Agent That Teaches Four Different Ways',
    subtitle: 'Education · Voice AI · National-level hackathon',
    description:
      'Backend for an AI educational agent that speaks with ElevenLabs voice synthesis and adapts to how each student learns — four accessibility modes (visual, auditory, ADHD, reading) built on the Raindrop pedagogical framework. Same pattern, different industry: the agent adapts to the human.',
    tags: ['Education', 'Voice AI', 'Accessibility', 'AI Agent'],
    highlight: 'National-level',
    status: 'AWARDED',
    meta: [
      { k: 'industry', v: 'Education & accessibility' },
      { k: 'voice', v: 'ElevenLabs synthesis' },
      { k: 'modes', v: 'Visual · auditory · ADHD · reading' },
      { k: 'tier', v: 'National-level hackathon' },
    ],
  },
  {
    slug: 'regulated-traceability-agents',
    no: '05',
    title: 'Multi-Agent Traceability From Factory to Retail Scan',
    subtitle: 'Regulated tobacco · Supply chain traceability · Compliance agents',
    description:
      'Architected a multi-agent traceability system for a regulated tobacco client, spanning the full supply chain from factory production to retail scan. Designed a 3-tier agent structure (Ingest / Query / Compliance) orchestrated by a central routing agent to handle event ingestion, natural-language chain queries, and anomaly detection for duplicate scans and route violations.',
    tags: ['Traceability', 'Supply Chain', 'Compliance', 'Multi-agent System'],
    highlight: 'Architected',
    status: 'ARCHITECTED',
    meta: [
      { k: 'industry', v: 'Regulated tobacco supply chain' },
      { k: 'scope', v: 'Factory production → retail scan' },
      { k: 'architecture', v: 'Ingest · Query · Compliance agents' },
      { k: 'controls', v: 'Duplicate scans · route violations' },
    ],
  },
]
