import type { MetadataRoute } from 'next'

const SITE = 'https://flowact.net'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: `${SITE}/`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE}/build`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE}/refund`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
