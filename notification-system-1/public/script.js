const API_URL = "/api";



async function loadNotifications() {

  try {

    const response =
      await fetch(`${API_URL}/notifications`);

    const result = await response.json();

    const container =
      document.getElementById("notifications");

    container.innerHTML = "";

    result.data.forEach(notification => {

      const div = document.createElement("div");

      div.className =
        notification.is_read
        ? "notification read"
        : "notification";

      div.innerHTML = `
        <h3>${notification.title}</h3>

        <p>${notification.message}</p>

        <p>
          <strong>Type:</strong>
          ${notification.notification_type}
        </p>

        <button onclick="markAsRead(${notification.id})">
          Mark Read
        </button>

        <button onclick="deleteNotification(${notification.id})">
          Delete
        </button>
      `;

      container.appendChild(div);

    });

  } catch (error) {

    console.log(error);

  }

}



async function createNotification() {

  try {

    const title =
      document.getElementById("title").value;

    const message =
      document.getElementById("message").value;

    const notificationType =
      document.getElementById("type").value;

    if (!title || !message) {
      alert("Please fill all fields");
      return;
    }

    await fetch(`${API_URL}/notifications`, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        studentId: 1042,
        title,
        message,
        notificationType
      })

    });

  

    document.getElementById("title").value = "";
    document.getElementById("message").value = "";

   
    loadNotifications();

    loadPriorityNotifications();

  } catch (error) {

    console.log(error);

  }

}



async function markAsRead(id) {

  try {

    await fetch(
      `${API_URL}/notifications/${id}/read`,
      {
        method: "PATCH"
      }
    );

    loadNotifications();

    loadPriorityNotifications();

  } catch (error) {

    console.log(error);

  }

}


async function deleteNotification(id) {

  try {

    await fetch(
      `${API_URL}/notifications/${id}`,
      {
        method: "DELETE"
      }
    );

    loadNotifications();

    loadPriorityNotifications();

  } catch (error) {

    console.log(error);

  }

}


async function loadPriorityNotifications() {

  try {

    const response =
      await fetch(
        `${API_URL}/priority-notifications`
      );

    const result = await response.json();

    const container =
      document.getElementById(
        "priorityNotifications"
      );

    container.innerHTML = "";

    result.data.forEach(notification => {

      const div = document.createElement("div");

      div.className = "notification";

      div.innerHTML = `
        <h3>${notification.title}</h3>

        <p>${notification.message}</p>

        <p>
          <strong>Type:</strong>
          ${notification.notification_type}
        </p>

        <p>
          <strong>Priority Score:</strong>
          ${notification.priorityScore.toFixed(2)}
        </p>
      `;

      container.appendChild(div);

    });

  } catch (error) {

    console.log(error);

  }

}


loadNotifications();

loadPriorityNotifications();