const { timeStamp } = require("console");
const express = require("express");
const app = express();
const fs = require("fs");
const os = require("os");
const port = 2727;
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.redirect("/tasks");
});
app.use("/tasks", (req, res, next) => {
    console.log(`Accessed /tasks at ${new Date().toISOString()} by ${os.userInfo().username}`);
    next();
  });
app.get("/tasks", (req, res) => {
  fs.readFile("tasks.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
    } const tasks = JSON.parse(data);  
    res.render('tasks', { tasks });
  });
});
app.use("/task", (req, res, next) => {
    const idq = req.query.id;
    console.log(`Accessed task ${idq} at ${new Date().toISOString()} by ${os.userInfo().username}`);
    next();
  });
app.get("/task", (req, res) => {
  const idq = req.query.id;
  if (idq) {
    const data = JSON.parse(fs.readFileSync("tasks.json", "utf-8"));
    const taskobj = data.find((task) => task.id == idq);
    if (taskobj) {
        res.render('task', { task: taskobj.task , id: taskobj.id});
    } else {
      res.send("Task not found");
    }
  } else {
    res.send("Invalid Task ID");
  }
});

  
app.use("/task", (req, res) => {
    const idq = req.query.id;
    console.log(`Accessd Tasks: ${timeStamp},${os.userInfo(),idq}`);
  });

app.get("/add-task", (req, res) => {
  res.render("addTask");
});
app.post("/add-task", (req, res) => {
  var data1 = req.body.input;
  let taskRead = JSON.parse(fs.readFileSync("tasks.json", "utf-8"));
  taskRead.push({ id: taskRead.length + 1, task: data1 });
  fs.writeFileSync("tasks.json", JSON.stringify(taskRead, null, 2));
  res.send(
    '<script>alert("Task added!"); window.location.href="/add-task";</script>'
  );
});
app.use("/add-task", (req, res) => {
  console.log(`Task Added at ${timeStamp},${os.userInfo()}`);
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
