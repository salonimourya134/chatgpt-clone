export const select = (selector, scope = document) =>
  scope.querySelector(selector);
export const selectAll = (selector, scope = document) => [
  ...scope.querySelectorAll(selector),
];
