let currentEmail = "";

// Generate Email
document.getElementById("generateBtn").addEventListener("click", async () => {
  document.getElementById("loader").style.display = "block";
  document.getElementById("emailBox").innerText = "Generating...";

  try {
    const res = await fetch("/api/temp?type=generate");
    const data = await res.json();

    if (data.email) {
      currentEmail = data.email;
      document.getElementById("emailBox").innerText = "📧 " + currentEmail;

      navigator.clipboard.writeText(currentEmail);
      alert("Email copied: " + currentEmail);
    } else {
      document.getElementById("emailBox").innerText = "❌ Failed to generate";
    }
  } catch (err) {
    document.getElementById("emailBox").innerText = "⚠️ Error: " + err.message;
  }

  document.getElementById("loader").style.display = "none";
});

// Load Inbox
async function loadInbox() {
  const inbox = document.getElementById("inbox");
  const infoBox = document.getElementById("infoBox");

  if (!currentEmail) {
    infoBox.style.display = "block";
    inbox.innerHTML = "<li style='padding:10px; text-align:center;'>📭 No messages</li>";
    return;
  } else {
    infoBox.style.display = "none";
  }

  inbox.innerHTML = "<li style='padding:10px; text-align:center;'>⏳ Loading...</li>";

  try {
    const res = await fetch(`/api/temp?type=inbox&email=${currentEmail}`);
    const data = await res.json();

    if (data && data.length > 0) {
      inbox.innerHTML = "";
      data.forEach(msg => {
        const li = document.createElement("li");
        li.style.padding = "10px";
        li.style.borderBottom = "1px solid gray";
        li.style.cursor = "pointer";
        li.innerText = `📨 From: ${msg.from} | Subject: ${msg.subject}`;
        li.onclick = () => loadMessage(msg.id);
        inbox.appendChild(li);
      });
    } else {
      inbox.innerHTML = "<li style='padding:10px; text-align:center;'>📭 No messages</li>";
    }
  } catch (err) {
    inbox.innerHTML = "<li style='padding:10px; text-align:center;'>⚠️ Error loading inbox</li>";
  }
}

// Load Single Message
async function loadMessage(id) {
  if (!currentEmail) return;

  const messageBox = document.getElementById("messageContent");
  messageBox.innerText = "⏳ Loading message...";

  try {
    const res = await fetch(`/api/temp?type=message&email=${currentEmail}&messageid=${id}`);
    const data = await res.json();

    if (data && data.text) {
      messageBox.innerText = data.text;
    } else {
      messageBox.innerText = "⚠️ Message not found!";
    }
  } catch (err) {
    messageBox.innerText = "⚠️ Error loading message!";
  }
}
