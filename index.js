const TIME_AUTOMATICALLY_DELETE_PHOTO = 3; //minutes

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
let path = require("path");
const fs = require("fs");
const { clearInterval } = require("timers");
const dayjs = require("dayjs");

const execSync = require("child_process").execSync;
const spawn = require("child_process").spawn;
spawn("conda activate envs", { shell: true });
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/model1", (req, res) => {
  res.sendFile(__dirname + "/model1/index.html");
});

app.get("/model2", (req, res) => {
  res.sendFile(__dirname + "/model2/index.html");
});

app.get("/model3", (req, res) => {
  res.sendFile(__dirname + "/model3/index.html");
});

app.get("/modelX", (req, res) => {
  res.sendFile(__dirname + "/modelX/index.html");
});

const date = dayjs().format("YYYYMMDDhhmmss");

spawn("conda activate envs", { shell: true });
io.on("connection", (socket) => {
  console.log("connected");
  socket.on("sendmsg", (msg) => {
    // save image here

    try {
      var base64Data = msg.replace(/^data:image\/png;base64,/, "");
      var fileName = date + ".jpeg";
      var basePath = "./result/"; // image save path
      var cameraFileName = "cam_" + fileName;
      var aiFileName = "output_" + fileName;
      var cameraFile = basePath + cameraFileName;
      var aiFile = basePath + aiFileName;
      fs.writeFile(cameraFile, base64Data, "base64", function (err) {});

      fs.readdirSync("./result").forEach((file) => {
        const minute1 = dayjs(file.split("_")[1].split(".")[0], "format").get(
          "minute"
        );
        const minute2 = dayjs().get("minute");

        if (minute1 - minute2 >= TIME_AUTOMATICALLY_DELETE_PHOTO) {
          fs.unlinkSync(`./result/${file}`);
          console.log("remove");
        }
      });

      setTimeout(function () {
        execSync(
          "cd ./yolov7 && python main.py --input " +
            "../result/" +
            cameraFileName +
            " --output " +
            "../result/" +
            aiFileName
        );
      }, 300);
      var inte = setInterval(function () {
        if (fs.existsSync(aiFile)) {
          clearInterval(inte);
          inte = null;
          const contents = fs.readFileSync(aiFile, {
            encoding: "base64",
          });

          const infoImage = fs.readFileSync("./infomation/info.json", "utf8");

          io.emit("recivemsg", { contents, infoImage });
        }
      }, 100);

      console.log(arrPathFileImg);
    } catch (e) {}
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
