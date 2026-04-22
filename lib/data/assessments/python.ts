import { Question } from "@/types/courses";

export const pythonAssessment: Question[] = [
  // EASY (15 Questions)
  {
    id: "p_e1",
    type: "mcq",
    difficulty: "easy",
    text: "What is the correct way to create a function in Python?",
    options: ["function my_func():", "def my_func():", "void my_func()", "create my_func()"],
    correctOptionIndex: 1,
    explanation: "The 'def' keyword is used to define functions in Python."
  },
  {
    id: "p_e2",
    type: "mcq",
    difficulty: "easy",
    text: "Which of these is used for multi-line comments in Python?",
    options: ["//", "/* */", "''' (Triple quotes)", "##"],
    correctOptionIndex: 2,
    explanation: "Triple quotes (single or double) are used for multi-line strings or docstrings, which act as comments."
  },
  {
    id: "p_e3",
    type: "mcq",
    difficulty: "easy",
    text: "How do you start a for loop in Python?",
    options: ["for x in y:", "for(x=0; x<10; x++)", "for each x in y", "loop x in y"],
    correctOptionIndex: 0,
    explanation: "Python uses the 'for...in' syntax to iterate over sequences."
  },
  {
    id: "p_e4",
    type: "mcq",
    difficulty: "easy",
    text: "Which data type is immutable?",
    options: ["List", "Dictionary", "Set", "Tuple"],
    correctOptionIndex: 3,
    explanation: "Tuples are immutable sequences, meaning their elements cannot be changed after creation."
  },
  {
    id: "p_e5",
    type: "code_output",
    difficulty: "easy",
    text: "What is the output of print(2**3)?",
    options: ["6", "8", "9", "Error"],
    correctOptionIndex: 1,
    explanation: "The '**' operator is used for exponentiation in Python."
  },
  {
    id: "p_e6",
    type: "mcq",
    difficulty: "easy",
    text: "Which method is used to remove whitespace from both ends of a string?",
    options: ["strip()", "trim()", "cut()", "remove()"],
    correctOptionIndex: 0,
    explanation: "strip() removes leading and trailing whitespace from a string."
  },
  {
    id: "p_e7",
    type: "mcq",
    difficulty: "easy",
    text: "What is the result of bool([])?",
    options: ["True", "False", "None", "Error"],
    correctOptionIndex: 1,
    explanation: "Empty sequences (lists, tuples, strings) evaluate to False in a boolean context."
  },
  {
    id: "p_e8",
    type: "mcq",
    difficulty: "easy",
    text: "How do you insert an item at a specific index in a list?",
    options: ["list.add(idx, item)", "list.put(idx, item)", "list.insert(idx, item)", "list.push(item)"],
    correctOptionIndex: 2,
    explanation: "insert(index, element) allows placing an item anywhere in a list."
  },
  {
    id: "p_e9",
    type: "mcq",
    difficulty: "easy",
    text: "Which keyword is used to handle exceptions?",
    options: ["catch", "except", "error", "handle"],
    correctOptionIndex: 1,
    explanation: "Python uses 'try...except' blocks for error handling."
  },
  {
    id: "p_e10",
    type: "mcq",
    difficulty: "easy",
    text: "What does the 'pass' statement do?",
    options: ["Ends the program", "Skips a loop", "Does nothing (null operation)", "Throws an error"],
    correctOptionIndex: 2,
    explanation: "The 'pass' statement is a placeholder used where code is syntactically required but no action is needed."
  },
  {
    id: "p_e11",
    type: "mcq",
    difficulty: "easy",
    text: "How do you check the type of a variable?",
    options: ["typeof(a)", "type(a)", "check(a)", "a.type()"],
    correctOptionIndex: 1,
    explanation: "The built-in type() function returns the class/type of an object."
  },
  {
    id: "p_e12",
    type: "mcq",
    difficulty: "easy",
    text: "Which of these is the correct way to handle a file in Python?",
    options: ["file = open('t.txt')", "with open('t.txt') as f:", "open 't.txt' into f", "f = read('t.txt')"],
    correctOptionIndex: 1,
    explanation: "The 'with' statement ensures proper closing of the file even if an exception occurs (Context Manager)."
  },
  {
    id: "p_e13",
    type: "mcq",
    difficulty: "easy",
    text: "What is the index of the first element in a Python list?",
    options: ["1", "0", "-1", "Any"],
    correctOptionIndex: 1,
    explanation: "Python uses 0-based indexing for all sequences."
  },
  {
    id: "p_e14",
    type: "code_output",
    difficulty: "easy",
    text: "Output of: print('GXL' * 2)?",
    options: ["GXL2", "GXL GXL", "GXLGXL", "Error"],
    correctOptionIndex: 2,
    explanation: "Multiplying a string by an integer repeats it that many times."
  },
  {
    id: "p_e15",
    type: "mcq",
    difficulty: "easy",
    text: "Which built-in function returns the length of an object?",
    options: ["length()", "size()", "count()", "len()"],
    correctOptionIndex: 3,
    explanation: "len() is the standard function for checking the size of sequences and collections."
  },

  // MEDIUM (20 Questions)
  {
    id: "p_m1",
    type: "code_output",
    difficulty: "medium",
    text: "What is the output of this list comprehension?",
    codeSnippet: "nums = [1, 2, 3]\nres = [x*2 for x in nums if x > 1]\nprint(res)",
    options: ["[2, 4, 6]", "[4, 6]", "[1, 2]", "Error"],
    correctOptionIndex: 1,
    explanation: "The filter 'x > 1' selects 2 and 3, then they are multiplied by 2 result in [4, 6]."
  },
  {
    id: "p_m2",
    type: "multi_select",
    difficulty: "medium",
    text: "Which of these are valid dictionary creation methods? (Select all)",
    options: ["{'a': 1}", "dict(a=1)", "dict([('a', 1)])", "{a: 1}"],
    correctOptionIndices: [0, 1, 2],
    explanation: "Quotes are needed for keys in literal syntax, but not in keyword arguments to dict()."
  },
  {
    id: "p_m3",
    type: "bug",
    difficulty: "medium",
    text: "Identify the bug in this function definition:",
    codeSnippet: "def add_to_list(val, my_list=[]):\n    my_list.append(val)\n    return my_list",
    options: ["Cannot use default arguments", "Mutable default arguments persist across calls", "val must be a string", "Missing return type"],
    correctOptionIndex: 1,
    explanation: "In Python, default arguments are evaluated only once at definition. Using [] as a default will share the same list across all calls."
  },
  {
    id: "p_m4",
    type: "scenario",
    difficulty: "medium",
    text: "You want a function that can accept ANY number of keyword arguments. Which syntax do you use?",
    options: ["*args", "**kwargs", "*kwargs", "all_args"],
    correctOptionIndex: 1,
    explanation: "**kwargs packs keyword arguments into a dictionary."
  },
  {
    id: "p_m5",
    type: "mcq",
    difficulty: "medium",
    text: "What is a 'decorator' in Python?",
    options: ["A function that modifies another function", "A way to color text", "A tool for UI design", "A class attribute"],
    correctOptionIndex: 0,
    explanation: "Decorators are HOFs (Higher Order Functions) that wrap and extend the behavior of other functions."
  },
  {
    id: "p_m6",
    type: "code_output",
    difficulty: "medium",
    text: "What prints here?",
    codeSnippet: "a = [1, 2, 3]\nb = a\nb.append(4)\nprint(len(a))",
    options: ["3", "4", "Error", "None"],
    correctOptionIndex: 1,
    explanation: "Lists are objects passed by reference. Modifying 'b' also modifies 'a' since they point to the same memory location."
  },
  {
    id: "p_m7",
    type: "mcq",
    difficulty: "medium",
    text: "What does the '@property' decorator do?",
    options: ["Makes a method behave like a static variable", "Makes a method behave like a read-only attribute", "Deactivates a method", "Encrypts a method"],
    correctOptionIndex: 1,
    explanation: "@property allows calling a method without parentheses, treating it as a property."
  },
  {
    id: "p_m8",
    type: "mcq",
    difficulty: "medium",
    text: "What is the difference between '==' and 'is'?",
    options: ["No difference", "'==' checks value, 'is' checks object identity (memory ID)", "'is' checks value, '==' checks identity", "Both check value"],
    correctOptionIndex: 1,
    explanation: "'==' checks if values are equal. 'is' checks if both variables refer to the exact same object in RAM."
  },
  {
    id: "p_m9",
    type: "fix",
    difficulty: "medium",
    text: "How do you correctly handle multiple exceptions in one block?",
    options: ["except Exception1, Exception2:", "except (Exception1, Exception2):", "except Exception1 or Exception2:", "except [Exception1, Exception2]:"],
    correctOptionIndex: 1,
    explanation: "Multiple exceptions must be passed as a tuple to the except clause."
  },
  {
    id: "p_m10",
    type: "mcq",
    difficulty: "medium",
    text: "Which module is used for processing JSON data in Python?",
    options: ["json_obj", "json", "parse_json", "jsons"],
    correctOptionIndex: 1,
    explanation: "The built-in 'json' module provides methods for parsing and serializing JSON."
  },
  {
    id: "p_m11",
    type: "mcq",
    difficulty: "medium",
    text: "What is a 'lambda' function?",
    options: ["A slow function", "An anonymous, one-line function", "A function in math module", "A function that can't return"],
    correctOptionIndex: 1,
    explanation: "Lambdas are small anonymous functions defined with the 'lambda' keyword."
  },
  {
    id: "p_m12",
    type: "multi_select",
    difficulty: "medium",
    text: "Which of these are valid set operations? (Select all)",
    options: ["intersection()", "union()", "append()", "difference()"],
    correctOptionIndices: [0, 1, 3],
    explanation: "Sets do not have an append() method as they are unordered; they use add() instead."
  },
  {
    id: "p_m13",
    type: "code_output",
    difficulty: "medium",
    text: "What is the result of 'abc'[::-1]?",
    options: ["abc", "cba", "a", "Error"],
    correctOptionIndex: 1,
    explanation: "Slicing with a step of -1 reverses the string."
  },
  {
    id: "p_m14",
    type: "mcq",
    difficulty: "medium",
    text: "What is the purpose of the '__init__' method?",
    options: ["Initializes the class when imported", "The constructor method to initialize object state", "Executes once when file runs", "Deletes the object"],
    correctOptionIndex: 1,
    explanation: "__init__ is the initializer called when a new instance of a class is created."
  },
  {
    id: "p_m15",
    type: "mcq",
    difficulty: "medium",
    text: "What is 'Pep 8'?",
    options: ["A Python library", "A style guide for Python code", "A performance tool", "An encryption algorithm"],
    correctOptionIndex: 1,
    explanation: "PEP 8 is the official style guide for writing clean, readable Python code."
  },
  {
    id: "p_m16",
    type: "scenario",
    difficulty: "medium",
    text: "You need a data structure that keeps the elements in sorted order automatically. Which one fits best?",
    options: ["List + sort() each time", "Set", "heapq module (priority queue)", "Dictionary"],
    correctOptionIndex: 2,
    explanation: "heapq provides an implementation of the min-heap algorithm, ideal for maintaining sorted properties efficiently."
  },
  {
    id: "p_m17",
    type: "multi_select",
    difficulty: "medium",
    text: "Which descriptors allow a variable to be accessed from inner functions? (Select all)",
    options: ["global", "nonlocal", "inner", "outer"],
    correctOptionIndices: [0, 1],
    explanation: "'global' targets module-level variables. 'nonlocal' targets variables in the nearest enclosing scope."
  },
  {
    id: "p_m18",
    type: "code_output",
    difficulty: "medium",
    text: "Value of: round(0.5) - round(-0.5)?",
    options: ["1.0", "0", "1", "Error"],
    correctOptionIndex: 1,
    explanation: "In Python 3, round() use 'round half to even' (banker's rounding). round(0.5) is 0 and round(-0.5) is 0."
  },
  {
    id: "p_m19",
    type: "bug",
    difficulty: "medium",
    text: "Why will this dictionary access crash?",
    codeSnippet: "d = {'id': 1}\nval = d['name']",
    options: ["Syntax error", "KeyError: 'name' is not in dictionary", "Type error", "Dictionary is empty"],
    correctOptionIndex: 1,
    explanation: "Accessing a non-existent key with bracket notation throws a KeyError."
  },
  {
    id: "p_m20",
    type: "mcq",
    difficulty: "medium",
    text: "What does 'super()' do?",
    options: ["Gives admin access", "Calls the parent class method", "Stops the program", "Initializes variables"],
    correctOptionIndex: 1,
    explanation: "super() returns a temporary object of the superclass, allowing you to call its methods."
  },

  // HARD (15 Questions)
  {
    id: "p_h1",
    type: "code_output",
    difficulty: "hard",
    text: "What is the output?",
    codeSnippet: "def f(a, b=[]):\n    b.append(a)\n    return b\n\nprint(f(1), f(2))",
    options: ["[1] [2]", "[1, 2] [1, 2]", "[1] [1, 2]", "Error"],
    correctOptionIndex: 1,
    explanation: "The default list 'b' is shared between calls. Note: The print statement evaluates both calls and prints the modified shared list twice."
  },
  {
    id: "p_h2",
    type: "bug",
    difficulty: "hard",
    text: "Why is 'threading' slow for CPU-bound tasks in Python?",
    options: ["Memory leaks", "The GIL (Global Interpreter Lock)", "Python is slow at math", "Context switching is expensive"],
    correctOptionIndex: 1,
    explanation: "The GIL prevents multiple native threads from executing Python bytecodes at once, limiting true parallel execution of CPU tasks."
  },
  {
    id: "p_h3",
    type: "scenario",
    difficulty: "hard",
    text: "You are building a high-performance web scraper. Which module allows you to handle thousands of concurrent network connections efficiently?",
    options: ["threading", "multiprocessing", "asyncio", "socket"],
    correctOptionIndex: 2,
    explanation: "asyncio uses cooperative multitasking (event loop), which is much more lightweight for I/O-bound tasks than threads."
  },
  {
    id: "p_h4",
    type: "mcq",
    difficulty: "hard",
    text: "What is a 'Metaclass'?",
    options: ["A very large class", "A class that defines how other classes behave (class of a class)", "A class with multiple inheritance", "None of the above"],
    correctOptionIndex: 1,
    explanation: "Metaclasses are the factories that create classes. 'type' is the default metaclass in Python."
  },
  {
    id: "p_h5",
    type: "fix",
    difficulty: "hard",
    text: "How do you implement a 'Singleton' pattern in Python using a metaclass?",
    options: ["Using __init__", "Overriding __call__ in the metaclass", "Using global variables", "Using @staticmethod"],
    correctOptionIndex: 1,
    explanation: "Overriding __call__ in a metaclass allows controlling the instantiation process of a class."
  },
  {
    id: "p_h6",
    type: "multi_select",
    difficulty: "hard",
    text: "Which of these are 'MRO' (Method Resolution Order) rules in Python? (Select all)",
    options: ["C3 Linearization", "Depth-first, then Left-to-right", "Breadth-first", "Top-down approach"],
    correctOptionIndices: [0, 1],
    explanation: "Python 3 uses the C3 Linearization algorithm to determine method resolution order."
  },
  {
    id: "p_h7",
    type: "code_output",
    difficulty: "hard",
    text: "What prints here?",
    codeSnippet: "x = 1\ndef f():\n    print(x)\n    x = 2\nf()",
    options: ["1", "2", "UnboundLocalError", "Error during definition"],
    correctOptionIndex: 2,
    explanation: "If you assign to a variable anywhere in a function, Python treats it as local. Accessing it before assignment causes UnboundLocalError."
  },
  {
    id: "p_h8",
    type: "multi_select",
    difficulty: "hard",
    text: "What features were introduced or improved in Python 3.12? (Select all)",
    options: ["F-string parsing improvements", "Per-interpreter GIL", "Type statement (for generics)", "Wait keyword"],
    correctOptionIndices: [0, 1, 2],
    explanation: "Python 3.12 improved f-strings, introduced per-interpreter GIL for better concurrency, and simplified generic types."
  },
  {
    id: "p_h9",
    type: "bug",
    difficulty: "hard",
    text: "Why is using 'json.loads()' on untrusted data dangerous?",
    options: ["It can execute code", "It can cause memory exhaustion (recursion limit)", "It always fails", "It deletes files"],
    correctOptionIndex: 1,
    explanation: "While json.loads() doesn't execute code like eval(), extremely nested JSON can cause stack overflows or memory issues."
  },
  {
    id: "p_h10",
    type: "scenario",
    difficulty: "hard",
    text: "A Python process is consuming 100% CPU but doing nothing. Which tool is best to identify which line is executing?",
    options: ["top", "py-spy (profiler)", "Lighthouse", "Postman"],
    correctOptionIndex: 1,
    explanation: "py-spy is a sampling profiler that can inspect running Python processes without restarting them."
  },
  {
    id: "p_h11",
    type: "mcq",
    difficulty: "hard",
    text: "What is the purpose of '__slots__'?",
    options: ["To add more methods", "To restrict attribute creation and save memory", "To allow dynamic attributes", "To hide private variables"],
    correctOptionIndex: 1,
    explanation: "__slots__ prevents the creation of __dict__ for each instance, drastically reducing memory usage for millions of objects."
  },
  {
    id: "p_h12",
    type: "fix",
    difficulty: "hard",
    text: "How do you properly run an async task from synchronous code?",
    options: ["await task", "asyncio.run(task())", "task.run()", "thread.start(task)"],
    correctOptionIndex: 1,
    explanation: "asyncio.run() is the proper entry point for running async coroutines from sync code."
  },
  {
    id: "p_h13",
    type: "multi_select",
    difficulty: "hard",
    text: "Which of these are internal memory management techniques in Python?",
    options: ["Reference Counting", "Generational Garbage Collection", "Pointers and offsets", "Manual free()"],
    correctOptionIndices: [0, 1],
    explanation: "CPython uses reference counting as its primary GC, supplemented by a generational collector for cyclic references."
  },
  {
    id: "p_h14",
    type: "mcq",
    difficulty: "hard",
    text: "What is the result of '1 == 1.0' and '1 is 1.0'?",
    options: ["True True", "False False", "True False", "False True"],
    correctOptionIndex: 2,
    explanation: "Values are equal (True), but they are different object types/instances in memory (False)."
  },
  {
    id: "p_h15",
    type: "mcq",
    difficulty: "hard",
    text: "What does the 'mmap' module do?",
    options: ["Maps maps to arrays", "Memory-mapped file support for efficient file I/O", "Maps memory to CPU", "Creates 3D maps"],
    correctOptionIndex: 1,
    explanation: "mmap allows mapping a file directly into memory, enabling high-performance sharing of data between processes."
  }
];
