import { Course } from "@/types/courses";
import { javaAssessment } from "./assessments/java";
import { nextjsAssessment } from "./assessments/nextjs";
import { pythonAssessment } from "./assessments/python";

export const courses: Course[] = [
  {
    id: "java-mastery",
    title: "Java Mastery: From Core to Enterprise Microservices",
    slug: "java-mastery",
    description: "The definitive guide to becoming a job-ready Java Backend Engineer. Master everything from memory management and concurrency to production-grade Spring Boot architectures and JWT-secured microservices.",
    image: "/courses/java.jpg",
    difficulty: "Intermediate",
    duration: "75 Hours",
    modules: [
      {
        id: "m1",
        title: "Programming Foundations",
        slug: "foundations",
        description: "Master the fundamental syntax and the internal workings of the JVM.",
        lessons: [
          {
            id: "l1",
            title: "Internal Architecture of JVM",
            slug: "jvm-internals",
            explanation: "The Java Virtual Machine (JVM) is the engine that executes your code. It acts as a middleman between your program and the computer hardware. Because of the JVM, you can write code once on any computer and run it on any other device without making changes. It handles memory, security, and the translation of your code into something the machine understands.",
            keyPoints: ["The JVM makes Java platform-independent.", "It handles automatic memory management.", "It loads and verifies your classes before running."],
            codeExample: "// Checking how much memory the JVM is using\npublic class JVMCheck {\n    public static void main(String[] args) {\n        long memory = Runtime.getRuntime().totalMemory();\n        System.out.println(\"Total JVM Memory: \" + memory + \" bytes\");\n    }\n}",
            expectedOutput: "Total JVM Memory: [Value] bytes",
            useCase: "Optimizing code to run efficiently on small devices or high-end servers.",
            practiceTask: "Run this code on your machine and note down the total memory displayed."
          },
          {
            id: "l1_2",
            title: "Variables and Data Types",
            slug: "variables-scopes",
            explanation: "Variables are named containers used to store data in a program. In Java, you must declare what kind of data the variable will hold before you use it. This prevents errors by ensuring you don't try to store text in a number container. Simple types include numbers like int and double, while complex types include things like text strings.",
            keyPoints: ["'int' stores whole numbers.", "'double' stores decimal numbers.", "'String' stores text."],
            codeExample: "public class Variables {\n    public static void main(String[] args) {\n        int age = 25;\n        double price = 10.99;\n        String name = \"Java Student\";\n        \n        System.out.println(name + \" is \" + age + \" years old.\");\n    }\n}",
            expectedOutput: "Java Student is 25 years old.",
            useCase: "Tracking items in a shopping cart or storing a user's name in a profile.",
            practiceTask: "Create a variable for your own name and age and print them together."
          }
        ]
      },
      {
        id: "m2",
        title: "Object Oriented Programming",
        slug: "oop-deep-dive",
        description: "Learn how to organize your code like real-world objects.",
        lessons: [
          {
            id: "l2_1",
            title: "Classes and Objects",
            slug: "classes-objects",
            explanation: "A class is a blueprint or a template for an object. Just like a car blueprint defines how a car looks and works, a class defines the data and behavior of objects. An object is a real instance of that blueprint. For example, if 'Car' is the class, your neighbor's red Toyota is the object. This structure makes code reusable and organized.",
            keyPoints: ["A class defines the structure.", "An object is a specific version of a class.", "Classes stay in files, objects live in memory."],
            codeExample: "class Dog {\n    String breed = \"Labrador\";\n    void bark() {\n        System.out.println(\"Woof!\");\n    }\n}\n\npublic class Zoo {\n    public static void main(String[] args) {\n        Dog myDog = new Dog();\n        System.out.println(myDog.breed);\n        myDog.bark();\n    }\n}",
            expectedOutput: "Labrador\nWoof!",
            useCase: "Modeling reusable data like Customers, Invoices, or Products in a system.",
            practiceTask: "Create a class called 'Book' with a title and price, then print them."
          }
        ]
      },
      {
        id: "m3",
        title: "The Collections Framework",
        slug: "collections",
        description: "Learn how to manage groups of data efficiently.",
        lessons: [
          {
            id: "l3_1",
            title: "Working with ArrayList",
            slug: "lists",
            explanation: "An ArrayList is like a flexible array that grows or shrinks as you add or remove items. Regular arrays have a fixed size, which can be difficult to manage. ArrayLists allow you to keep adding items without worrying about how much space is left. It is the most common way to store a list of items in Java applications.",
            keyPoints: ["It grows dynamically.", "You can access items by their index.", "It is part of the java.util package."],
            codeExample: "import java.util.ArrayList;\n\npublic class ListApp {\n    public static void main(String[] args) {\n        ArrayList<String> fruits = new ArrayList<>();\n        fruits.add(\"Apple\");\n        fruits.add(\"Banana\");\n        \n        System.out.println(fruits.get(0));\n    }\n}",
            expectedOutput: "Apple",
            useCase: "Storing a list of tasks in a to-do app or items in a digital inventory.",
            practiceTask: "Add three more numbers to a list and print the second one."
          }
        ]
      },
      {
        id: "m4",
        title: "Errors and Files",
        slug: "exceptions-io",
        description: "How to handle crashes and read data from files.",
        lessons: [
          {
            id: "l4_1",
            title: "Handling Exceptions",
            slug: "try-catch",
            explanation: "Exceptions are errors that happen while your program is running. Without proper handling, these errors would cause your program to crash instantly. Java uses a system called 'try-catch' to catch these errors and react to them safely. This ensures that even if something goes wrong, the program can tell the user what happened instead of just stopping.",
            keyPoints: ["'try' block holds the risky code.", "'catch' block handles the error.", "'finally' block runs no matter what."],
            codeExample: "public class ErrorFix {\n    public static void main(String[] args) {\n        try {\n            int result = 5 / 0;\n        } catch (Exception e) {\n            System.out.println(\"Error: You cannot divide by zero!\");\n        }\n    }\n}",
            expectedOutput: "Error: You cannot divide by zero!",
            useCase: "Preventing a banking app from crashing if a user enters an invalid number.",
            practiceTask: "Try to access an index in a list that doesn't exist and catch the error."
          }
        ]
      },
      {
        id: "m5",
        title: "Multithreading",
        slug: "multithreading",
        description: "Make your program do multiple things at once.",
        lessons: [
          {
            id: "l5_1",
            title: "Threads and Tasks",
            slug: "thread-basics",
            explanation: "A thread is a single path of execution in a program. By default, Java programs run on one thread. Multithreading allows you to create extra threads so your program can do two or more things at the same time. This is useful for long tasks that shouldn't block the rest of the application, like downloading a file or processing large data sets in the background.",
            keyPoints: ["Threads run in parallel.", "They share the same memory space.", "Java uses the 'Thread' class for this."],
            codeExample: "class BackgroundTask extends Thread {\n    public void run() {\n        System.out.println(\"Task running in the background...\");\n    }\n}\n\npublic class SystemX {\n    public static void main(String[] args) {\n        BackgroundTask task = new BackgroundTask();\n        task.start();\n    }\n}",
            expectedOutput: "Task running in the background...",
            useCase: "Updating a timer on screen while fetching data from the internet.",
            practiceTask: "Create two separate threads and have each one print a different message."
          }
        ]
      },
      {
        id: "m6",
        title: "Database Integration",
        slug: "jdbc-database",
        description: "Connect your Java program to a real database.",
        lessons: [
          {
            id: "l6_1",
            title: "Connecting with JDBC",
            slug: "jdbc-pattern",
            explanation: "JDBC is a bridge that allows Java to communicate with databases like MySQL or PostgreSQL. Instead of storing data in temporary variables that disappear when the program closes, JDBC lets you save data permanently in a database. You can save, search, and delete records directly from your Java code using standard database commands.",
            keyPoints: ["JDBC stands for Java Database Connectivity.", "It requires a driver for the specific database.", "It executes SQL commands from Java."],
            codeExample: "// Simplified database connection concept\nString url = \"jdbc:mysql://localhost:3306/db\";\nConnection conn = DriverManager.getConnection(url, \"user\", \"pass\");\nSystem.out.println(\"Connected to database!\");",
            expectedOutput: "Connected to database!",
            useCase: "Saving user account information that remains after the app is closed.",
            practiceTask: "Define a string variable that holds a SQL 'CREATE TABLE' command."
          }
        ]
      },
      {
        id: "m7",
        title: "Spring Boot Essentials",
        slug: "spring-boot",
        description: "Learn the foundation of modern Java application design.",
        lessons: [
          {
            id: "l7_1",
            title: "Managing Dependencies",
            slug: "spring-di",
            explanation: "In large programs, managing all the different objects manually becomes impossible. Spring is a framework that takes over this work. Instead of you creating every object yourself, you simply tell Spring what you need, and it provides it for you. This is called Dependency Injection, and it makes your code much easier to test, maintain, and expand over time.",
            keyPoints: ["Spring manages the lifecycle of objects.", "It uses annotations like @Component.", "Dependency Injection reduces hard-coded links."],
            codeExample: "@Component\nclass Tool {\n    void use() { System.out.println(\"Tool is active\"); }\n}\n\n// Spring will automatically provide the Tool object where needed.",
            expectedOutput: "Tool is active",
            useCase: "Building a complex website where different parts need to talk to each other.",
            practiceTask: "Write down the name of a class and mark it with a comment as a @Component."
          }
        ]
      },
      {
        id: "m8",
        title: "Building APIs",
        slug: "rest-jwt",
        description: "How to let other apps talk to your Java program.",
        lessons: [
          {
            id: "l8_1",
            title: "REST Concepts",
            slug: "rest-design",
            explanation: "An API is a way for two different apps to stay connected. REST is a set of rules for building these APIs. It uses standard web actions like GET to fetch data and POST to send data. When you build a REST API in Java, you enable your software to communicate with mobile apps, websites, and other servers using simple blocks of data called JSON.",
            keyPoints: ["APIs are the link between systems.", "GET fetches data, POST sends data.", "JSON is the universal data format."],
            codeExample: "@GetMapping(\"/greet\")\npublic String hello() {\n    return \"Hello from the API!\";\n}",
            expectedOutput: "Hello from the API!",
            useCase: "Connecting a mobile food delivery app to a restaurant's order server.",
            practiceTask: "Write a simple URL that could be used to fetch a list of products."
          }
        ]
      },
      {
        id: "m9",
        title: "Final Project Preparation",
        slug: "recruit-ai-backend",
        description: "Plan and build your final application.",
        lessons: [
          {
            id: "l9_1",
            title: "Designing the System",
            slug: "capstone-setup",
            explanation: "Before you start coding a large project, you must design how the data will be organized. This lesson covers the basic architecture of your final project. You will learn how to create tables for users and tasks, and how to define the paths that your API will use. Good design at the start prevents major headaches and bugs during the coding phase.",
            keyPoints: ["Data modeling comes before coding.", "Endpoints define how users interact.", "Security must be planned early."],
            codeExample: "// Project structure concept\nclass User {\n    int id;\n    String name;\n    String email;\n}",
            expectedOutput: "A structured plan for the final project.",
            useCase: "Building the core logic for the GrowX Labs hiring system.",
            practiceTask: "List five pieces of information you would need to store for a job application."
          }
        ]
      }
    ],
    assessment: javaAssessment,
    finalProject: {

      title: "RecruitAI Enterprise Backend",
      description: "A full-scale Applicant Tracking System (ATS) backend with role-based access control, resume parsing logic, and specialized scoring algorithms for candidates.",
      requirements: [
        "Spring Boot 3.2+ & Java 21",
        "PostgreSQL & Spring Data JPA",
        "JWT-based Security with Spring Security 6",
        "API Documentation with Swagger/OpenAPI",
        "Unit Testing with JUnit and Mockito"
      ]
    }
  },
  {
    id: "nextjs-fullstack",
    title: "Next.js 15: Production-Ready Full Stack",
    slug: "nextjs-fullstack",
    description: "Build modern, SEO-optimized web applications with Next.js App Router, React Server Components, and Supabase integration.",
    image: "/courses/nextjs.jpg",
    difficulty: "Advanced",
    duration: "30 Hours",
    modules: [
      {
        id: "nx1",
        title: "Modern Architecture: RSC & App Router",
        slug: "rsc-architecture",
        description: "Master the zero-bundle-size foundation of the new React.",
        lessons: [
          {
            id: "nxl1",
            title: "Client vs Server Components",
            slug: "client-vs-server",
            explanation: "Next.js App Router defaults to React Server Components (RSC). These components render strictly on the server and send zero JavaScript to the browser, significantly improving performance. Use 'use client' only when you need interactivity (onClick, useState) or browser-only APIs.",
            keyPoints: ["Server Components reduce the JS bundle size.", "Client Components are opt-in for UI interaction.", "Shared data remains on the server for better security.", "Better SEO due to server-side HTML generation."],
            codeExample: "// Server Component by default\nexport default async function Page() {\n  return <h1>Fast Server Rendering</h1>;\n}",
            expectedOutput: "Renders as static HTML without client-side JS hydration overhead.",
            useCase: "Optimizing landing pages and blog content for maximum speed.",
            practiceTask: "Create a page that displays the server's current time without any client logic."
          }
        ]
      },
      {
        id: "nx2",
        title: "Advanced Routing & Layouts",
        slug: "routing-layouts",
        description: "Building complex, nested UIs with dynamic data.",
        lessons: [
          {
            id: "nxl2",
            title: "Parallel & Intercepting Routes",
            slug: "parallel-routes",
            explanation: "Parallel Routes allow you to render multiple pages in the same layout simultaneously (e.g., a dashboard with separate analytics and user data slots). Intercepting routes let you load a route while keeping the current context, like opening an image in a modal while staying on the gallery page.",
            keyPoints: ["Slots use the '@folder' naming convention.", "Intercepting routes use '(..)' syntax.", "Enables complex dashboard layouts without extra state.", "Allows modals to have their own shareable URLs."],
            codeExample: "// app/layout.tsx\nexport default function Layout({ children, analytics }: { children: ReactNode, analytics: ReactNode }) {\n  return <div>{children} {analytics}</div>;\n}",
            expectedOutput: "Both the main page and the analytics component render side-by-side.",
            useCase: "Building multi-view admin dashboards or social media modals.",
            practiceTask: "Setup a @modal slot in your root layout."
          }
        ]
      },
      {
        id: "nx3",
        title: "The Data Lifecycle: Caching & Revalidation",
        slug: "data-cache",
        description: "Understanding how Next.js optimizes network requests.",
        lessons: [
          {
            id: "nxl3",
            title: "Data Cache vs Request Memoization",
            slug: "caching-deep-dive",
            explanation: "Next.js extends the standard fetch API to cache results across requests (Data Cache). Request Memoization dedupes multiple identical fetch calls within a single render cycle, preventing redundant database calls.",
            keyPoints: ["fetch() is cached by default in App Router.", "use revalidatePath to purge specific route caches.", "Force-dynamic bails out of static optimization.", "Tags allow for granular cache invalidation."],
            codeExample: "// Cache for 1 hour\nfetch('https://api.example.com', { next: { revalidate: 3600 } });",
            expectedOutput: "Subsequent requests hit the server cache instead of the external API.",
            useCase: "Displaying product prices that only change once a day.",
            practiceTask: "Implement a fetch call that revalidates every 60 seconds."
          }
        ]
      },
      {
        id: "nx4",
        title: "Server Actions: Zero-API Mutations",
        slug: "server-actions",
        description: "Handling form logic and database writes natively.",
        lessons: [
          {
            id: "nxl4",
            title: "Optimistic UI with Server Actions",
            slug: "optimistic-ui",
            explanation: "Server Actions allow you to handle form submissions without creating API endpoints. Combine them with the useOptimistic hook to update the UI instantly before the server confirms the save, providing a fluid app-like experience.",
            keyPoints: ["'use server' defines a server mutation.", "useFormStatus tracks the loading state.", "useFormState handles validation responses.", "Optimistic UI hides network latency."],
            codeExample: "async function updateName(formData: FormData) {\n  'use server';\n  const name = formData.get('name');\n  await db.update(name);\n}",
            expectedOutput: "The database updates securely without a separate fetch request.",
            useCase: "Creating interactive features like 'Likes', 'Comments', or 'Tasks'.",
            practiceTask: "Build a form that uses a server action to log data."
          }
        ]
      },
      {
        id: "nx5",
        title: "Full Stack: Supabase & Auth",
        slug: "auth-database",
        description: "Secure data persistence with PostgreSQL.",
        lessons: [
          {
            id: "nxl5",
            title: "Middleware-based Auth & RLS",
            slug: "security-rls",
            explanation: "Authentication is best handled in middleware to protect entire route groups. Row Level Security (RLS) ensures that even if an API key is leaked, users can only query data mapped to their own unique user ID.",
            keyPoints: ["Middleware intercepts every request for auth.", "RLS is the last line of defense in the DB.", "auth.uid() maps Postgres records to users.", "Supabase provides instant real-time sync."],
            codeExample: "CREATE POLICY \"Own data only\" ON profiles\nAS PERMISSIVE FOR SELECT\nTO authenticated\nUSING (auth.uid() = id);",
            expectedOutput: "A student can see their own grades, but not others'.",
            useCase: "Protecting sensitive user data in a healthcare or finance app.",
            practiceTask: "Write a SQL policy to allow read-only access for guests."
          }
        ]
      },
      {
        id: "nx6",
        title: "UX Optimization: Streaming & PPR",
        slug: "streaming-ppr",
        description: "Advanced performance patterns for high-scale apps.",
        lessons: [
          {
            id: "nxl6",
            title: "Partial Prerendering (PPR)",
            slug: "ppr-logic",
            explanation: "PPR is a breakthrough that serves a static shell immediately while 'streaming' dynamic holes (like a user's profile picture or shopping cart) as they finish loading on the server.",
            keyPoints: ["PPR combines the best of SSG and SSR.", "Instant loading states with static HTML.", "Zero shift during hydration.", "Requires project-level config enabling."],
            codeExample: "// Static Header\n<Header />\n<Suspense fallback={<Skeleton />}>\n  <DynamicDashboard />\n</Suspense>",
            expectedOutput: "The header loads in 10ms, dashboard follows in 200ms.",
            useCase: "E-commerce sites that need static product lists and dynamic prices.",
            practiceTask: "Wrap a slow-loading component in a Suspense boundary."
          }
        ]
      },
      {
        id: "nx7",
        title: "Edge Runtime & Middleware",
        slug: "edge-middleware",
        description: "Running logic closer to your users.",
        lessons: [
          {
            id: "nxl7",
            title: "Rewrites & Geolocation",
            slug: "edge-logic",
            explanation: "Middleware runs on Vercel's Edge network, globally distributed. You can detect a user's location and rewrite the URL to a specific language or regional content without any performance hit.",
            keyPoints: ["Middleware runs before any route rendering.", "Edge runtime is ultra-lightweight.", "Rewrites happen internally (URL stays same).", "Perfect for A/B testing and localized SEO."],
            codeExample: "export function middleware(req) {\n  const country = req.geo?.country || 'US';\n  return NextResponse.rewrite(`/locale/${country}`);\n}",
            expectedOutput: "A user in Japan sees Japanese content at the base URL.",
            useCase: "Multinational corporate websites or region-locked deployments.",
            practiceTask: "Write a middleware that blocks traffic from a specific path."
          }
        ]
      },
      {
        id: "nx8",
        title: "Testing & Enterprise Guardrails",
        slug: "testing-deploy",
        description: "Ensuring stability with Vitest and Playwright.",
        lessons: [
          {
            id: "nxl8",
            title: "E2E Testing with Playwright",
            slug: "playwright-e2e",
            explanation: "Unit tests check logic, but End-to-End (E2E) tests check if the user can actually finish a task. Playwright simulates a real browser, clicking, typing, and verifying that your auth flow actually works in production.",
            keyPoints: ["Vitest for fast component testing.", "Playwright for cross-browser E2E flows.", "CI/CD integration prevents breaking builds.", "Bundle analysis for optimizing JS size."],
            codeExample: "test('login works', async ({ page }) {\n  await page.goto('/login');\n  await page.fill('#email', 'test@gxl.com');\n  await expect(page).toHaveURL('/dashboard');\n});",
            expectedOutput: "The test passes with a green report in GitHub Actions.",
            useCase: "Making sure the landing page 'Join' button never breaks.",
            practiceTask: "Write a simple test script to check if the homepage title is correct."
          }
        ]
      },
      {
        id: "nx9",
        title: "Capstone: NextSaaS Production",
        slug: "nextjs-capstone",
        description: "Deploying a complete SaaS platform to Vercel.",
        lessons: [
          {
            id: "nxl9",
            title: "Production CI/CD & Monitoring",
            slug: "production-deploy",
            explanation: "The final module covers the deployment pipeline. We use Vercel for hosting, implement Sentry for error tracking, and use the Google Search Console to verify our SEO results.",
            keyPoints: ["Environment variable management securely.", "Sentry for catching real-world user errors.", "SEO auditing with Lighthouse.", "Verifying your verifiable credential."],
            codeExample: "# Deploying via CLI\nnpx vercel --prod",
            expectedOutput: "A global, SSL-secured production URL for your dashboard.",
            useCase: "Launching a real-world startup product globally.",
            practiceTask: "Connect your GitHub repo to a Vercel deployment project."
          }
        ]
      }
    ],
    assessment: nextjsAssessment,
    finalProject: {
      title: "Enterprise SaaS Dashboard",
      description: "Build a complete SaaS platform dashboard with real-time stats, role-based access, and dark mode optimization.",
      requirements: [
        "Next.js 15 App Router",
        "Tailwind CSS + Shadcn UI",
        "Supabase Auth & Database",
        "Vercel Deployment"
      ]
    }
  },
  {
    id: "python-mastery",
    title: "Python Mastery: From Logic to Distributed Systems",
    slug: "python-mastery",
    description: "Master the most versatile language in engineering. From core syntax and advanced OOP to high-performance AsyncIO and production-grade FastAPI backends.",
    image: "/courses/python.jpg",
    difficulty: "Advanced",
    duration: "65 Hours",
    modules: [
      {
        id: "py1",
        title: "The Pythonic Way: Logic & Mechanics",
        slug: "python-logic",
        description: "Master the fundamental syntax and the internal mechanics of CPython.",
        lessons: [
          {
            id: "pyl1",
            title: "Internal Architecture of CPython",
            slug: "cpython-internals",
            explanation: "Python is more than just script; it runs on the CPython interpreter. Understanding how it converts code to bytecode and manages memory via reference counting is key to writing high-performance code. Modern Python 3.12 features improved error messages and faster execution loops.",
            keyPoints: ["Python is an interpreted, high-level language.", "CPython is the reference implementation.", "Automatic memory management via GC and Ref-counting.", "PEP 8 is the primary style guideline."],
            codeExample: "import sys\na = []\nprint(sys.getrefcount(a)) # Checking references in memory",
            expectedOutput: "An integer representing the current memory references.",
            useCase: "Debugging memory leaks in long-running data processing scripts.",
            practiceTask: "Check the reference count of its own name variable."
          }
        ]
      },
      {
        id: "py2",
        title: "Advanced Data Structures",
        slug: "python-ds",
        description: "Efficiently handling data with Lists, Sets, and Dictionaries.",
        lessons: [
          {
            id: "pyl2",
            title: "List Comprehensions & Slicing",
            slug: "comps-slicing",
            explanation: "Pythonic code uses comprehensions to transform data concisely. Slicing provides powerful ways to manipulate sequences without writing complex loops.",
            keyPoints: ["Comprehensions are faster than manual for-loops.", "Deep vs Shallow copy logic in Python objects.", "Tuple unpacking for clean multi-variable returns."],
            codeExample: "nums = [1, 2, 3, 4, 5]\nevens = [x**2 for x in nums if x % 2 == 0]\nprint(evens) # [4, 16]",
            expectedOutput: "[4, 16]",
            useCase: "Filtering massive datasets for specific user criteria.",
            practiceTask: "Create a dictionary comprehension mapping integers to their cubes."
          }
        ]
      },
      {
        id: "py3",
        title: "Functional & Meta Programming",
        slug: "meta-programming",
        description: "Higher-order functions, Lambdas, and Decorators.",
        lessons: [
          {
            id: "pyl3",
            title: "Decorators & Wrappers",
            slug: "decorators",
            explanation: "Decorators allow you to wrap functions to add behavior like logging, timing, or authentication without modifying the actual function logic.",
            keyPoints: ["Functions are first-class citizens in Python.", "Decorators are HOFs that take a function as input.", "Using functools.wraps to preserve metadata."],
            codeExample: "def logger(func):\n    def wrapper(*args, **kwargs):\n        print('Executing...')\n        return func(*args, **kwargs)\n    return wrapper",
            expectedOutput: "The execution status followed by the actual function result.",
            useCase: "Adding API rate-limiting or timing to a web service.",
            practiceTask: "Write a decorator that prints 'Task Started' before a function runs."
          }
        ]
      },
      {
        id: "py4",
        title: "Advanced OOP & MRO",
        slug: "python-oop",
        description: "Inheritance, Method Resolution Order, and Magic Methods.",
        lessons: [
          {
            id: "pyl4",
            title: "Magic Methods (__init__, __call__)",
            slug: "magic-methods",
            explanation: "Dunder (Double Under) methods allow your classes to hook into Python's built-in behaviors. __len__ makes your object countable, while __call__ makes it executable.",
            keyPoints: ["__init__ is the initializer, not the 'new' allocator.", "__str__ vs __repr__ for debugging.", "MRO handles multiple inheritance order."],
            codeExample: "class GXL:\n    def __call__(self):\n        return 'GrowX Labs Active'\n\napp = GXL()\nprint(app())",
            expectedOutput: "'GrowX Labs Active'",
            useCase: "Implementing custom API clients or data model wrappers.",
            practiceTask: "Implement a class where the '+' operator combines two strings internally."
          }
        ]
      },
      {
        id: "py5",
        title: "Context Managers & Resource logic",
        slug: "context-managers",
        description: "The 'with' statement and memory safety.",
        lessons: [
          {
            id: "pyl5",
            title: "The 'with' Statement",
            slug: "with-resource",
            explanation: "Context managers ensure resources like file handles or database connections are closed automatically, preventing resource exhaustion.",
            keyPoints: ["The 'with' statement handles setup and teardown.", "@contextmanager decorator for clean shorthand.", "Prevents file corruption during crashes."],
            codeExample: "with open('logs.txt', 'w') as f:\n    f.write('System clear')\n# File closes automatically here",
            expectedOutput: "A file written safely to the local disk.",
            useCase: "Safely writing to multi-GB log files during heavy processing.",
            practiceTask: "Use a context manager to open a file and read its first line."
          }
        ]
      },
      {
        id: "py6",
        title: "Concurrency: GIL, Threads & AsyncIO",
        slug: "concurrency",
        description: "True parallelism vs Cooperative Multitasking.",
        lessons: [
          {
            id: "pyl6",
            title: "AsyncIO Event Loop",
            slug: "async-io",
            explanation: "AsyncIO allows one thread to handle thousands of concurrent I/O connections by yielding control during waiting (cooperative multitasking). Essential for modern web backends.",
            keyPoints: ["GIL affects CPU-bound code, not I/O.", "async/await syntax for non-blocking code.", "Task groups for concurrent execution."],
            codeExample: "import asyncio\nasync def fetch_data():\n    await asyncio.sleep(1)\n    return 'Data Loaded'\n\nasyncio.run(fetch_data())",
            expectedOutput: "'Data Loaded' (after 1 second delay).",
            useCase: "Highly-scalable scrapers or real-time notification hubs.",
            practiceTask: "Run two async functions simultaneously using asyncio.gather."
          }
        ]
      },
      {
        id: "py7",
        title: "Modern Backend: FastAPI & Pydantic",
        slug: "fastapi-backend",
        description: "High-performance REST APIs with type safety.",
        lessons: [
          {
            id: "pyl7",
            title: "Schema Validation with Pydantic",
            slug: "pydantic-logic",
            explanation: "FastAPI uses Pydantic to ensure all incoming JSON data matches your expected types, providing automatic documentation and error handling.",
            keyPoints: ["FastAPI is native to AsyncIO.", "Pydantic models enforce runtime type safety.", "Auto-generated Swagger/OpenAPI docs."],
            codeExample: "from fastapi import FastAPI\nfrom pydantic import BaseModel\n\nclass User(BaseModel):\n    name: str\n    id: int",
            expectedOutput: "Automatic 422 error if 'id' is passed as a string.",
            useCase: "Building secure, self-documenting APIs for enterprise mobile apps.",
            practiceTask: "Define a FastAPI route that accepts a 'price' as an integer."
          }
        ]
      },
      {
        id: "py8",
        title: "Enterprise Testing & Stability",
        slug: "python-testing",
        description: "Pytest, Mypy, and Continuous Integration.",
        lessons: [
          {
            id: "pyl8",
            title: "Pytest & Mocking",
            slug: "pytest-mock",
            explanation: "Testing is non-negotiable. Pytest and Mocking allow you to isolate code and test logic without interacting with real databases or external APIs during CI.",
            keyPoints: ["Pytest fixtures for reusable setup.", "Mocking to simulate expensive network calls.", "Mypy for static type-checking in Python."],
            codeExample: "def test_logic():\n    assert 1 + 1 == 2",
            expectedOutput: "A 'Passed' status in the CLI test runner.",
            useCase: "Ensuring every commit in GXL project is stable before deploy.",
            practiceTask: "Create a simple test file and run it using the 'pytest' command."
          }
        ]
      },
      {
        id: "py9",
        title: "Capstone: Distributed Task Processor",
        slug: "python-capstone",
        description: "Building production systems at scale.",
        lessons: [
          {
            id: "pyl9",
            title: "Redis & Worker Pipelines",
            slug: "distributed-systems",
            explanation: "The final module covers scaling. You'll build a system where FastAPI receives requests and an background worker (Celery/RQ) processes heavy tasks independently.",
            keyPoints: ["Message brokers decouple requests from processing.", "Redis for fast, in-memory task queues.", "Deploying Python microservices via Docker."],
            codeExample: "# High-level architecture\nFastAPI -> Redis -> Python Worker",
            expectedOutput: "A high-concurrency system that never blocks the user UI.",
            useCase: "Processing high-resolution images or AI models in the background.",
            practiceTask: "Setup a local Redis instance and ping it using Python."
          }
        ]
      }
    ],
    assessment: pythonAssessment,
    finalProject: {
      title: "RecruitAI Distributed Processor",
      description: "Build a high-performance Python backend that processes hundreds of CVs in parallel using Redis queues and FastAPI.",
      requirements: [
        "FastAPI / Pydantic",
        "AsyncIO Logic",
        "Redis Task Queuing",
        "Pytest Coverage > 80%"
      ]
    }
  }
];

