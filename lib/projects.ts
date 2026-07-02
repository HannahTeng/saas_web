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
    slug: 'clinical-nl-query-agent',
    no: '01',
    title: 'Clinical NL-Query Agent',
    subtitle: 'USC-ATRI · Natural Language → Data QC',
    description:
      'An in-platform agent that lets clinical data managers query large trial datasets (CSV + text) in plain English for data-quality control — replacing manual file and column lookups.',
    tags: ['Agentic AI', 'Clinical Data', 'Python', 'NL Interface'],
    highlight: 'In progress',
    status: 'ACTIVE',
    meta: [
      { k: 'context', v: 'USC-ATRI · clinical trials' },
      { k: 'interface', v: 'Natural language → Data QC' },
      { k: 'data', v: 'Large trial datasets (CSV + text)' },
      { k: 'status', v: 'In progress' },
    ],
  },
  {
    slug: 'agentic-dispatch-dashboard',
    no: '02',
    title: 'Agentic Dispatch Dashboard',
    subtitle: 'Biroot AI · Logistics · Human-in-the-loop',
    description:
      'Encoded real dispatcher load thresholds (100 CBM / 44,000 lb) as an agent’s decision rules, then designed and shipped an ag-grid dashboard surfacing agent-proposed loads for one-click human approval.',
    tags: ['Next.js', 'ag-grid', 'Agentic AI', 'Frontend'],
    status: 'SHIPPED',
    meta: [
      { k: 'context', v: 'Biroot AI · logistics client' },
      { k: 'thresholds', v: '100 CBM / 44,000 lb' },
      { k: 'pattern', v: 'Human-in-the-loop approval' },
      { k: 'stack', v: 'Next.js · ag-grid' },
    ],
  },
  {
    slug: 'medicare-drug-cost-variation',
    no: '03',
    title: 'Medicare Drug Cost Variation',
    subtitle: 'UCLA · Hierarchical Modeling · R / SAS',
    description:
      'Hierarchical linear mixed models on 1 million Medicare Part D records, quantifying that prescriber specialty explains ~206× more oncology-drug cost variance than geography.',
    tags: ['R', 'SAS', 'Mixed Models', 'Health Policy'],
    highlight: '1M records',
    status: 'PUBLISHED',
    meta: [
      { k: 'context', v: 'UCLA · health policy research' },
      { k: 'records', v: '1,000,000 Medicare Part D' },
      { k: 'finding', v: '~206× specialty vs. geography' },
      { k: 'methods', v: 'Hierarchical linear mixed models' },
    ],
  },
  {
    slug: 'ableedu-ai-educational-agent',
    no: '04',
    title: 'AbleEdu — AI Educational Agent',
    subtitle: 'Hackathon · Backend · ElevenLabs',
    description:
      'Backend for an AI educational agent integrating conversational AI with ElevenLabs voice synthesis, plus the Raindrop pedagogical framework supporting 4 learning-accessibility modes.',
    tags: ['TypeScript', 'ElevenLabs', 'AI Agent', 'Raindrop'],
    highlight: 'National-level',
    status: 'AWARDED',
    meta: [
      { k: 'context', v: 'AI Championship Hackathon' },
      { k: 'voice', v: 'ElevenLabs synthesis' },
      { k: 'framework', v: 'Raindrop · 4 accessibility modes' },
      { k: 'tier', v: 'National-level' },
    ],
  },
]
