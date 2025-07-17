// pages/sitemap.xml.ts
import { GetServerSideProps } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const siteUrl = 'https://twilight-struggle.com';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Get the most recent updated_at from ratings_history
  const latestUpdate = await prisma.ratings_history.findFirst({
    orderBy: { updated_at: 'desc' },
    select: { updated_at: true },
  });

  const lastMod = latestUpdate?.updated_at?.toISOString() ?? new Date().toISOString();

  const pages = [
    { loc: '/', changefreq: 'hourly', priority: 0.9 },
    { loc: '/players', changefreq: 'weekly', priority: 0.9 },
    { loc: '/about', changefreq: 'daily', priority: 1.0 },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      ({ loc, changefreq, priority }) => `
  <url>
    <loc>${siteUrl}${loc}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(2)}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function Sitemap() {
  return null;
}
