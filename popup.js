chrome.storage.local.get(null, (data) => {
  const list = document.getElementById("list");

  for (const domain in data) {
    const time = Math.floor(data[domain] / 1000); // in seconds
    const item = document.createElement("li");
    item.textContent = `${domain} → ${Math.floor(time / 60)} min ${
      time % 60
    } sec`;
    list.appendChild(item);
  }
});
