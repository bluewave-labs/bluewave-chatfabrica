import { createCheerioRouter } from "crawlee";

// Create a Cheerio router
export const router = createCheerioRouter();

// Default handler for enqueueing new URLs
router.addDefaultHandler(async ({ enqueueLinks, log }) => {
  try {
    log.info("Enqueuing new URLs");
    // Enqueue links with the same domain strategy
    await enqueueLinks({
      strategy: "same-domain",
      label: "detail",
    });
  } catch (error) {
    log.error("Error in default handler:", error);
  }
});

router.addHandler("detail", async ({ request, $, log, pushData }) => {
  try {
    // Extract title and body content
    const title = $("title").text();
    const body = $("body")
      .text()
      .replace(/\s+/g, " ")
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    const characterCount = body.length;

    log.info(`${title}`, { url: request.loadedUrl });

    // Push data to the storage
    await pushData({
      url: request.loadedUrl,
      title,
      body,
      characterCount,
    });
  } catch (error) {
    log.error("Error in detail handler:", error);
  }
});
