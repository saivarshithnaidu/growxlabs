import { Question } from "@/types/courses";

export const javaAssessment: Question[] = [
  // EASY (15 Questions)
  {
    id: "j_e1",
    type: "mcq",
    difficulty: "easy",
    text: "What does JVM stand for?",
    options: ["Java Variable Mechanism", "Java Virtual Machine", "Java Void Main", "Just Virtual Machine"],
    correctOptionIndex: 1,
    explanation: "JVM stands for Java Virtual Machine, which acts as a run-time engine to run Java applications."
  },
  {
    id: "j_e2",
    type: "mcq",
    difficulty: "easy",
    text: "Which of the following is not a Java feature?",
    options: ["Dynamic", "Architecture Neutral", "Use of pointers", "Object-oriented"],
    correctOptionIndex: 2,
    explanation: "Java does not support pointers directly at the user level for security reasons."
  },
  {
    id: "j_e3",
    type: "mcq",
    difficulty: "easy",
    text: "What is the size of an int variable in Java?",
    options: ["8 bit", "16 bit", "32 bit", "64 bit"],
    correctOptionIndex: 2,
    explanation: "An int is a 32-bit signed two's complement integer."
  },
  {
    id: "j_e4",
    type: "code_output",
    difficulty: "easy",
    text: "What is the output of the following code?",
    codeSnippet: "int a = 10;\nSystem.out.println(a++);",
    options: ["10", "11", "Compilation Error", "0"],
    correctOptionIndex: 0,
    explanation: "The post-increment operator prints the current value of 'a' before incrementing it."
  },
  {
    id: "j_e5",
    type: "mcq",
    difficulty: "easy",
    text: "Which keyword is used to refer to the current object in Java?",
    options: ["super", "this", "current", "self"],
    correctOptionIndex: 1,
    explanation: "The 'this' keyword refers to the current instance of the class."
  },
  {
    id: "j_e6",
    type: "mcq",
    difficulty: "easy",
    text: "What is the default value of a boolean variable?",
    options: ["true", "false", "null", "undefined"],
    correctOptionIndex: 1,
    explanation: "By default, boolean variables are initialized to false in Java."
  },
  {
    id: "j_e7",
    type: "scenario",
    difficulty: "easy",
    text: "You want a class that cannot be extended. Which keyword do you use?",
    options: ["static", "const", "final", "abstract"],
    correctOptionIndex: 2,
    explanation: "Declaring a class as 'final' prevents other classes from inheriting from it."
  },
  {
    id: "j_e8",
    type: "mcq",
    difficulty: "easy",
    text: "Which collection allows duplicate elements?",
    options: ["Set", "List", "Map", "Dictionary"],
    correctOptionIndex: 1,
    explanation: "The List interface allows duplicate elements, unlike Sets."
  },
  {
    id: "j_e9",
    type: "mcq",
    difficulty: "easy",
    text: "Which is the highest-level class of exception hierarchy?",
    options: ["Error", "Exception", "Throwable", "RuntimeException"],
    correctOptionIndex: 2,
    explanation: "java.lang.Throwable is the root class for all errors and exceptions in Java."
  },
  {
    id: "j_e10",
    type: "bug",
    difficulty: "easy",
    text: "Identify the reason why this array initialization fails:",
    codeSnippet: "int[] nums = new int[];",
    options: ["Type mismatch", "Size is not specified", "Cannot use 'new'", "Syntax is perfect"],
    correctOptionIndex: 1,
    explanation: "When instantiating an array, the size must be explicitly provided if not directly initializing values."
  },
  {
    id: "j_e11",
    type: "mcq",
    difficulty: "easy",
    text: "Which block executes whether an exception is handled or not?",
    options: ["try", "catch", "finally", "throw"],
    correctOptionIndex: 2,
    explanation: "The finally block is used to execute crucial tasks regardless of whether an exception occurs."
  },
  {
    id: "j_e12",
    type: "mcq",
    difficulty: "easy",
    text: "What is the method signature of the `main()` method?",
    options: ["public void main(String args[])", "public static void main(String[] args)", "static void main(String args)", "public static int main(String[] args)"],
    correctOptionIndex: 1,
    explanation: "The standard entry point in Java must be public, static, returning void, and taking a String array."
  },
  {
    id: "j_e13",
    type: "mcq",
    difficulty: "easy",
    text: "Which OOP concept is achieved by placing classes in packages?",
    options: ["Polymorphism", "Inheritance", "Encapsulation", "Abstraction"],
    correctOptionIndex: 2,
    explanation: "Packages restrict access to internal classes, which is a key part of Encapsulation."
  },
  {
    id: "j_e14",
    type: "mcq",
    difficulty: "easy",
    text: "Which interface does `ArrayList` implement?",
    options: ["Set", "List", "Queue", "Map"],
    correctOptionIndex: 1,
    explanation: "ArrayList provides a resizable-array implementation of the List interface."
  },
  {
    id: "j_e15",
    type: "fix",
    difficulty: "easy",
    text: "How do you fix this string comparison?",
    codeSnippet: "if (str1 == str2) {}",
    options: ["if (str1.equals(str2)) {}", "if (str1 === str2) {}", "if (str1.compare(str2)) {}", "if (str1=str2) {}"],
    correctOptionIndex: 0,
    explanation: "In Java, '==' compares object references. The '.equals()' method compares the actual content."
  },

  // MEDIUM (20 Questions)
  {
    id: "j_m1",
    type: "code_output",
    difficulty: "medium",
    text: "What is the output of the following?",
    codeSnippet: "String a = new String(\"GrowX\");\nString b = new String(\"GrowX\");\nSystem.out.println(a == b);",
    options: ["true", "false", "Compilation Error", "Runtime Error"],
    correctOptionIndex: 1,
    explanation: "The 'new' keyword creates a new object in the heap. Therefore, their reference addresses differ."
  },
  {
    id: "j_m2",
    type: "multi_select",
    difficulty: "medium",
    text: "Which modifiers can be used for a constructor? (Select all that apply)",
    options: ["public", "private", "abstract", "static"],
    correctOptionIndices: [0, 1],
    explanation: "Constructors can be public, private, protected, or default. They cannot be abstract or static."
  },
  {
    id: "j_m3",
    type: "bug",
    difficulty: "medium",
    text: "Why will this code not compile?",
    codeSnippet: "abstract class Animal { abstract void walk(); }\nclass Dog extends Animal {}",
    options: ["Dog must abstract", "Dog must implement walk()", "Animal cannot have abstract methods", "None of the above"],
    correctOptionIndex: 1,
    explanation: "A concrete class extending an abstract class must provide implementations for all inherited abstract methods."
  },
  {
    id: "j_m4",
    type: "scenario",
    difficulty: "medium",
    text: "You are designing a database configuration class. You want to ensure only ONE instance is ever created. What pattern do you use?",
    options: ["Factory", "Observer", "Singleton", "Builder"],
    correctOptionIndex: 2,
    explanation: "The Singleton design pattern ensures exactly one instance of a class is created and provides a global point of access to it."
  },
  {
    id: "j_m5",
    type: "code_output",
    difficulty: "medium",
    text: "What is the result of this operation?",
    codeSnippet: "ArrayList<Integer> list = new ArrayList<>();\nlist.add(1);\nlist.remove(1);",
    options: ["The list is empty", "IndexOutOfBoundsException", "Compilation error", "NullPointerException"],
    correctOptionIndex: 1,
    explanation: "The remove(int index) targets the 1st index (second element). Since the list only has an element at index 0, it throws IndexOutOfBoundsException."
  },
  {
    id: "j_m6",
    type: "mcq",
    difficulty: "medium",
    text: "Which of these is a thread-safe data structure?",
    options: ["HashMap", "ArrayList", "Vector", "LinkedList"],
    correctOptionIndex: 2,
    explanation: "Vector is synchronized internally, meaning it is thread-safe compared to ArrayList."
  },
  {
    id: "j_m7",
    type: "mcq",
    difficulty: "medium",
    text: "What is the purpose of the `volatile` modifier?",
    options: ["To prevent variable updates", "To force reading from main memory instead of CPU cache", "To create a constant", "To lock the variable for SQL writes"],
    correctOptionIndex: 1,
    explanation: "Volatile flags a variable so threads read it directly from the main memory, preventing caching inconsistencies in multithreading."
  },
  {
    id: "j_m8",
    type: "scenario",
    difficulty: "medium",
    text: "If you need rapid O(1) searches based on a unique key, which collection should you use?",
    options: ["ArrayList", "LinkedList", "HashMap", "TreeSet"],
    correctOptionIndex: 2,
    explanation: "HashMap uses hashing to achieve constant time O(1) complexity for basic get/put operations."
  },
  {
    id: "j_m9",
    type: "fix",
    difficulty: "medium",
    text: "Fix the syntax for starting a new Thread execution:",
    codeSnippet: "Thread t = new Thread(new RunnableTask());\n// How to start?",
    options: ["t.run()", "t.start()", "t.execute()", "t.begin()"],
    correctOptionIndex: 1,
    explanation: "Calling t.start() spawns a new call stack. Calling t.run() just acts like a normal method call."
  },
  {
    id: "j_m10",
    type: "mcq",
    difficulty: "medium",
    text: "In JDBC, what is `PreparedStatement` used for?",
    options: ["Compiling SQL dynamically", "Executing stored procedures", "Preventing SQL Injection", "Connecting to multiple DBs at once"],
    correctOptionIndex: 2,
    explanation: "PreparedStatements pre-compile SQL queries and bind parameterized data, severely restricting SQL Injection attacks."
  },
  {
    id: "j_m11",
    type: "mcq",
    difficulty: "medium",
    text: "How does Spring Boot simplify Dependency Injection?",
    options: ["By using XML strictly", "By using @Autowired to inject Beans automatically", "By defining its own classpaths", "By ignoring the JVM"],
    correctOptionIndex: 1,
    explanation: "Spring reads annotations like @Autowired to automatically resolve and inject instance dependencies into your objects."
  },
  {
    id: "j_m12",
    type: "multi_select",
    difficulty: "medium",
    text: "Which of the following annotations belong to Spring MVC? (Select all that apply)",
    options: ["@RestController", "@Entity", "@GetMapping", "@Table"],
    correctOptionIndices: [0, 2],
    explanation: "@RestController and @GetMapping are Spring MVC annotations. @Entity and @Table belong to JPA."
  },
  {
    id: "j_m13",
    type: "code_output",
    difficulty: "medium",
    text: "What exception is thrown here?",
    codeSnippet: "String[] arr = new String[2];\nSystem.out.println(arr[0].length());",
    options: ["ArrayIndexOutOfBoundsException", "IllegalArgumentException", "NullPointerException", "No Exception"],
    correctOptionIndex: 2,
    explanation: "An array of objects is initialized with null elements. Accessing `.length()` on null throws NullPointerException."
  },
  {
    id: "j_m14",
    type: "mcq",
    difficulty: "medium",
    text: "What does `System.gc()` do?",
    options: ["Forces garbage collection instantly", "Suggests to the JVM to run the garbage collector", "Clears the cache", "Reboots the JVM application"],
    correctOptionIndex: 1,
    explanation: "System.gc() only \"suggests\" execution. The JVM evaluates memory requirements and decides whether it will actually execute."
  },
  {
    id: "j_m15",
    type: "mcq",
    difficulty: "medium",
    text: "Which functional interface accepts an argument but returns no result?",
    options: ["Supplier", "Function", "Predicate", "Consumer"],
    correctOptionIndex: 3,
    explanation: "The Consumer interface has a single method accept(T t) which returns void."
  },
  {
    id: "j_m16",
    type: "scenario",
    difficulty: "medium",
    text: "You are reading a very large 10GB text file. Which IO class is the most memory efficient?",
    options: ["FileInputStream", "BufferedReader", "Scanner", "StringReader"],
    correctOptionIndex: 1,
    explanation: "BufferedReader reads text by buffering characters, making it highly efficient for reading large streams sequentially without crashing memory."
  },
  {
    id: "j_m17",
    type: "multi_select",
    difficulty: "medium",
    text: "Which blocks are mandatory immediately following a `try` block? (Select valid continuations)",
    options: ["catch only", "finally only", "else", "Both catch or finally"],
    correctOptionIndices: [0, 1, 3],
    explanation: "A try block must be followed by at least one catch block OR a finally block."
  },
  {
    id: "j_m18",
    type: "code_output",
    difficulty: "medium",
    text: "Given default integer variables, what is `10 / 3`?",
    options: ["3.33", "3", "3.0", "Compiler Error"],
    correctOptionIndex: 1,
    explanation: "Integer division truncates the decimal portion, resulting in 3."
  },
  {
    id: "j_m19",
    type: "bug",
    difficulty: "medium",
    text: "What is wrong with this map insertion?",
    codeSnippet: "Map<int, String> map = new HashMap<>();\nmap.put(1, \"One\");",
    options: ["Missing generic types on the right", "Generics do not support primitive types", "HashMap must be initialized with a size", "Nothing is wrong"],
    correctOptionIndex: 1,
    explanation: "Java Generics only support Object types. 'int' must be replaced with the wrapper class 'Integer'."
  },
  {
    id: "j_m20",
    type: "mcq",
    difficulty: "medium",
    text: "What happens when a `RuntimeException` is thrown and not caught?",
    options: ["The thread terminates directly", "The JVM ignores it", "It is logged automatically", "The compiler issues a warning"],
    correctOptionIndex: 0,
    explanation: "Uncaught exceptions propagate up the stack. If they reach the top without being caught, the active thread terminates."
  },

  // HARD (15 Questions)
  {
    id: "j_h1",
    type: "code_output",
    difficulty: "hard",
    text: "What executes first?",
    codeSnippet: "class T {\n  static { System.out.print(\"A\"); }\n  T() { System.out.print(\"B\"); }\n  { System.out.print(\"C\"); }\n}\npublic class Main {\n  public static void main(String[] args) {\n    new T();\n  }\n}",
    options: ["A B C", "A C B", "B C A", "C B A"],
    correctOptionIndex: 1,
    explanation: "Execution order: Static blocks (once on load) -> Instance initialization blocks -> Constructors. Output is ACB."
  },
  {
    id: "j_h2",
    type: "bug",
    difficulty: "hard",
    text: "Identify the critical flaw in this Thread logic:",
    codeSnippet: "public class Counter {\n  private int count = 0;\n  public void increment() { count++; }\n}",
    options: ["count++ is not an atomic operation, causing race conditions.", "Variables must be declared static.", "Methods cannot mutate class variables.", "No flaw."],
    correctOptionIndex: 0,
    explanation: "count++ consists of three actions (read, modify, wrap). In multithreading, this leads to race conditions. It should be synchronized or use AtomicInteger."
  },
  {
    id: "j_h3",
    type: "scenario",
    difficulty: "hard",
    text: "You are building a high-frequency trading application. Which collection guarantees predictable iteration order matching the insertion sequence?",
    options: ["HashMap", "ConcurrentHashMap", "LinkedHashMap", "TreeMap"],
    correctOptionIndex: 2,
    explanation: "LinkedHashMap maintains a doubly-linked list running through all its entries tracking the insertion order."
  },
  {
    id: "j_h4",
    type: "mcq",
    difficulty: "hard",
    text: "What is 'Type Erasure' in Java?",
    options: ["The garbage collector clearing memories of dead types", "Compiler replacing generic type parameters with bounds or Object at compile time", "A runtime error when types don't match", "The process of casting interfaces"],
    correctOptionIndex: 1,
    explanation: "The Java compiler enforces type constraints at compile time, then deletes (erases) the generic type information in the bytecode."
  },
  {
    id: "j_h5",
    type: "fix",
    difficulty: "hard",
    text: "How do you properly roll back a JPA transaction programmatically upon catching an exception?",
    codeSnippet: "try { entityManager.persist(user); } catch (Exception e) {\n // Logic \n}",
    options: ["entityManager.close()", "TransactionAspectSupport.currentTransactionStatus().setRollbackOnly()", "entityManager.flush()", "throw new TransactionException()"],
    correctOptionIndex: 1,
    explanation: "In declarative Spring environments, throwing a runtime exception naturally rolls back. Programmatically, you flag it to Spring using TransactionAspectSupport."
  },
  {
    id: "j_h6",
    type: "multi_select",
    difficulty: "hard",
    text: "Which principles belong to the ACID transaction model? (Select all that apply)",
    options: ["Atomicity", "Concurrency", "Isolation", "Durability"],
    correctOptionIndices: [0, 2, 3],
    explanation: "ACID stands for Atomicity, Consistency, Isolation, and Durability."
  },
  {
    id: "j_h7",
    type: "code_output",
    difficulty: "hard",
    text: "What is returned?",
    codeSnippet: "try {\n  return 1;\n} finally {\n  return 2;\n}",
    options: ["1", "2", "Compilation error", "Throws exception"],
    correctOptionIndex: 1,
    explanation: "The finally block acts as the ultimate authority on method exit logic. Its return overrides any previous return statements in the try/catch."
  },
  {
    id: "j_h8",
    type: "multi_select",
    difficulty: "hard",
    text: "In Java 8, which methods can an interface have?",
    options: ["Abstract methods", "Default methods", "Static methods", "Final methods"],
    correctOptionIndices: [0, 1, 2],
    explanation: "Java 8 introduced default and static implementations in interfaces. Final methods are explicitly not allowed."
  },
  {
    id: "j_h9",
    type: "bug",
    difficulty: "hard",
    text: "Why is a memory leak occurring in this Caching class?",
    codeSnippet: "class Cache {\n  private Map<Object, Object> store = new HashMap<>();\n  public void add(Object key, Object value) { store.put(key, value); }\n}",
    options: ["Using HashMap limits scalability", "Old unused objects are globally referenced and never garbage collected", "Key and value must be primitives", "No leak occurs"],
    correctOptionIndex: 1,
    explanation: "Because the objects are permanently strongly referenced by the internal HashMap, the GC will never clear them. A WeakHashMap should be used."
  },
  {
    id: "j_h10",
    type: "scenario",
    difficulty: "hard",
    text: "A Spring Boot backend is failing to process a valid JWT from the frontend. The signature is valid. What is the most likely cause?",
    options: ["JSON Parse failure", "CORS policy blocking preflight", "Token Expiration", "Missing SSL certificate"],
    correctOptionIndex: 2,
    explanation: "If a token is structurally valid and the signature holds, the JWT security context checks claims—such as the 'exp' (expiration) field, dropping expired requests immediately."
  },
  {
    id: "j_h11",
    type: "mcq",
    difficulty: "hard",
    text: "Which JVM area throws a StackOverflowError?",
    options: ["Method Area", "Heap", "PC Register", "JVM Stack"],
    correctOptionIndex: 3,
    explanation: "A StackOverflowError is exclusively triggered when the JVM Stack has no more depth to allocate a new method frame (usually via infinite recursion)."
  },
  {
    id: "j_h12",
    type: "fix",
    difficulty: "hard",
    text: "Fix this Stream API code to sum all numbers:",
    codeSnippet: "List<Integer> list = Arrays.asList(1, 2, 3);\nint result = list.stream(). _____;",
    options: ["mapToInt(Integer::intValue).sum()", "sum()", "collect(Collectors.sum())", "reduce(0, (a, b) -> a + b)"],
    correctOptionIndices: [0, 3],
    correctOptionIndex: 0, // Fallback for single strict select logic
    explanation: "You can map it to an IntStream and call sum(), OR use reduce(). Both mapToInt.sum() and reduce are correct."
  },
  {
    id: "j_h13",
    type: "code_output",
    difficulty: "hard",
    text: "What prints here?",
    codeSnippet: "Integer a = 127; Integer b = 127;\nInteger c = 128; Integer d = 128;\nSystem.out.println((a==b) + \" \" + (c==d));",
    options: ["true true", "false false", "true false", "false true"],
    correctOptionIndex: 2,
    explanation: "JVM automatically caches Integer objects from -128 to 127. So 'a' and 'b' point to the same object. But 128 instantiates unique objects."
  },
  {
    id: "j_h14",
    type: "mcq",
    difficulty: "hard",
    text: "In JPA, what is the 'N+1 Select' problem?",
    options: ["When N rows inserted equals 1 timeout", "Running N dependent queries lazily instead of 1 JOINed query", "Hibernate cache missing keys", "None"],
    correctOptionIndex: 1,
    explanation: "N+1 happens when an ORM executes 1 query to fetch a parent entity list, and then N separate queries to fetch their children, decimating performance."
  },
  {
    id: "j_h15",
    type: "mcq",
    difficulty: "hard",
    text: "Which class acts as the Central Dispatcher in Spring MVC?",
    options: ["ApplicationContext", "RestController", "DispatcherServlet", "HttpServlet"],
    correctOptionIndex: 2,
    explanation: "The DispatcherServlet acts as the Front Controller, routing incoming HTTP requests to their appropriate handlers."
  }
];
