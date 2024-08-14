import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";

import { CheerioCrawler, Configuration, Sitemap } from "crawlee";
import request from "request-promise-native";
import * as cheerio from "cheerio";

import { router } from "./routes.js";

const app = express();
app.use(express.json());

// Configure cors
app.use(cors());

// Configure helmet
app.use(helmet());

// Load environment variables
dotenv.config({ path: ".env" });

// Define routes
app.get("/", (req, res) => {
  return res.json({ message: "Welcome to DuoSoft Crawlee API" });
});

app.post("/load-url", async (req, res) => {
  try {
    const startUrl = req.body.url;

    if (!startUrl) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Configure crawler
    const crawlerConfig = {
      maxRequestsPerCrawl: 20,
      maxRequestRetries: 3,
      requestHandler: router,
    };
    const crawlerOptions = new Configuration({
      persistStorage: false,
    });

    // Create and run crawler
    const crawler = new CheerioCrawler(crawlerConfig, crawlerOptions);
    await crawler.addRequests([startUrl]);
    await crawler.run();

    // Retrieve data
    const result = await crawler.getData();

    // Send response
    return res.json({ page_content: result.items });
  } catch (error) {
    console.error("Error while processing request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/load-url/single", async (req, res) => {
  try {
    const url = req.body.url;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    request({
      method: "GET",
      uri: url,
      transform: (body) => cheerio.load(body),
    }).then(($) => {
      const title = $("title").text();
      let body = $("body").text();
      body = body
        .replace(/\s+/g, " ")
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
      const characterCount = body.length;
      return res.json({
        page_content: {
          url,
          title,
          body,
          characterCount,
        },
      });
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/load-url/sitemap", async (req, res) => {
  try {
    const xmlUrl = req.body.xmlUrl;

    if (!xmlUrl) {
      return res.status(400).json({ error: "xmlUrl is required" });
    }

    // Configure crawler
    const crawlerConfig = {
      maxRequestsPerCrawl: 20,
      maxRequestRetries: 3,
      async requestHandler({ request, log, $, pushData }) {
        log.info(request.url);
        const title = $("title").text();
        let body = $("body").text();
        body = body
          .replace(/\s+/g, " ")
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

        const characterCount = body.length;

        pushData({
          url: request.url,
          title,
          body,
          characterCount,
        });
      },
    };

    const sitemap = await Sitemap.load(xmlUrl).catch((error) => {
      throw new Error("Failed to load sitemap");
    });

    const { urls } = sitemap;
    if (!urls || urls.length === 0) {
      return res.status(400).json({ error: "No URLs found in sitemap" });
    }

    // Create and run crawler
    const crawler = new CheerioCrawler(crawlerConfig);
    await crawler.addRequests(urls);
    await crawler.run();

    // Retrieve data
    const result = await crawler.getData();
    return res.json({ page_content: result.items });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
