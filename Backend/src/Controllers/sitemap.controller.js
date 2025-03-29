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

// Helper to safely convert a date value to ISO string
const safeToISOString = (value) => {
  const date = new Date(value);
  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
};

export const generateSitemap = asyncHandler(async (req, res) => {
  try {

    console.log("called");
    
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
      mongoose.model('Snippet').find({}, '_id updatedAt title'),
      mongoose.model('Collection').find({}, '_id updatedAt'),
      mongoose.model('User').find({}, 'username updatedAt')
    ]);

    console.log(snippets, collections, users);
    
    // Convert database data to sitemap entries with proper XML escaping & safe date formatting
    const dynamicRoutes = [
      ...snippets.map(snippet => {
      const params = new URLSearchParams({
        title: snippet.title,
        id: snippet._id.toString()
      });
      return {
        url: `/snippet/details/?${params.toString()}`,
        lastmod: safeToISOString(snippet.updatedAt),
        changefreq: 'weekly',
        priority: 0.6
      };
      }),
      ...collections.map(collection => ({
      url: `/collections/${collection._id.toString()}`,
      lastmod: safeToISOString(collection.updatedAt),
      changefreq: 'weekly',
      priority: 0.6
      })),
      ...users.map(user => ({
      url: `/user/${user.username}`,
      lastmod: safeToISOString(user.updatedAt),
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
