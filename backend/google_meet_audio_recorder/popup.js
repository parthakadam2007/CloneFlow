document.getElementById("start").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "start-recording" });
  document.getElementById("start").disabled = true;
  document.getElementById("stop").disabled = false;
});

document.getElementById("stop").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "stop-recording" });
  document.getElementById("start").disabled = false;
  document.getElementById("stop").disabled = true;
});
