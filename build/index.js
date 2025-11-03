window.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

window.addEventListener("dblclick", (e) => {
  e.preventDefault();
});

window.addEventListener("selectstart", (e) => {
  e.preventDefault();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "F1") {
    e.preventDefault();
  }
  if (e.key === "F2") {
    e.preventDefault();
  }
  if (e.key === "F3") {
    e.preventDefault();
  }
  if (e.key === "F4") {
    e.preventDefault();
  }
  if (e.key === "F5") {
    e.preventDefault();
  }
  if (e.key === "F6") {
    e.preventDefault();
  }
  if (e.key === "F7") {
    e.preventDefault();
  }
  if (e.key === "F8") {
    e.preventDefault();
  }
  if (e.key === "F9") {
    e.preventDefault();
  }
  if (e.key === "F10") {
    e.preventDefault();
  }
  if (e.key === "F11") {
    e.preventDefault();
  }
  if (e.key === "F12") {
    e.preventDefault();
  }
  if (e.ctrlKey || e.altKey) {
    e.preventDefault();
  }
});
