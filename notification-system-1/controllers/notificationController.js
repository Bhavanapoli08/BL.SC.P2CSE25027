let notifications = [
  {
    id: 1,
    studentId: 1042,
    title: "Placement Update",
    message: "Amazon shortlisted you",
    notificationType: "Placement",
    isRead: false,
    createdAt: new Date()
  }
];

const getNotifications = (req, res) => {
  res.json({
    success: true,
    data: notifications
  });
};

const createNotification = (req, res) => {
  const newNotification = {
    id: notifications.length + 1,
    ...req.body,
    isRead: false,
    createdAt: new Date()
  };

  notifications.push(newNotification);

  res.status(201).json({
    success: true,
    data: newNotification
  });
};

const markAsRead = (req, res) => {
  const { id } = req.params;

  const notification = notifications.find(
    n => n.id == id
  );

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found"
    });
  }

  notification.isRead = true;

  res.json({
    success: true,
    data: notification
  });
};

module.exports = {
  getNotifications,
  createNotification,
  markAsRead
};