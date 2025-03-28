import mongoose from 'mongoose';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import { createGzip } from 'zlib';
import { asyncHandler } from '../Utils/asyncHandler.js';

// Helper for escaping XML entities
const escapeXML = (unsafe) => {
	return unsafe.replace(/[<>&'"]/g, (c) => {
		switch (c) {
			case '<': return '&lt;';
			case '>': return '&gt;';
			case '&': return '&amp;';
			case "'": return '&apos;';
			case '"': return '&quot;';
		}
	});
};

export const generateSitemap = asyncHandler(async (req, res) => {
  try {
    // Add static routes
    const staticRoutes = [
      { url: '/', changefreq: 'daily', priority: 1 },
      { url: '/explore', changefreq: 'hourly', priority: 0.9 },
      { url: '/auth', changefreq: 'monthly', priority: 0.5 },
      { url: '/create', changefreq: 'weekly', priority: 0.8 },
      { url: '/collections', changefreq: 'daily', priority: 0.8 },
      { url: '/dashboard', changefreq: 'daily', priority: 0.9 },
      { url: '/profile', changefreq: 'weekly', priority: 0.7 },
    ];

    // Get dynamic routes from database
    const [snippets, collections, users] = await Promise.all([
      mongoose.model('Snippet').find({}, 'id updatedAt'),
      mongoose.model('Collection').find({}, 'id updatedAt'),
      mongoose.model('User').find({}, 'username updatedAt')
    ]);

    // Convert database data to sitemap entries with proper XML escaping
    const dynamicRoutes = [
      ...snippets.map(snippet => ({
        url: escapeXML(`/snippets/${snippet._id.toString()}`),
        lastmod: snippet.updatedAt.toISOString(),
        changefreq: 'weekly',
        priority: 0.6
      })),
      ...collections.map(collection => ({
        url: escapeXML(`/collections/${collection._id.toString()}`),
        lastmod: collection.updatedAt.toISOString(),
        changefreq: 'weekly',
        priority: 0.6
      })),
      ...users.map(user => ({
        url: escapeXML(`/user/${user.username}`),
        lastmod: user.updatedAt.toISOString(),
        changefreq: 'weekly',
        priority: 0.6
      }))
    ];

    const allRoutes = [...staticRoutes, ...dynamicRoutes];

    // Create stream after getting all routes
    const smStream = new SitemapStream({ hostname: 'https://snippethub.tech' });
    const pipeline = smStream.pipe(createGzip());

    // Write routes to stream
    Readable.from(allRoutes).pipe(smStream);

    // Set headers
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');

    // Send the compressed stream
    pipeline.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});
