const express = require("express");
const app = express();
const pools = require("./db");
const dotenv = require("dotenv");
const axios = require("axios");
const cors = require("cors");
const cron = require("node-cron");
const authorize = require("./middleware/authorization");
var bodyParser = require("body-parser");

//Socket
const { Server } = require("socket.io");

const io = new Server({
  cors: {
    // origin: process.env.frontSocketUrlLocal,

    origin: process.env.frontSocketUrlLive,
  },
});

//middlesware

app.use(express.json({ limit: "50mb" }));
app.use(cors());

//routes
var indexRouter = require("./routes/jwtAuth");
var enterpriseRouter = require("./services/admin/enterprise");
var departmentRouter = require("./services/admin/department");
var subscriptionRouter = require("./services/admin/subscription");
var kpi = require("./services/admin/keyPerformanceIndicator");
var addUsersToProjectRouter = require("./services/admin/addUsersToProject");

var rolePermissionsRouter = require("./services/admin/rolePermissions");
var projectRouter = require("./services/user/projects");
var userinfoRouter = require("./services/user/userinfo");
var emailRouter = require("./services/mails/email");
var documentRouter = require("./services/documents/document");
var aliasesRouter = require("./services/documents/aliases");
var notificationsRouter = require("./services/user/Notifications");
var taskRouter = require("./services/tasks/tasks");
var accountRouter = require("./services/user/account");
var coverPageRouter = require("./services/documents/coverPage");
var recentDocumentsRouter = require("./services/documents/recentDocuments");
var CommentRouter = require("./services/tasks/comment");
var awsRouter = require("./services/adminApp/Aws");
var awsSalesRouter = require("./services/adminApp/sales");
var AdminAppProjectRouter = require("./services/adminApp/AdminAppProject");
var ProjectDelaysRouter = require("./services/adminApp/ProjectDelays");
var FolderRouter = require("./services/documents/documentFolder");
var emailRouterAws = require("./services/mails/emailAws");
var documentLinkingRouter = require("./services/documents/documentLinking");
var tagsRouter = require("./services/documents/tags");

app.use("/Auth", indexRouter);
app.use("/Enterprise", enterpriseRouter);
app.use("/Department", departmentRouter);
app.use("/Subcription", subscriptionRouter);
app.use("/RolePermissions", rolePermissionsRouter);
app.use("/Project", projectRouter);
app.use("/Tasks", taskRouter);
app.use("/Userinfo", userinfoRouter);
app.use("/Email", emailRouter);
app.use("/Document", documentRouter);
app.use("/Alias", aliasesRouter);
app.use("/Notification", notificationsRouter);
app.use("/Accounts", accountRouter);
app.use("/AddUsersToProject", addUsersToProjectRouter);
app.use("/kpi", kpi);
app.use("/CoverPage", coverPageRouter);
app.use("/aws", awsRouter);
app.use("/sales", awsSalesRouter);
app.use("/AdminAppProject", AdminAppProjectRouter);
app.use("/ProjectDelays", ProjectDelaysRouter);
app.use("/RecentDocuments", recentDocumentsRouter);
app.use("/folder", FolderRouter);
app.use("/AwsEmail", emailRouterAws);
app.use("/documentLinking", documentLinkingRouter);
app.use("/tags", tagsRouter);

app.use("/Comment", CommentRouter);

// app.use()

app.get("/", authorize, async (req, res) => {
  const pools2 = await pools.getPool();
  const DatasetsInDbQuery = await pools2.query("SELECT * FROM users");
  DatasetsInDb = DatasetsInDbQuery.rows;
  res.json(DatasetsInDb);
});

// Socket fuctions

const addNewUser = async (NewUser, socketId) => {
  const pools2 = await pools.getPool();
  console.log("newUser", NewUser.user_id);
  const DatasetsInDbQuery = await pools2.query(
    "SELECT * FROM online_users WHERE user_id='" + NewUser.user_id + "'"
  );
  DatasetsInDb = DatasetsInDbQuery.rows;
  if (!DatasetsInDb.length) {
    const DatasetsInDbQuery2 = await pools2.query(
      "INSERT INTO online_users(user_id,socket_id) VALUES($1,$2)",
      [NewUser.user_id, socketId]
    );
  } else {
    const DatasetsInDbQuery3 = await pools2.query(
      "UPDATE online_users SET socket_id ='" +
        socketId +
        "' WHERE user_id='" +
        NewUser.user_id +
        "'"
    );
  }
  // !onlineUsers.some((user) => user.user_id === NewUser.user_id) &&
  //   onlineUsers.push({ user: NewUser, socketId });
};

const removeUser = async (socketId) => {
  const pools2 = await pools.getPool();
  const DatasetsInDbQuery4 = await pools2.query(
    "DELETE FROM online_users WHERE socket_id ='" + socketId + "'"
  );
  // onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = async (TargetUser) => {
  const pools2 = await pools.getPool();
  const DatasetsInDbQuery = await pools2.query(
    "SELECT * FROM online_users WHERE user_id='" + TargetUser.user_id + "'"
  );
  DatasetsInDb = DatasetsInDbQuery.rows[0];
  return DatasetsInDb;
  // return onlineUsers.find((user) => user.user.user_id == TargetUser.user_id);
};

try {
  io.on("connection", (socket) => {
    socket.on("newUser", (user) => {
      console.log(
        "new connection with socket id",
        user.username + " : " + socket.id
      );
      console.log("typeof", typeof socket.id);
      addNewUser(user, socket.id);
    });

    socket.on("sendNotification", async ({ sender, receivers, type }) => {
      console.log("sender", sender);
      console.log("recievers", receivers);
      await receivers.forEach(async (reciever) => {
        const aReceiver = await getUser(reciever);
        console.log("receiver", aReceiver);
        if (typeof aReceiver != "undefined") {
          io.to(aReceiver.socket_id).emit("getNotification", {
            sender,
          });
        }
      });
    });

    socket.on("sendText", ({ sender_id, receiver_id, text }) => {
      const receiver = getUser(receiver_id);
      io.to(receiver.socketId).emit("getText", {
        sender_id,
        text,
      });
    });
    io.on("error", () => {
      socket.emit("my error", "Something bad happened!");
    });
    socket.on("disconnect", () => {
      console.log("disconnected");
      removeUser(socket.id);
    });
  });
} catch (error) {
  console.error(error.message);
  res.status(500).send("Server error");
}

// cron.schedule(`30 7 * * *`, async () => {
//   console.log("chrone job lunninggg");
//   const pools2 = await pools.getPool();
//   const tasks = await pools2.query(
//     "select task_deadline from task WHERE deadline = now() - 1 "
//   );
//   console.log("tasks", tasks.rows);
// }, {
//   scheduled: true,
//   timezone: "Asia/Dubai"
// });
const getUserCron = async (TargetUser) => {
  const pools2 = await pools.getPool();
  const DatasetsInDbQuery = await pools2.query(
    "SELECT * FROM online_users WHERE user_id='" + TargetUser + "'"
  );
  DatasetsInDb = DatasetsInDbQuery.rows[0];
  return DatasetsInDb;
  // return onlineUsers.find((user) => user.user.user_id == TargetUser.user_id);
};
cron.schedule(
  `55 7 * * *`,
  async () => {
    console.log("chrone job lunninggg");
    try {
      const pools2 = await pools.getPool();
      const tasks = await pools2.query(
        "select task.task_id, task_name,task_deadline,user_task.user_id task from task  JOIN user_task on task.task_id = user_task.task_id   WHERE task_deadline BETWEEN  NOW() AND NOW() + INTERVAL '30 HOURS'"
      );

      console.log("recievers", tasks.rows);
      tasks.rows.forEach(async (reciever) => {
        const aReceiver = await getUserCron(reciever.task);
        console.log("receiver", aReceiver);
        if (typeof aReceiver != "undefined") {
          io.to(aReceiver.socket_id).emit("getNotification", {
            sender: "Hi",
          });

          try {
            await pools2.query("BEGIN");
            const DatasetsInDbQuery = await pools2.query(
              "INSERT INTO notifications(message,user_id,initiators_id,initiators_name,initiated_time,notification_status,task_id,type,is_deadline_remainder) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)",
              [
                `${reciever.task_name}`,
                reciever.task,
                "4",
                "Remainder",
                "now()",
                "NotRead",
                reciever.task_id,

                "Task",
                true,
              ]
            );

            const DatasetsInDbQuery2 = await pools2.query(
              "UPDATE users SET number_of_notifications = number_of_notifications+1 WHERE user_id='" +
                reciever.task +
                "' returning number_of_notifications"
            );
            await pools2.query("COMMIT");
          } catch (error) {
            console.log(error);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Dubai",
  }
);

io.listen(5001);

app.listen(5000, () => {
  console.log("server listening on port 5000");
});
