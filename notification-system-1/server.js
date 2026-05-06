const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();



app.use(cors());
app.use(express.json());
app.use(express.static("public"));


const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});



app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});



app.get("/api/notifications", async (req, res) => {

  try {

    const [rows] = await db.query(
      `
      SELECT * FROM notifications
      ORDER BY created_at DESC
      `
    );

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

});



app.post("/api/notifications", async (req, res) => {

  try {

    const {
      studentId,
      title,
      message,
      notificationType
    } = req.body;

    await db.query(
      `
      INSERT INTO notifications
      (
        student_id,
        title,
        message,
        notification_type
      )

      VALUES (?, ?, ?, ?)
      `,
      [
        studentId,
        title,
        message,
        notificationType
      ]
    );

    res.json({
      success: true,
      message: "Notification created successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

});



app.patch("/api/notifications/:id/read", async (req, res) => {

  try {

    const id = req.params.id;

    await db.query(
      `
      UPDATE notifications
      SET is_read = true
      WHERE id = ?
      `,
      [id]
    );

    res.json({
      success: true,
      message: "Notification marked as read"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

});



app.delete("/api/notifications/:id", async (req, res) => {

  try {

    const id = req.params.id;

    await db.query(
      `
      DELETE FROM notifications
      WHERE id = ?
      `,
      [id]
    );

    res.json({
      success: true,
      message: "Notification deleted successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

});


app.get("/api/priority-notifications", async (req, res) => {

  try {

    const [notifications] = await db.query(
      `
      SELECT * FROM notifications
      WHERE is_read = false
      `
    );

    const weights = {
      Placement: 3,
      Result: 2,
      Event: 1
    };

    const rankedNotifications = notifications.map(
      notification => {

        const ageMinutes =
          (
            Date.now()
            - new Date(notification.created_at)
          ) / 60000;

        const priorityScore =
          (
            weights[
              notification.notification_type
            ] || 0
          ) * 100000
          - ageMinutes;

        return {
          ...notification,
          priorityScore
        };

      }
    );

    rankedNotifications.sort(
      (a, b) => b.priorityScore - a.priorityScore
    );

    res.json({
      success: true,
      data: rankedNotifications.slice(0, 10)
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

});



const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});