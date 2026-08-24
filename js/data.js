export const defaultConversations = [
  {
    id: "chat-1",
    title: "Understanding JavaScript Closures",
    timestamp: "2026-08-23T10:30:00",
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: "What is a closure in JavaScript?",
        timestamp: "2026-08-23T10:30:00"
      },
      {
        id: "msg-2",
        role: "assistant",
        content:
          "A closure is created when a function remembers variables from its outer scope even after that scope has finished executing.",
        timestamp: "2026-08-23T10:30:05"
      }
    ]
  },

  {
    id: "chat-2",
    title: "Learning SCSS Basics",
    timestamp: "2026-08-23T09:15:00",
    messages: [
      {
        id: "msg-3",
        role: "user",
        content: "What are the main benefits of using SCSS?",
        timestamp: "2026-08-23T09:15:00"
      },
      {
        id: "msg-4",
        role: "assistant",
        content:
          "SCSS provides variables, nesting, functions, mixins and reusable styles that make CSS easier to maintain.",
        timestamp: "2026-08-23T09:15:05"
      }
    ]
  },

  {
    id: "chat-3",
    title: "Improving Mobile Layout",
    timestamp: "2026-08-22T18:40:00",
    messages: [
      {
        id: "msg-5",
        role: "user",
        content: "How can I make my website responsive?",
        timestamp: "2026-08-22T18:40:00"
      },
      {
        id: "msg-6",
        role: "assistant",
        content:
          "Use flexible layouts, responsive units and media queries to adapt the interface to different screen sizes.",
        timestamp: "2026-08-22T18:40:05"
      }
    ]
  },

  {
    id: "chat-4",
    title: "Designing a Chat Interface",
    timestamp: "2026-08-21T15:20:00",
    messages: [
      {
        id: "msg-7",
        role: "user",
        content: "How should I design a modern chat interface?",
        timestamp: "2026-08-21T15:20:00"
      },
      {
        id: "msg-8",
        role: "assistant",
        content:
          "A modern chat interface should have clear navigation, readable messages, an accessible composer and responsive behavior.",
        timestamp: "2026-08-21T15:20:05"
      }
    ]
  },

  {
    id: "chat-5",
    title: "Frontend Development Tips",
    timestamp: "2026-08-18T12:10:00",
    messages: [
      {
        id: "msg-9",
        role: "user",
        content: "What are some important frontend development practices?",
        timestamp: "2026-08-18T12:10:00"
      },
      {
        id: "msg-10",
        role: "assistant",
        content:
          "Keep your code organized, use reusable components and maintain consistent styling across the application.",
        timestamp: "2026-08-18T12:10:05"
      }
    ]
  },

  {
    id: "chat-6",
    title: "Working with DOM Events",
    timestamp: "2026-08-10T16:30:00",
    messages: [
      {
        id: "msg-11",
        role: "user",
        content: "How do DOM events work in JavaScript?",
        timestamp: "2026-08-10T16:30:00"
      },
      {
        id: "msg-12",
        role: "assistant",
        content:
          "DOM events allow JavaScript to respond to user interactions such as clicks, keyboard input and form submissions.",
        timestamp: "2026-08-10T16:30:05"
      }
    ]
    }
  
]
const savedConversations =
localStorage.getItem("chatgpt-conversations");

export const conversations = savedConversations
? JSON.parse(savedConversations)
: defaultConversations;

export const models = [
  {
    id: "fast",
    name: "Fast",
    description: "Quick responses for everyday tasks"
  },
  {
    id: "balanced",
    name: "Balanced",
    description: "A balance of speed and capability"
  },
  {
    id: "reasoning",
    name: "Reasoning",
    description: "Better for complex problems"
  }
];

export const mockResponses = [
  {
    keywords: ["hello", "hi", "hey"],
    response: "Hello! How can I help you today?"
  },

  {
    keywords: ["html", "css", "scss"],
    response:
      "HTML provides the structure, while CSS and SCSS handle the visual presentation and responsive layout."
  },

  {
    keywords: ["javascript", "js"],
    response:
      "JavaScript handles the interactive behavior of this frontend application, including messages, conversations and UI states."
  },

  {
    keywords: ["responsive", "mobile", "tablet"],
    response:
      "A responsive chat application can use a visible sidebar on desktop, a collapsible sidebar on tablet and a drawer on mobile."
  },

  {
    keywords: ["scss", "sass"],
    response:
      "SCSS maps, functions and mixins are useful for creating a consistent design system and avoiding repeated values."
  }
];

export const defaultMockResponse =
  "I understand your message. This is a predefined mock response because this project does not use an external AI API.";