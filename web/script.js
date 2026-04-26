const RASA_ENDPOINT = "http://localhost:5005/webhooks/rest/webhook";
const SENDER_ID = `website-user-${Date.now()}`;

const chatMessages = document.querySelector("#chatMessages");
const chatForm = document.querySelector("#chatForm");
const messageInput = document.querySelector("#messageInput");

const followUpSets = {
  start: [
    { label: "RC cars", message: "Show remote control cars" },
    { label: "Educational toys", message: "Show educational toys" },
    { label: "Age 5 under 500", message: "Suggest toys for age 5 under 500" },
    { label: "Categories", message: "What categories do you have" },
  ],
  product: [
    { label: "More toys", message: "Show more toys" },
    { label: "Categories", message: "What categories do you have" },
    { label: "Delivery", message: "Delivery details" },
    { label: "Returns", message: "Return policy" },
  ],
  categories: [
    { label: "RC cars", message: "Show remote control cars" },
    { label: "Soft toys", message: "Show soft toys" },
    { label: "Puzzles", message: "Show puzzles" },
    { label: "Board games", message: "Show board games" },
    { label: "Educational", message: "Show educational toys" },
    { label: "Dolls", message: "Show dolls" },
  ],
  support: [
    { label: "Toy suggestions", message: "Suggest a toy" },
    { label: "Categories", message: "What categories do you have" },
    { label: "Contact", message: "Contact number" },
    { label: "More toys", message: "Show more toys" },
  ],
};

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;
  messageInput.value = "";
  sendMessage(message);
});

document.querySelectorAll("[data-message]").forEach((button) => {
  button.addEventListener("click", () => {
    sendMessage(button.dataset.message);
  });
});

async function sendMessage(message) {
  clearFollowUps();
  addMessage(message, "user");

  try {
    const response = await fetch(RASA_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender: SENDER_ID, message }),
    });

    if (!response.ok) {
      throw new Error(`Chat service returned ${response.status}`);
    }

    const replies = await response.json();
    if (!replies.length) {
      addMessage("I am here, but I do not have a reply for that yet.", "bot");
      addFollowUps(followUpSets.start);
      return;
    }

    replies.forEach((reply) => {
      if (reply.text) addMessage(reply.text, "bot");
    });
    addFollowUps(getFollowUps(replies));
  } catch (error) {
    addMessage("I cannot reach the chat service yet. Please try again in a moment.", "bot");
    addFollowUps(followUpSets.support);
  }
}

function addMessage(text, type) {
  const bubble = document.createElement("div");
  bubble.className = `message ${type}`;
  bubble.textContent = text;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addFollowUps(options) {
  clearFollowUps();

  const wrapper = document.createElement("div");
  wrapper.className = "follow-ups";
  wrapper.setAttribute("aria-label", "Suggested replies");

  options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = option.label;
    button.addEventListener("click", () => sendMessage(option.message));
    wrapper.appendChild(button);
  });

  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function clearFollowUps() {
  chatMessages.querySelectorAll(".follow-ups").forEach((group) => group.remove());
}

function getFollowUps(replies) {
  const text = replies.map((reply) => reply.text || "").join(" ").toLowerCase();

  if (
    text.includes("has soft toys") ||
    (text.includes("soft toys") && text.includes("educational toys")) ||
    text.includes("what toy are you looking for")
  ) {
    return followUpSets.categories;
  }

  if (text.includes("we deliver") || text.includes("returns are accepted") || text.includes("contact toy shop")) {
    return followUpSets.support;
  }

  if (text.includes("toy options") || text.includes("rs.")) {
    return followUpSets.product;
  }

  return followUpSets.start;
}
