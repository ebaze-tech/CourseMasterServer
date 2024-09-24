const mongoose = require("mongoose");
const Question = require("./models/Question");
const dotenv = require("dotenv");

dotenv.config();
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection failed", err));

const questions = [
  {
    category: "React.js",
    questionText: "What is JSX in React?",
    answers: ["A JavaScript extension", "A CSS framework", "A Python library"],
    correctAnswer: "A JavaScript extension",
  },
  {
    category: "PHP",
    questionText: "What is PHP used for?",
    answers: [
      "Frontend development",
      "Backend development",
      "Mobile development",
    ],
    correctAnswer: "Backend development",
  },
  {
    category: "Python",
    questionText: "What type of language is Python?",
    answers: ["Compiled", "Interpreted", "Assembly"],
    correctAnswer: "Interpreted",
  },
  {
    category: "C++",
    questionText: "Which of the following is a feature of C++?",
    answers: [
      "Object-oriented programming",
      "Garbage collection",
      "Automatic memory management",
    ],
    correctAnswer: "Object-oriented programming",
  },
  {
    category: "Java",
    questionText: "Which keyword is used to create an object in Java?",
    answers: ["new", "create", "initialize"],
    correctAnswer: "new",
  },
  {
    category: "HTML",
    questionText: "What does HTML stand for?",
    answers: [
      "HyperText Markup Language",
      "HighText Marking Language",
      "HyperTool Markup Language",
    ],
    correctAnswer: "HyperText Markup Language",
  },
  {
    category: "AWS",
    questionText: "Which of the following is a service provided by AWS?",
    answers: [
      "Elastic Compute Cloud (EC2)",
      "Azure App Services",
      "Google Kubernetes Engine",
    ],
    correctAnswer: "Elastic Compute Cloud (EC2)",
  },
  {
    category: "Google Cloud",
    questionText: "What is Google Cloud Storage used for?",
    answers: [
      "Storing relational databases",
      "Hosting applications",
      "Storing and accessing data",
    ],
    correctAnswer: "Storing and accessing data",
  },
  {
    category: "React.js",
    questionText: "What is the use of 'useState' in React?",
    answers: [
      "Managing component state",
      "Handling form submissions",
      "Styling components",
    ],
    correctAnswer: "Managing component state",
  },
  {
    category: "PHP",
    questionText: "What does the acronym PHP stand for?",
    answers: [
      "Personal Home Page",
      "Private Hosting Protocol",
      "Page Hypertext Processor",
    ],
    correctAnswer: "Personal Home Page",
  },
  {
    category: "Python",
    questionText: "Which of the following is a web framework for Python?",
    answers: ["Django", "Spring", "Laravel"],
    correctAnswer: "Django",
  },
  {
    category: "C++",
    questionText: "Which of the following is not a feature of C++?",
    answers: ["Polymorphism", "Encapsulation", "Automatic garbage collection"],
    correctAnswer: "Automatic garbage collection",
  },
  {
    category: "Java",
    questionText: "Which method is used to start a thread in Java?",
    answers: ["run()", "start()", "begin()"],
    correctAnswer: "start()",
  },
  {
    category: "HTML",
    questionText: "Which tag is used to create a hyperlink in HTML?",
    answers: ["<a>", "<link>", "<href>"],
    correctAnswer: "<a>",
  },
  {
    category: "AWS",
    questionText: "What does S3 stand for in AWS?",
    answers: [
      "Simple Storage Service",
      "Scalable Storage Solution",
      "Simple System Storage",
    ],
    correctAnswer: "Simple Storage Service",
  },
  {
    category: "Google Cloud",
    questionText:
      "Which Google Cloud service is used for serverless computing?",
    answers: ["Cloud Functions", "Compute Engine", "App Engine"],
    correctAnswer: "Cloud Functions",
  },
  {
    category: "React.js",
    questionText:
      "Which hook is used for lifecycle methods in functional components?",
    answers: ["useEffect", "useContext", "useState"],
    correctAnswer: "useEffect",
  },
  {
    category: "PHP",
    questionText:
      "Which superglobal array is used to collect form data in PHP?",
    answers: ["$_POST", "$_FORM", "$_DATA"],
    correctAnswer: "$_POST",
  },
  {
    category: "Python",
    questionText:
      "Which of the following is used for package management in Python?",
    answers: ["npm", "pip", "brew"],
    correctAnswer: "pip",
  },
  {
    category: "C++",
    questionText: "What is the size of an int in C++?",
    answers: ["2 bytes", "4 bytes", "8 bytes"],
    correctAnswer: "4 bytes",
  },
  {
    category: "Java",
    questionText:
      "Which of the following is not a primitive data type in Java?",
    answers: ["int", "String", "float"],
    correctAnswer: "String",
  },
  {
    category: "HTML",
    questionText: "Which attribute is used to define inline styles in HTML?",
    answers: ["class", "id", "style"],
    correctAnswer: "style",
  },
  {
    category: "AWS",
    questionText: "What is the primary database service offered by AWS?",
    answers: ["RDS", "DynamoDB", "Aurora"],
    correctAnswer: "RDS",
  },
  {
    category: "Google Cloud",
    questionText: "What is Google Kubernetes Engine (GKE) used for?",
    answers: [
      "Container orchestration",
      "Cloud storage",
      "Compute virtualization",
    ],
    correctAnswer: "Container orchestration",
  },
  {
    category: "React.js",
    questionText:
      "Which of the following is a way to pass data between React components?",
    answers: ["Props", "States", "Events"],
    correctAnswer: "Props",
  },
  {
    category: "PHP",
    questionText:
      "Which function is used to include one PHP file inside another?",
    answers: ["import()", "include()", "addFile()"],
    correctAnswer: "include()",
  },
  {
    category: "Python",
    questionText: "What is a dictionary in Python?",
    answers: [
      "A collection of key-value pairs",
      "A list of ordered elements",
      "An immutable data type",
    ],
    correctAnswer: "A collection of key-value pairs",
  },
  {
    category: "C++",
    questionText:
      "Which operator is used for dynamic memory allocation in C++?",
    answers: ["new", "malloc", "alloc"],
    correctAnswer: "new",
  },
  {
    category: "Java",
    questionText: "Which class is the root of the Java class hierarchy?",
    answers: ["Object", "Main", "Class"],
    correctAnswer: "Object",
  },
  {
    category: "HTML",
    questionText: "Which HTML tag is used to define an image?",
    answers: ["<img>", "<image>", "<src>"],
    correctAnswer: "<img>",
  },
  {
    category: "AWS",
    questionText: "What does EC2 in AWS stand for?",
    answers: [
      "Elastic Compute Cloud",
      "Enhanced Compute Cloud",
      "Extended Compute Cluster",
    ],
    correctAnswer: "Elastic Compute Cloud",
  },
  {
    category: "Google Cloud",
    questionText:
      "Which Google Cloud service provides managed relational databases?",
    answers: ["Cloud SQL", "BigQuery", "Cloud Functions"],
    correctAnswer: "Cloud SQL",
  },
  {
    category: "React.js",
    questionText:
      "Which method is used to render components to the DOM in React?",
    answers: ["ReactDOM.render", "renderComponent", "createComponent"],
    correctAnswer: "ReactDOM.render",
  },
  {
    category: "PHP",
    questionText: "Which symbol is used to declare a variable in PHP?",
    answers: ["$", "#", "@"],
    correctAnswer: "$",
  },
  {
    category: "Python",
    questionText: "Which keyword is used to define a function in Python?",
    answers: ["function", "def", "lambda"],
    correctAnswer: "def",
  },
  {
    category: "C++",
    questionText: "What is the purpose of the 'this' pointer in C++?",
    answers: [
      "Refers to the current object",
      "Refers to the base class",
      "Refers to the global object",
    ],
    correctAnswer: "Refers to the current object",
  },
  {
    category: "Java",
    questionText: "Which of the following is a wrapper class in Java?",
    answers: ["Integer", "int", "char"],
    correctAnswer: "Integer",
  },
  {
    category: "HTML",
    questionText: "Which tag is used to create a table in HTML?",
    answers: ["<table>", "<tr>", "<td>"],
    correctAnswer: "<table>",
  },
  {
    category: "AWS",
    questionText: "What does IAM stand for in AWS?",
    answers: [
      "Identity and Access Management",
      "Internet and Access Management",
      "Integrated Account Management",
    ],
    correctAnswer: "Identity and Access Management",
  },
  {
    category: "Google Cloud",
    questionText: "What is BigQuery in Google Cloud used for?",
    answers: ["Data analytics", "Hosting websites", "Running virtual machines"],
    correctAnswer: "Data analytics",
  },
  {
    category: "React.js",
    questionText: "Which hook is used to manage context in React?",
    answers: ["useContext", "useState", "useReducer"],
    correctAnswer: "useContext",
  },
  {
    category: "PHP",
    questionText: "Which of the following is not a valid PHP variable name?",
    answers: ["$variable", "$1variable", "$_variable"],
    correctAnswer: "$1variable",
  },
  {
    category: "Python",
    questionText: "Which of the following is a mutable data type in Python?",
    answers: ["Tuple", "List", "String"],
    correctAnswer: "List",
  },
  {
    category: "C++",
    questionText:
      "Which of the following is used for exception handling in C++?",
    answers: ["try-catch", "throw-catch", "exception-catch"],
    correctAnswer: "try-catch",
  },
  {
    category: "Java",
    questionText: "Which of these is a feature of Java?",
    answers: [
      "Platform independent",
      "Garbage collection required",
      "Low-level memory management",
    ],
    correctAnswer: "Platform independent",
  },
  {
    category: "HTML",
    questionText: "What does the <title> tag in HTML do?",
    answers: [
      "Defines the title of the document",
      "Displays an image",
      "Creates a hyperlink",
    ],
    correctAnswer: "Defines the title of the document",
  },
  {
    category: "AWS",
    questionText: "Which AWS service is used for DNS management?",
    answers: ["Route 53", "CloudFront", "Lambda"],
    correctAnswer: "Route 53",
  },
  {
    category: "Google Cloud",
    questionText: "What does Google Cloud Pub/Sub service do?",
    answers: [
      "Messaging between applications",
      "Running machine learning models",
      "Storing files",
    ],
    correctAnswer: "Messaging between applications",
  },
  {
    category: "React.js",
    questionText:
      "Which library is commonly used for managing state in React applications?",
    answers: ["Redux", "jQuery", "Axios"],
    correctAnswer: "Redux",
  },
  {
    category: "React.js",
    questionText: "Which method is used to update the state in React?",
    answers: ["setState", "updateState", "changeState"],
    correctAnswer: "setState",
  },
  {
    category: "PHP",
    questionText: "Which of the following is used to start a session in PHP?",
    answers: ["start_session()", "session_start()", "init_session()"],
    correctAnswer: "session_start()",
  },
  {
    category: "Python",
    questionText: "Which keyword is used to handle exceptions in Python?",
    answers: ["catch", "except", "error"],
    correctAnswer: "except",
  },
  {
    category: "C++",
    questionText: "Which of the following is a loop structure in C++?",
    answers: ["while", "foreach", "iterate"],
    correctAnswer: "while",
  },
  {
    category: "Java",
    questionText:
      "Which access modifier is used to make variables accessible only within the class?",
    answers: ["private", "protected", "public"],
    correctAnswer: "private",
  },
  {
    category: "HTML",
    questionText:
      "What is the correct way to include an external CSS file in HTML?",
    answers: [
      "<link rel='stylesheet' href='style.css'>",
      "<css src='style.css'>",
      "<style href='style.css'>",
    ],
    correctAnswer: "<link rel='stylesheet' href='style.css'>",
  },
  {
    category: "AWS",
    questionText: "Which AWS service is used for object storage?",
    answers: ["EC2", "S3", "RDS"],
    correctAnswer: "S3",
  },
  {
    category: "Google Cloud",
    questionText:
      "Which Google Cloud service is used for managing virtual machines?",
    answers: ["Compute Engine", "Cloud Functions", "Cloud Storage"],
    correctAnswer: "Compute Engine",
  },
  {
    category: "React.js",
    questionText: "What is a pure component in React?",
    answers: [
      "A component that re-renders only when props or state changes",
      "A component without any state",
      "A component that is a child component",
    ],
    correctAnswer:
      "A component that re-renders only when props or state changes",
  },
  {
    category: "PHP",
    questionText: "Which of the following is a PHP framework?",
    answers: ["Laravel", "Django", "Flask"],
    correctAnswer: "Laravel",
  },
  {
    category: "Python",
    questionText: "Which library is used for data analysis in Python?",
    answers: ["NumPy", "Pandas", "Matplotlib"],
    correctAnswer: "Pandas",
  },
  {
    category: "C++",
    questionText: "Which keyword is used to inherit a class in C++?",
    answers: ["extends", "inherits", "public"],
    correctAnswer: "public",
  },
  {
    category: "Java",
    questionText: "What is a constructor in Java?",
    answers: [
      "A special method that is called when an object is instantiated",
      "A method that initializes variables",
      "A function that creates new classes",
    ],
    correctAnswer:
      "A special method that is called when an object is instantiated",
  },
  {
    category: "HTML",
    questionText: "Which tag is used for a line break in HTML?",
    answers: ["<br>", "<hr>", "<p>"],
    correctAnswer: "<br>",
  },
  {
    category: "AWS",
    questionText: "Which AWS service provides NoSQL databases?",
    answers: ["RDS", "DynamoDB", "S3"],
    correctAnswer: "DynamoDB",
  },
  {
    category: "Google Cloud",
    questionText: "What is Cloud Spanner in Google Cloud?",
    answers: [
      "A global, scalable, relational database",
      "A tool for container orchestration",
      "A serverless function service",
    ],
    correctAnswer: "A global, scalable, relational database",
  },
  {
    category: "React.js",
    questionText: "What does 'lifting state up' mean in React?",
    answers: [
      "Moving state to a parent component to share it with child components",
      "Increasing the size of a state variable",
      "Changing the state management method",
    ],
    correctAnswer:
      "Moving state to a parent component to share it with child components",
  },
  {
    category: "PHP",
    questionText: "Which function is used to end a script in PHP?",
    answers: ["die()", "exit()", "terminate()"],
    correctAnswer: "exit()",
  },
  {
    category: "Python",
    questionText: "Which Python module is used for regular expressions?",
    answers: ["regex", "re", "regexp"],
    correctAnswer: "re",
  },
  {
    category: "C++",
    questionText: "What is a virtual function in C++?",
    answers: [
      "A function that can be overridden in derived classes",
      "A function that doesn't return any value",
      "A function that is defined inside an abstract class",
    ],
    correctAnswer: "A function that can be overridden in derived classes",
  },
  {
    category: "Java",
    questionText: "Which method in Java is used to compare strings?",
    answers: ["compare()", "equals()", "compareTo()"],
    correctAnswer: "equals()",
  },
  {
    category: "HTML",
    questionText: "What is the purpose of the <meta> tag in HTML?",
    answers: [
      "Defines metadata about the HTML document",
      "Embeds media content",
      "Defines the document title",
    ],
    correctAnswer: "Defines metadata about the HTML document",
  },
  {
    category: "AWS",
    questionText: "Which AWS service is used for container orchestration?",
    answers: ["EKS", "Lambda", "RDS"],
    correctAnswer: "EKS",
  },
  {
    category: "Google Cloud",
    questionText: "What is Cloud Run in Google Cloud?",
    answers: [
      "A fully managed service to run containers",
      "A serverless storage service",
      "A database management tool",
    ],
    correctAnswer: "A fully managed service to run containers",
  },
  {
    category: "React.js",
    questionText: "What is the primary purpose of React Router?",
    answers: [
      "To handle navigation between components",
      "To manage component state",
      "To manage forms",
    ],
    correctAnswer: "To handle navigation between components",
  },
  {
    category: "PHP",
    questionText: "Which PHP function is used to get the length of a string?",
    answers: ["strlen()", "strlength()", "count()"],
    correctAnswer: "strlen()",
  },
  {
    category: "Python",
    questionText: "What is the output of 3**2 in Python?",
    answers: ["6", "9", "8"],
    correctAnswer: "9",
  },
  {
    category: "C++",
    questionText: "What is the purpose of the 'friend' keyword in C++?",
    answers: [
      "To allow access to private members of a class",
      "To declare a global function",
      "To define a friend class",
    ],
    correctAnswer: "To allow access to private members of a class",
  },
  {
    category: "Java",
    questionText: "What is the purpose of the 'final' keyword in Java?",
    answers: [
      "To prevent inheritance of a class or overriding of a method",
      "To declare a variable",
      "To start a thread",
    ],
    correctAnswer:
      "To prevent inheritance of a class or overriding of a method",
  },
  {
    category: "HTML",
    questionText: "Which tag is used to define a table header in HTML?",
    answers: ["<th>", "<tr>", "<td>"],
    correctAnswer: "<th>",
  },
  {
    category: "AWS",
    questionText: "Which AWS service is used for monitoring and observability?",
    answers: ["CloudWatch", "CloudFormation", "S3"],
    correctAnswer: "CloudWatch",
  },
  {
    category: "Google Cloud",
    questionText:
      "Which Google Cloud service is used for serverless event-driven functions?",
    answers: ["Cloud Functions", "Compute Engine", "BigQuery"],
    correctAnswer: "Cloud Functions",
  },
  {
    category: "React.js",
    questionText: "What is the main benefit of using React hooks?",
    answers: [
      "Hooks allow you to use state and other React features in functional components",
      "Hooks make components render faster",
      "Hooks replace all class components",
    ],
    correctAnswer:
      "Hooks allow you to use state and other React features in functional components",
  },
  {
    category: "PHP",
    questionText: "Which operator is used to concatenate strings in PHP?",
    answers: ["+", ".", "&"],
    correctAnswer: ".",
  },
  {
    category: "Python",
    questionText:
      "Which Python data structure can store both unique and unordered elements?",
    answers: ["Set", "List", "Dictionary"],
    correctAnswer: "Set",
  },
];

async function seedQuestions() {
  await Question.insertMany(questions);
  console.log("Questions seeded");
  mongoose.disconnect();
}
seedQuestions();
