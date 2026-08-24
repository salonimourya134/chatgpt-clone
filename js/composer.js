import { select } from "./utils.js";
import { state } from "./state.js";
import { conversations } from "./data.js";
import { renderConversations } from "./sidebar.js";

function saveConversations() {
  localStorage.setItem(
    "chatgpt-conversations",
    JSON.stringify(conversations)
  );
}
function createMessageElement(role, content, messageId = "") {
  const article = document.createElement("article");

  article.className =
    `chat__message chat__message--${role}`;
  article.dataset.messageId = messageId;
  const contentElement = document.createElement("div");
  contentElement.className ="chat__message-content";

  contentElement.textContent = content;
  article.append(contentElement);

  if (role === "assistant") {
    const actions = document.createElement("div");

    actions.className = "message-actions";
    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className =
      "button message-actions__button";
    copyButton.dataset.action = "copy";
    copyButton.setAttribute(
      "aria-label",
      "Copy response"
    );
    copyButton.textContent = "Copy";

    const likeButton = document.createElement("button");
    likeButton.type = "button";
    likeButton.className =
      "button message-actions__button";
    likeButton.dataset.action = "like";
    likeButton.setAttribute(
      "aria-label",
      "Like response"
    );
    likeButton.textContent = "Like";

    const dislikeButton = document.createElement("button");
    dislikeButton.type = "button";
    dislikeButton.className =
      "button message-actions__button";
    dislikeButton.dataset.action = "dislike";
    dislikeButton.setAttribute(
"aria-label","Dislike response");
    dislikeButton.textContent = "Dislike";

    const regenerateButton =
      document.createElement("button");

    regenerateButton.type = "button";
    regenerateButton.className =
      "button message-actions__button";
    regenerateButton.dataset.action = "regenerate";
    regenerateButton.setAttribute(
      "aria-label",
      "Regenerate response"
    );
    regenerateButton.textContent = "Regenerate";

    actions.append(
      copyButton,
      likeButton,
      dislikeButton,
      regenerateButton
    );

    article.append(actions);
  }

  return article;
}

function addUserMessage(content, messageId) {
  const messagesContainer =
    select(".chat__messages");

  if (!messagesContainer) {
    return;
  }

  messagesContainer.append(
    createMessageElement(
      "user",
      content,
      messageId
    )
  );
}

function createConversation(title) {
  const conversation = {
    id: `conversation-${Date.now()}`,
    title: title.slice(0, 40),
    timestamp: new Date().toISOString(),
    messages: []
  };

  conversations.unshift(conversation);

  state.activeConversationId = conversation.id;
  state.isNewChat = false;

  return conversation;
}
function getActiveConversation() {
  return conversations.find(
    (conversation) =>
      conversation.id === state.activeConversationId
  );
}

function showGeneratingState() {
  const messagesContainer = select(".chat__messages");

  if (!messagesContainer) {
    return;
  }

  const article = document.createElement("article");

  article.className =
    "chat__message chat__message--assistant chat__message--loading";

  const content = document.createElement("div");

  content.className = "chat__message-content";
  content.textContent = "Thinking...";

  article.append(content);
  messagesContainer.append(article);

  messagesContainer.scrollTop =
    messagesContainer.scrollHeight;

  return article;
}
async function handleSubmit(textarea) {
  const content = textarea.value.trim();
  if (!content) {
    return;
  }
  let conversation = getActiveConversation();
  if (!conversation) {
  conversation = createConversation(content);
    saveConversations();
     renderConversations();
  }
  const userMessage = {
    id: `message-${Date.now()}`,
    role: "user",
    content
  };
  conversation.messages.push(userMessage);
    saveConversations();
 addUserMessage(
  content,
  userMessage.id
);
  textarea.value = "";
  textarea.style.height = "";
  const chat = select(".chat");
  const welcome = select(".chat__welcome");
  chat?.classList.add("chat--active");
  if (welcome) {
    welcome.style.display = "none";
  }

  const loadingElement = showGeneratingState();

  await new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });

  loadingElement?.remove();

  const response = getMockResponse(content);

  const assistantMessage = {
    id: `message-${Date.now()}`,
    role: "assistant",
    content: response
  };

  conversation.messages.push(assistantMessage);
  saveConversations();
  const messagesContainer = select(".chat__messages");
messagesContainer?.append(
  createMessageElement(
    "assistant",
    response,
    assistantMessage.id
  )
);
}
function toggleReaction(
  message,
  activeAction,
  inactiveAction
) {
  const activeButton = message.querySelector(
    `[data-action="${activeAction}"]`
  );

  const inactiveButton = message.querySelector(
    `[data-action="${inactiveAction}"]`
  );

  if (!activeButton || !inactiveButton) {
    return;
  }

  const alreadyActive =
    activeButton.classList.contains(
      "message-actions__button--active"
    );

  activeButton.classList.toggle(
    "message-actions__button--active",
    !alreadyActive
  );

  activeButton.setAttribute(
    "aria-pressed",
    String(!alreadyActive)
  );

  inactiveButton.classList.remove(
    "message-actions__button--active"
  );

  inactiveButton.setAttribute(
    "aria-pressed",
    "false"
  );
}

function getMockResponse(content) {
  const text = content.toLowerCase();

  if (
    text.includes("javascript") ||
    text.includes("js")
  ) {
    return "JavaScript is a programming language used to add behavior and interactivity to web applications.";
  }

  if (
    text.includes("html") ||
    text.includes("css")
  ) {
    return "HTML provides the structure of a webpage, while CSS controls its presentation and layout.";
  }

  if (
    text.includes("sidebar") ||
    text.includes("chatgpt")
  ) {
    return "You can build this interface using HTML5 for structure, SCSS for styling, and Vanilla JavaScript for interactions.";
  }

  return "I can help with that.";
}
function handleMessageAction(event) {
  const button = event.target.closest(
    ".message-actions__button"
  );

  if (!button) {
    return;
  }

  const message = button.closest(
    ".chat__message"
  );

  if (!message) {
    return;
  }

  const action = button.dataset.action;

  if (action === "copy") {
    copyMessage(message);
    return;
  }

  if (action === "like") {
    toggleReaction(
      message,
      "like",
      "dislike"
    );
    return;
  }

  if (action === "dislike") {
    toggleReaction(
      message,
      "dislike",
      "like"
    );
    return;
  }
if (action === "regenerate") {
  showRegenerateInput(message);
}

}
async function copyMessage(message) {
  const content = message.querySelector(
    ".chat__message-content"
  );

  if (!content) {
    return;
  }

  try {
    await navigator.clipboard.writeText(
      content.textContent
    );

    const button = message.querySelector(
      '[data-action="copy"]'
    );

    if (!button) {
      return;
    }

    const originalText = button.textContent;

    button.textContent = "Copied";

    setTimeout(() => {
      button.textContent = originalText;
    }, 1200);
  } catch {
    return;
  }
}


function showRegenerateInput(message) {
  const existingInput =
    message.querySelector(".regenerate-input");

  if (existingInput) {
    existingInput.querySelector(
      ".regenerate-input__textarea"
    )?.focus();

    return;
  }

  const container =
    document.createElement("div");

  container.className =
    "regenerate-input";

  container.innerHTML = `
    <textarea
      class="regenerate-input__textarea"
      rows="1"
      placeholder="Write a new message..."
      aria-label="Write a new message"
    ></textarea>

    <button
      class="button regenerate-input__send"
      type="button"
      aria-label="Send new message"
    >
      Send
    </button>
  `;

  message.append(container);

  const textarea =
    container.querySelector(
      ".regenerate-input__textarea"
    );

  textarea?.focus();

  const sendButton =
    container.querySelector(
      ".regenerate-input__send"
    );

  sendButton?.addEventListener(
    "click",
    () => {
      handleRegenerateSubmit(
        message,
        textarea
      );
    }
  );

  textarea?.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {
        event.preventDefault();

        handleRegenerateSubmit(
          message,
          textarea
        );
      }
    }
  );
}
async function handleRegenerateSubmit(
  message,
  textarea
) {
  const content =
    textarea.value.trim();

  if (!content) {
    return;
  }

  const conversation =
    conversations.find(
      (item) =>
        item.id === state.activeConversationId
    );

  if (!conversation) {
    return;
  }

  const assistantMessageId =
    message.dataset.messageId;

  const assistantIndex =
    conversation.messages.findIndex(
      (item) =>
        item.id === assistantMessageId
    );

  if (assistantIndex === -1) {
    return;
  }

  const userMessage = {
    id: `message-${Date.now()}`,
    role: "user",
    content
  };

  const assistantMessage =
    conversation.messages[
      assistantIndex
    ];

  conversation.messages.splice(
    assistantIndex,
    1,
    userMessage
  );

  const contentElement =
    message.querySelector(
      ".chat__message-content"
    );

  if (contentElement) {
    contentElement.textContent =
      "Thinking...";
  }

  await new Promise((resolve) => {
    setTimeout(resolve, 1200);
  });

  const response =
    getMockResponse(content);

  assistantMessage.content =
    response;

  assistantMessage.role =
    "assistant";

  conversation.messages.splice(
    assistantIndex,
    0,
    assistantMessage
  );

  if (contentElement) {
    contentElement.textContent =
      response;
  }

  textarea.closest(
    ".regenerate-input"
  )?.remove();
}

export function initComposer() {
  const form = select(".composer");
  const textarea = select(".composer__textarea");
  const messagesContainer = select(".chat__messages");
  const shortcuts = select(".shortcuts");

  if (!form || !textarea) {
    return;
  }


  textarea.addEventListener("focus", () => {
    shortcuts?.classList.add("shortcuts--hidden");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    handleSubmit(textarea);
  });

  messagesContainer?.addEventListener(
    "click",
    handleMessageAction
  );
}
