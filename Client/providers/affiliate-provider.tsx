"use client";

import Script from "next/script";
import React from "react";

export default function AffiliateProvider() {
  return (
    <>
      <Script>
        {`window.lemonSqueezyAffiliateConfig = {
              store: "chatfabrica",
            }`}
      </Script>
      <Script src="https://lmsqueezy.com/affiliate.js" defer />
      <Script
        src="https://app.lemonsqueezy.com/js/lemon.js"
        strategy="lazyOnload"
      ></Script>
    </>
  );
}
