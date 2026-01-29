/**
 * Test Data Fixtures
 * Reusable test data for all test suites
 */

/**
 * Sample user data
 */
export const testUsers = {
  validUser: {
    email: "testuser@example.com",
    password: "SecurePassword123!",
    name: "Test User",
  },
  alternateUser: {
    email: "alternate@example.com",
    password: "AltPassword456!",
    name: "Alternate User",
  },
  invalidCredentials: {
    email: "nonexistent@example.com",
    password: "WrongPassword123!",
  },
  weakPassword: {
    email: "weakpwd@example.com",
    password: "123", // Too weak
  },
};

/**
 * Sample website data
 */
export const testWebsites = {
  valid: {
    name: "Test Blog",
    domain: "testblog.example.com",
  },
  ecommerce: {
    name: "Test Shop",
    domain: "testshop.example.com",
  },
  saas: {
    name: "Test SaaS",
    domain: "testsaas.example.com",
  },
};

/**
 * Sample event data - Pageviews
 */
export const testPageviews = [
  {
    url: "https://example.com/",
    referrer: "https://google.com/search?q=analytics",
    title: "Home Page",
    pathname: "/",
  },
  {
    url: "https://example.com/about",
    referrer: "https://example.com/",
    title: "About Page",
    pathname: "/about",
  },
  {
    url: "https://example.com/blog/post-1",
    referrer: "https://google.com/search?q=blog",
    title: "Blog Post 1",
    pathname: "/blog/post-1",
  },
  {
    url: "https://example.com/pricing",
    referrer: "https://example.com/",
    title: "Pricing",
    pathname: "/pricing",
  },
  {
    url: "https://example.com/contact",
    referrer: "https://example.com/about",
    title: "Contact Us",
    pathname: "/contact",
  },
];

/**
 * Sample event data - Click events
 */
export const testClickEvents = [
  {
    elementText: "Sign Up",
    href: "/signup",
    className: "btn btn-primary",
  },
  {
    elementText: "Learn More",
    href: "/features",
    className: "link",
  },
  {
    elementText: "Download",
    href: "https://example.com/download/app.zip",
    className: "btn btn-secondary",
  },
  {
    elementText: "View Pricing",
    href: "/pricing",
    className: "nav-link",
  },
];

/**
 * Sample event data - Custom events
 */
export const testCustomEvents = [
  {
    eventName: "form_submit",
    formId: "contact-form",
    formName: "Contact Us",
    fieldCount: 4,
  },
  {
    eventName: "video_play",
    videoId: "intro-video",
    videoTitle: "Product Introduction",
    duration: 120,
  },
  {
    eventName: "search_query",
    query: "analytics dashboard",
    resultsCount: 42,
  },
  {
    eventName: "add_to_cart",
    productId: "prod-123",
    productName: "Pro Plan",
    price: 99.99,
  },
];

/**
 * Device information
 */
export const testDevices = [
  {
    deviceType: "desktop",
    browser: "Chrome",
    os: "Windows",
    version: "120.0.0",
  },
  {
    deviceType: "mobile",
    browser: "Safari",
    os: "iOS",
    version: "17.2",
  },
  {
    deviceType: "tablet",
    browser: "Chrome",
    os: "Android",
    version: "13.0",
  },
  {
    deviceType: "mobile",
    browser: "Chrome",
    os: "Android",
    version: "14.0",
  },
];

/**
 * Geographic locations
 */
export const testLocations = [
  { country: "US", city: "New York", code: "NY" },
  { country: "US", city: "San Francisco", code: "CA" },
  { country: "UK", city: "London", code: "LND" },
  { country: "Germany", city: "Berlin", code: "BE" },
  { country: "France", city: "Paris", code: "IL" },
  { country: "Canada", city: "Toronto", code: "ON" },
];

/**
 * Traffic sources/referrers
 */
export const testReferrers = [
  "https://google.com/search",
  "https://facebook.com",
  "https://twitter.com",
  "https://linkedin.com",
  "https://reddit.com",
  "direct",
  "https://news.ycombinator.com",
];

/**
 * Helper to generate random test data
 */
export const generateTestData = {
  visitorId: () => `vis-${Math.random().toString(36).substr(2, 9)}`,

  sessionId: () =>
    `sess-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,

  randomPageview: () =>
    testPageviews[Math.floor(Math.random() * testPageviews.length)],

  randomClick: () =>
    testClickEvents[Math.floor(Math.random() * testClickEvents.length)],

  randomCustom: () =>
    testCustomEvents[Math.floor(Math.random() * testCustomEvents.length)],

  randomDevice: () =>
    testDevices[Math.floor(Math.random() * testDevices.length)],

  randomLocation: () =>
    testLocations[Math.floor(Math.random() * testLocations.length)],

  randomReferrer: () =>
    testReferrers[Math.floor(Math.random() * testReferrers.length)],

  randomTimestamp: (daysBack = 7) => {
    const now = new Date();
    const randomDays = Math.floor(Math.random() * daysBack);
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);

    const date = new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000);
    date.setHours(randomHours, randomMinutes);
    return date;
  },

  /**
   * Generate N random events
   */
  events: (count: number, trackingCode: string) => {
    const events = [];
    const types = ["pageview", "click", "custom"];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      let event: any = {
        trackingCode,
        eventType: type,
        sessionId: generateTestData.sessionId(),
        visitorId: generateTestData.visitorId(),
        timestamp: generateTestData.randomTimestamp(),
      };

      if (type === "pageview") {
        const pageview = generateTestData.randomPageview();
        event.url = pageview.url;
        event.referrer = pageview.referrer;
        event.properties = {
          title: pageview.title,
          pathname: pageview.pathname,
        };
      } else if (type === "click") {
        const click = generateTestData.randomClick();
        event.url = `https://example.com`;
        event.properties = click;
      } else {
        const custom = generateTestData.randomCustom();
        event.url = `https://example.com`;
        event.properties = custom;
      }

      events.push(event);
    }

    return events;
  },
};

export default {
  testUsers,
  testWebsites,
  testPageviews,
  testClickEvents,
  testCustomEvents,
  testDevices,
  testLocations,
  testReferrers,
  generateTestData,
};
