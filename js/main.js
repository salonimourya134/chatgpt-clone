import { initComposer } from "./composer.js";
import { initSidebar } from "./sidebar.js";

import {
  conversations,
  models,
  mockResponses
} from "./data.js";

import { state } from "./state.js";

initComposer();
initSidebar();

console.log(conversations);
console.log(models);
console.log(mockResponses);
console.log(state);