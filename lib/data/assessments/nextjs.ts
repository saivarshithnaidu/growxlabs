import { Question } from "@/types/courses";

export const nextjsAssessment: Question[] = [
  // EASY (15 Questions)
  {
    id: "n_e1",
    type: "mcq",
    difficulty: "easy",
    text: "What is the primary benefit of React Server Components (RSC)?",
    options: ["They run only on the client", "They reduce JavaScript bundle size on the client", "They replace browser APIs", "They make CSS faster"],
    correctOptionIndex: 1,
    explanation: "RSCs render on the server and send zero JS to the client, keeping the bundle size small."
  },
  {
    id: "n_e2",
    type: "mcq",
    difficulty: "easy",
    text: "Which file is used to define a shared layout in Next.js App Router?",
    options: ["_app.tsx", "index.tsx", "layout.tsx", "template.tsx"],
    correctOptionIndex: 2,
    explanation: "layout.tsx is used to create UI that is shared across multiple pages."
  },
  {
    id: "n_e3",
    type: "mcq",
    difficulty: "easy",
    text: "Which directive must be at the top of a file to use React hooks like useState?",
    options: ["'use hooks'", "'use client'", "'use state'", "'use react'"],
    correctOptionIndex: 1,
    explanation: "'use client' marks a component as a Client Component, allowing it to use client-side features."
  },
  {
    id: "n_e4",
    type: "mcq",
    difficulty: "easy",
    text: "What is the folder used for the new routing system in Next.js 13+?",
    options: ["pages", "src", "public", "app"],
    correctOptionIndex: 3,
    explanation: "The 'app' directory is the core of the App Router system."
  },
  {
    id: "n_e5",
    type: "code_output",
    difficulty: "easy",
    text: "What does this folder structure represent: app/dashboard/[id]/page.tsx?",
    options: ["A static route", "A dynamic route matching /dashboard/123", "A layout for dashboard", "An API route"],
    correctOptionIndex: 1,
    explanation: "Square brackets denote dynamic route segments used to match variable path segments."
  },
  {
    id: "n_e6",
    type: "mcq",
    difficulty: "easy",
    text: "Which file provides an instant loading UI for a route segment?",
    options: ["error.tsx", "not-found.tsx", "loading.tsx", "pending.tsx"],
    correctOptionIndex: 2,
    explanation: "loading.tsx automatically wraps page content in a React Suspense boundary."
  },
  {
    id: "n_e7",
    type: "mcq",
    difficulty: "easy",
    text: "How do you define a server action?",
    options: ["Adding 'use action' to a function", "Adding 'use server' inside an async function or at file top", "Using the API directory", "Using state hooks"],
    correctOptionIndex: 1,
    explanation: "The 'use server' directive defines a function as a Server Action."
  },
  {
    id: "n_e8",
    type: "mcq",
    difficulty: "easy",
    text: "Which component is used for optimized image loading in Next.js?",
    options: ["<img>", "<OptimizedImage>", "<Image /> from 'next/image'", "<Picture>"],
    correctOptionIndex: 2,
    explanation: "The Next.js Image component automatically optimizes images for size and performance."
  },
  {
    id: "n_e9",
    type: "mcq",
    difficulty: "easy",
    text: "What is the purpose of revalidatePath()?",
    options: ["To reload the browser", "To clear the server-side cache for a specific path", "To redirect the user", "To delete a database entry"],
    correctOptionIndex: 1,
    explanation: "revalidatePath allows you to purge cached data on demand for specific routes."
  },
  {
    id: "n_e10",
    type: "scenario",
    difficulty: "easy",
    text: "You want a script to run on every page of your app. Where is the best place to put it?",
    options: ["Root layout.tsx", "In every page.tsx", "In public/static.js", "In globals.css"],
    correctOptionIndex: 0,
    explanation: "The Root Layout wraps the entire application, making it ideal for global scripts or providers."
  },
  {
    id: "n_e11",
    type: "mcq",
    difficulty: "easy",
    text: "Which command starts the Next.js development server?",
    options: ["npm run build", "npm run start", "npm run dev", "npm run serve"],
    correctOptionIndex: 2,
    explanation: "npm run dev is the standard command for local development with hot-reloading."
  },
  {
    id: "n_e12",
    type: "mcq",
    difficulty: "easy",
    text: "What does the 'next/link' component optimize?",
    options: ["External redirects", "Client-side navigation and prefetching", "Server-side redirects", "Image loading"],
    correctOptionIndex: 1,
    explanation: "Link enables client-side transitions and prefetches code for the destination route when it enters the viewport."
  },
  {
    id: "n_e13",
    type: "mcq",
    difficulty: "easy",
    text: "Which file is used for environment variables in Next.js?",
    options: ["settings.json", "config.env", ".env.local", "process.env"],
    correctOptionIndex: 2,
    explanation: ".env.local is the default local environment variable file recognized by Next.js."
  },
  {
    id: "n_e14",
    type: "mcq",
    difficulty: "easy",
    text: "What is the default rendering behavior in the App Router?",
    options: ["Client Side Rendering", "Static Site Generation", "Server Side Rendering", "Incremental Static Regeneration"],
    correctOptionIndex: 1, // Actually RSCs default to static rendering if no dynamic functions are used
    explanation: "Next.js App Router defaults to static rendering to provide the best performance."
  },
  {
    id: "n_e15",
    type: "mcq",
    difficulty: "easy",
    text: "Which hook is used to get the current URL path in a Client Component?",
    options: ["useRouter", "usePathname", "useSearchParams", "useNavigation"],
    correctOptionIndex: 1,
    explanation: "usePathname is a hook that allows you to read the current URL's pathname."
  },

  // MEDIUM (20 Questions)
  {
    id: "n_m1",
    type: "code_output",
    difficulty: "medium",
    text: "What happens when you use 'fetch' without any cache options in a Server Component?",
    options: ["It caches forever by default", "It never caches by default", "It depends on the environment", "It throws an error"],
    correctOptionIndex: 0, 
    explanation: "In Next.js, native fetch is extended to cache data in the Data Cache of the server indefinitely by default."
  },
  {
    id: "n_m2",
    type: "multi_select",
    difficulty: "medium",
    text: "Which of the following can be used to handle metadata in Next.js? (Select all that apply)",
    options: ["Metadata object export", "generateMetadata function", "<Head> component in App Router", "layout.tsx and page.tsx files"],
    correctOptionIndices: [0, 1, 3],
    explanation: "App Router uses the Metadata API (object or function). The <Head> component is legacy from the Pages router."
  },
  {
    id: "n_m3",
    type: "bug",
    difficulty: "medium",
    text: "Why will this code fail to compile?",
    codeSnippet: "'use client';\nasync function MyComponent() {\n  const data = await fetchData();\n  return <div>{data.name}</div>;\n}",
    options: ["fetchData is not defined", "Client Components cannot be async", "Data is not rendered correctly", "Cannot use 'use client' and async together"],
    correctOptionIndex: 1,
    explanation: "Client Components cannot be async. Async components are strictly reserved for Server Components."
  },
  {
    id: "n_m4",
    type: "scenario",
    difficulty: "medium",
    text: "You need to render two different versions of a page based on a user's role without changing the URL. Which feature do you use?",
    options: ["Parallel Routes (@role)", "Intercepting Routes", "Dynamic Segments", "Middleware only"],
    correctOptionIndex: 0,
    explanation: "Parallel Routes allow you to define multiple 'slots' (like @admin and @user) to render different UIs concurrently or conditionally."
  },
  {
    id: "n_m5",
    type: "mcq",
    difficulty: "medium",
    text: "What is the 'Full Route Cache'?",
    options: ["Caching API responses in the browser", "Caching the rendered HTML and RSC payload on the server at build time", "Caching images on the CDN", "Caching JS bundles"],
    correctOptionIndex: 1,
    explanation: "Full Route Cache stores the static output (HTML/RSC) of a route to serve it instantly without re-rendering."
  },
  {
    id: "n_m6",
    type: "mcq",
    difficulty: "medium",
    text: "What does the 'force-dynamic' export do in a page file?",
    options: ["It optimizes the page for speed", "It forces the page to be rendered on every request (SSR)", "It only allows dynamic imports", "It forces the use of Client Components"],
    correctOptionIndex: 1,
    explanation: "export const dynamic = 'force-dynamic' disables static optimization for a route."
  },
  {
    id: "n_m7",
    type: "mcq",
    difficulty: "medium",
    text: "Which function allows you to get data from a form in a Server Action?",
    options: ["formData.get('name')", "req.body.name", "useFormState()", "params.get('name')"],
    correctOptionIndex: 0,
    explanation: "Server Actions receive a FormData object as the first argument by default."
  },
  {
    id: "n_m8",
    type: "multi_select",
    difficulty: "medium",
    text: "Which features are supported in the Edge Runtime? (Select all that apply)",
    options: ["Standard Web APIs (fetch, Response, etc.)", "Node.js 'fs' module", "V8 isolate architecture", "Native Node.js 'http' module"],
    correctOptionIndices: [0, 2],
    explanation: "Edge Runtime is a subset of Node.js that prioritizes web standards and speed; it doesn't support heavy Node modules like 'fs'."
  },
  {
    id: "n_m9",
    type: "bug",
    difficulty: "medium",
    text: "A component is re-rendering infinitely when using a hook. What is the most likely missing check?",
    options: ["useEffect dependencies", "useState initial value", "useMemo for complex logic", "Server Side Rendering context"],
    correctOptionIndex: 0,
    explanation: "Incorrect or missing dependency arrays in useEffect are the #1 cause of infinite loops in React."
  },
  {
    id: "n_m10",
    type: "mcq",
    difficulty: "medium",
    text: "How does 'generateStaticParams' differ from 'getStaticPaths'?",
    options: ["It doesn't. They are identical.", "generateStaticParams is for the App Router; getStaticPaths is for Pages Router.", "One is async, the other is not.", "One is for images, one is for routes."],
    correctOptionIndex: 1,
    explanation: "generateStaticParams is the modern replacement optimized for App Router architecture."
  },
  {
    id: "n_m11",
    type: "scenario",
    difficulty: "medium",
    text: "You want a specific part of your page to be dynamic while the rest is static (PPR). This is called:",
    options: ["Server Side Rendering", "Partial Prerendering", "Static Site Generation", "Client Side Hydration"],
    correctOptionIndex: 1,
    explanation: "Partial Prerendering (PPR) combines static shell with high-performance dynamic holes."
  },
  {
    id: "n_m12",
    type: "mcq",
    difficulty: "medium",
    text: "What is the 'next.config.js' file used for?",
    options: ["Client-side logic", "Configuring redirects, headers, and images", "Defining the database connection", "Managing node modules"],
    correctOptionIndex: 1,
    explanation: "This file is the main configuration entry for the Next.js runtime environment."
  },
  {
    id: "n_m13",
    type: "code_output",
    difficulty: "medium",
    text: "What is the value of 'process.env.NEXT_PUBLIC_KEY' in the browser?",
    options: ["undefined", "The actual key value", "null", "A reference to the server value"],
    correctOptionIndex: 1,
    explanation: "Prefixing environment variables with NEXT_PUBLIC_ makes them accessible to the client-side JavaScript."
  },
  {
    id: "n_m14",
    type: "mcq",
    difficulty: "medium",
    text: "Which Middleware response can rewrite a URL without changing the browser address bar?",
    options: ["NextResponse.redirect()", "NextResponse.rewrite()", "NextResponse.next()", "NextResponse.modify()"],
    correctOptionIndex: 1,
    explanation: "Rewrite maps an internal path to a different source while keeping the URL visible to the user the same."
  },
  {
    id: "n_m15",
    type: "mcq",
    difficulty: "medium",
    text: "What is the purpose of 'template.tsx'?",
    options: ["It is a replacement for layout.tsx", "It is like layout but re-mounts on every navigation (no state persistence)", "It only works with CSS", "It defines API responses"],
    correctOptionIndex: 1,
    explanation: "Templates are similar to layouts but create a new instance for each child on navigation, useful for entry animations."
  },
  {
    id: "n_m16",
    type: "multi_select",
    difficulty: "medium",
    text: "In Next.js, 'useFormStatus' provides access to:",
    options: ["pending state", "form data", "form action", "database status"],
    correctOptionIndices: [0, 1, 2],
    explanation: "useFormStatus gives you pending, data, method, and action properties for a parent form."
  },
  {
    id: "n_m17",
    type: "mcq",
    difficulty: "medium",
    text: "What is ISR (Incremental Static Regeneration)?",
    options: ["Rebuilding the entire site", "Updating static pages after build time without a full redeploy", "Client filtering", "None of the above"],
    correctOptionIndex: 1,
    explanation: "ISR allows you to update static content by re-rendering pages in the background as traffic comes in."
  },
  {
    id: "n_m18",
    type: "mcq",
    difficulty: "medium",
    text: "Where should you ideally handle cookie-based authentication checks for entire route groups?",
    options: ["globals.css", "In every page file", "middleware.ts", "In a layout component"],
    correctOptionIndex: 2,
    explanation: "Middleware is the most efficient place to intercept requests and check auth before they reach any page logic."
  },
  {
    id: "n_m19",
    type: "bug",
    difficulty: "medium",
    text: "Why is my 'generateMetadata' function not being called in a Client Component?",
    options: ["Client Components don't support generateMetadata", "Function name is misspelled", "The page is already static", "None of the above"],
    correctOptionIndex: 0,
    explanation: "Metadata can only be defined in Server Components."
  },
  {
    id: "n_m20",
    type: "mcq",
    difficulty: "medium",
    text: "What is the 'Link' component from 'next/link'?",
    options: ["A normal <a> tag", "A specialized React component that prefetches routes", "A library for external links", "A server-side redirect tool"],
    correctOptionIndex: 1,
    explanation: "next/link prefetches assets for the destination page when the link enters the viewport."
  },

  // HARD (15 Questions)
  {
    id: "n_h1",
    type: "code_output",
    difficulty: "hard",
    text: "What happens if a Server Action throws an error that is not caught?",
    options: ["The browser crashes", "The nearest error.tsx boundary is triggered", "Next.js ignores it", "The user is logged out"],
    correctOptionIndex: 1,
    explanation: "Server Action errors are propagated to the nearest Error Boundary on the client."
  },
  {
    id: "n_h2",
    type: "bug",
    difficulty: "hard",
    text: "Identifying Hydration Error: Why does React complain when using 'new Date()' in a Client Component?",
    options: ["Date objects are too large", "The server and client render different values because of time drift during SSR", "Dates are not valid React nodes", "None"],
    correctOptionIndex: 1,
    explanation: "Hydration requires the initial HTML from the server to match the first render on the client perfectly. Dynamic values like time break this."
  },
  {
    id: "n_h3",
    type: "scenario",
    difficulty: "hard",
    text: "You are building a real-time dashboard. You need to bail out of the Full Route Cache for a specific component. What's the best approach?",
    options: ["Use 'unstable_noStore()'", "Delete the page.tsx", "Use a generic hook", "Make it a Client Component"],
    correctOptionIndex: 0,
    explanation: "unstable_noStore() or setting revalidate to 0 flags the component as dynamic, bypassing the static cache."
  },
  {
    id: "n_h4",
    type: "mcq",
    difficulty: "hard",
    text: "What is the 'Request Memoization' in Next.js?",
    options: ["Caching across different users", "Deduping identical fetch requests within a single render pass", "Caching in localStorage", "None"],
    correctOptionIndex: 1,
    explanation: "Next.js automatically dedupes GET fetch calls with the same URL and options during the lifecycle of a single request."
  },
  {
    id: "n_h5",
    type: "fix",
    difficulty: "hard",
    text: "How do you handle Zod validation errors inside a Server Action and return them to the UI?",
    options: ["Throw an Error", "Use useFormState to pass errors back through the return value", "Alert user", "Redirect to error page"],
    correctOptionIndex: 1,
    explanation: "Returning a serializable object from the action and using useFormState is the standard way to handle predictable validation errors."
  },
  {
    id: "n_h6",
    type: "multi_select",
    difficulty: "hard",
    text: "Which of these will trigger 'Dynamic Rendering' for an otherwise static route?",
    options: ["Using cookies()", "Using headers()", "Using useSearchParams in a Client Component", "Using fetch() with cache: 'no-store'"],
    correctOptionIndices: [0, 1, 3],
    explanation: "Dynamic functions like cookies and headers, or bailing out of caching, opt the entire route into dynamic rendering."
  },
  {
    id: "n_h7",
    type: "code_output",
    difficulty: "hard",
    text: "In App Router, what is the 'Suspense' boundary's behavior on the server?",
    options: ["It waits for everything before sending HTML", "It streams the shell first and the component once pre-rendered", "It only works on the client", "It is ignored"],
    correctOptionIndex: 1,
    explanation: "Next.js uses Suspense for selective hydration and streaming, allowing incremental UI delivery."
  },
  {
    id: "n_h8",
    type: "mcq",
    difficulty: "hard",
    text: "What is a 'Route Handler'?",
    options: ["A function in middleware.ts", "The modern replacement for API Routes (route.ts)", "A navigation hook", "A way to handle redirects"],
    correctOptionIndex: 1,
    explanation: "Route Handlers (route.ts) allow you to create custom request handlers for a given route using the Web Request and Response APIs."
  },
  {
    id: "n_h9",
    type: "bug",
    difficulty: "hard",
    text: "Why is 'revalidatePath' not working in my Client Component?",
    options: ["It only works in Server Actions or Route Handlers", "It needs a key", "Path is wrong", "Client components don't support logic"],
    correctOptionIndex: 0,
    explanation: "revalidatePath is a server-only function and must be called from the server environment."
  },
  {
    id: "n_h10",
    type: "scenario",
    difficulty: "hard",
    text: "You want a tabbed navigation where the URL changes but the navigation state (tabs) stays visible. This is achieved via:",
    options: ["Parallel Routes & Intercepting Routes", "Standard links", "State hooks", "Context provider"],
    correctOptionIndex: 0,
    explanation: "Intercepting routes allow you to load a route from another part of your application within the current layout."
  },
  {
    id: "n_h11",
    type: "mcq",
    difficulty: "hard",
    text: "Which cache level in Next.js persists across multiple user requests?",
    options: ["Request Memoization", "Data Cache", "Router Cache", "None"],
    correctOptionIndex: 1,
    explanation: "The Data Cache is a server-side cache that persists across multiple incoming requests and deployments."
  },
  {
    id: "n_h12",
    type: "fix",
    difficulty: "hard",
    text: "Fixing Server Action Security: How do you prevent unauthorized users from triggering an action?",
    options: ["Check auth() inside the action function", "Trust the client side check", "Check headers", "Use invisible inputs"],
    correctOptionIndex: 0,
    explanation: "Just like an API route, you must ALWAYS verify the user session inside the action body before performing operations."
  },
  {
    id: "n_h13",
    type: "multi_select",
    difficulty: "hard",
    text: "What are the limitations of the 'Client Cache' (Router Cache)?",
    options: ["It persists across page refreshes", "It is cleared on refresh", "It caches RSC payloads in the browser", "It stores only images"],
    correctOptionIndices: [1, 2],
    explanation: "The Router Cache is an in-memory client-side cache for RSC payloads. It is wiped when the page is hard-refreshed."
  },
  {
    id: "n_h14",
    type: "mcq",
    difficulty: "hard",
    text: "What does 'unstable_cache' do?",
    options: ["It makes the site unstable", "It allows caching of non-fetch data (like DB queries)", "It crashes the server", "None of the above"],
    correctOptionIndex: 1,
    explanation: "unstable_cache allows you to manually cache any async function call into the Data Cache."
  },
  {
    id: "n_h15",
    type: "mcq",
    difficulty: "hard",
    text: "Which Next.js component is used to optimize third-party scripts?",
    options: ["<Script /> from 'next/script'", "<Head>", "external.js", "middleware"],
    correctOptionIndex: 0,
    explanation: "The Script component allows you to set loading strategies (like afterInteractive or lazyOnload) for external scripts."
  }
];
