import { select } from "./utils.js";
import { conversations } from "./data.js";
import { state } from "./state.js";

function getConversationGroup(timestamp) {
  const conversationDate = new Date(timestamp);
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const sevenDaysAgo = new Date(startOfToday);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  if (conversationDate >= startOfToday) {
    return "today";
  }

  if (conversationDate >= startOfYesterday) {
    return "yesterday";
  }

  if (conversationDate >= sevenDaysAgo) {
    return "previous";
  }

  return "older";
}

function createConversation(conversation) {
  const button = document.createElement("button");

  button.type = "button";
  button.className = "button conversation";
  button.dataset.conversationId = conversation.id;

  const title = document.createElement("span");

  title.className = "conversation__title";
  title.textContent = conversation.title;

  button.append(title);

  return button;
}

// function renderConversationGroup(group, conversationsList) {
//   const container = document.querySelector(
//     `[data-group="${group}"]`
//   );

//   if (!container) {
//     return;
//   }

//   container.replaceChildren();

//   conversationsList.forEach((conversation) => {
//     const button = createConversation(conversation);

//     button.addEventListener("click", () => {
//       setActiveConversation(conversation.id);
//     });

//     container.append(button);
//   });
// }
function renderConversationGroup(group, conversationsList) {
  const container = document.querySelector(
    `[data-group="${group}"]`
  );

  if (!container) {
    return;
  }

  container.replaceChildren();

  conversationsList.forEach((conversation) => {
    const button = createConversation(conversation);

    button.classList.toggle(
      "conversation--active",
      conversation.id === state.activeConversationId
    );

    button.addEventListener("click", () => {
      setActiveConversation(conversation.id);
    });

    container.append(button);
  });
}

export function renderConversations() {
  const groups = {
    today: [],
    yesterday: [],
    previous: [],
    older: []
  };

  conversations.forEach((conversation) => {
    const group = getConversationGroup(
      conversation.timestamp
    );

    groups[group].push(conversation);
  });

  Object.entries(groups).forEach(
    ([group, conversationsList]) => {
      renderConversationGroup(
        group,
        conversationsList
      );
    }
  );
}

function setActiveConversation(conversationId) {
  const conversation = conversations.find(
    (item) => item.id === conversationId
  );

  if (!conversation) {
    return;
  }

  state.activeConversationId = conversationId;
  state.isNewChat = false;

  document
    .querySelectorAll(".conversation")
    .forEach((button) => {
      button.classList.toggle(
        "conversation--active",
        button.dataset.conversationId === conversationId
      );
    });

  renderConversation(conversation);
}

function renderConversation(conversation) {
  const chat = select(".chat");
  const welcome = select(".chat__welcome");
  const messagesContainer = select(".chat__messages");

  if (!chat || !welcome || !messagesContainer) {
    return;
  }

  welcome.style.display = "none";
  chat.classList.add("chat--active");

  messagesContainer.replaceChildren();

  conversation.messages.forEach((message) => {
    const article = document.createElement("article");

    article.className =
      `chat__message chat__message--${message.role}`;

    const content = document.createElement("div");

    content.className = "chat__message-content";
    content.textContent = message.content;

    article.append(content);
    messagesContainer.append(article);
  });
}

function createNewChat() {
  state.activeConversationId = null;
  state.isNewChat = true;

  document
    .querySelectorAll(".conversation")
    .forEach((button) => {
      button.classList.remove("conversation--active");
    });

  const chat = select(".chat");
  const welcome = select(".chat__welcome");
  const messagesContainer = select(".chat__messages");

  if (chat) {
    chat.classList.remove("chat--active");
  }

  if (welcome) {
    welcome.style.display = "";
  }

  messagesContainer?.replaceChildren();
}

function openSidebar(sidebar, overlay) {
  sidebar.classList.add("sidebar--open");
  overlay?.classList.add("sidebar-overlay--visible");

  document.body.classList.add("sidebar-is-open");
}

function closeSidebar(sidebar, overlay) {
  sidebar.classList.remove("sidebar--open");
  overlay?.classList.remove("sidebar-overlay--visible");

  document.body.classList.remove("sidebar-is-open");
}

function toggleDesktopSidebar(sidebar) {
  sidebar.classList.toggle("sidebar--collapsed");
}

export function initSidebar() {
  const sidebar = select(".sidebar");
  const overlay = select(".sidebar-overlay");

  const menuButton = select(".header__menu");
  const brandButton = select(".sidebar__brand");
  const collapseButton = select(".sidebar__collapse");
  const newChatButton = select(
    ".navigation-item--new-chat"
  );

  if (!sidebar) {
    return;
  }

  renderConversations();

  newChatButton?.addEventListener("click", () => {
    createNewChat();
    closeSidebar(sidebar, overlay);
  });

  menuButton?.addEventListener("click", () => {
    openSidebar(sidebar, overlay);
  });

  brandButton?.addEventListener("click", () => {
    openSidebar(sidebar, overlay);
  });

  collapseButton?.addEventListener("click", () => {
    if (window.innerWidth > 900) {
      toggleDesktopSidebar(sidebar);
      return;
    }

    closeSidebar(sidebar, overlay);
  });

  overlay?.addEventListener("click", () => {
    closeSidebar(sidebar, overlay);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSidebar(sidebar, overlay);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeSidebar(sidebar, overlay);
    }
  });
}