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
const { handleRemove, handleMoveFile } = require("./utils");

spawn("conda activate envs", { shell: true });
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Check folder is exist
if (!fs.existsSync("./result")) {
  fs.mkdirSync("./result");
}
if (!fs.existsSync("./tmp")) {
  fs.mkdirSync("./tmp");
}

// [GET] render html

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/model1", (req, res) => {
  res.sendFile(__dirname + "/htmlFile/model1/index.html");
});

app.get("/model2", (req, res) => {
  res.sendFile(__dirname + "/htmlFile/model2/index.html");
});

app.get("/model3", (req, res) => {
  res.sendFile(__dirname + "/htmlFile/model3/index.html");
});

app.get("/modelX", (req, res) => {
  res.sendFile(__dirname + "/htmlFile/modelX/index.html");
});

app.get("/modelX", (req, res) => {
  res.sendFile(__dirname + "/htmlFile/modelX/index.html");
});

// [POST] save image

app.post("/save-image", async (req, res) => {
  const time = dayjs().format("YYYYMMDDHHmmss");
  const newPath = `./save_${time}/`;
  const tmpPath = "./tmp/";
  const resultPath = "./result/";

  fs.mkdirSync(newPath);

  const tmpFile = fs.readdirSync("./tmp");
  const resultFile = fs.readdirSync("./result");

  try {
    await handleMoveFile(tmpFile, tmpPath, newPath);
    await handleMoveFile(resultFile, resultPath, newPath);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

const removeImg = async () => {
  const inputFile = fs.readdirSync("./tmp");
  const outputFile = fs.readdirSync("./result");

  await handleRemove(inputFile, "./tmp");
  await handleRemove(outputFile, "./result");
};

spawn("conda activate envs", { shell: true });
io.on("connection", (socket) => {
  console.log("connected");
  socket.on("sendmsg", async (msg) => {
    const date = dayjs().format("YYYYMMDDHHmmss");

    await removeImg();

    try {
      const base64Data = msg.imageData.replace(/^data:image\/png;base64,/, "");
      const fileName = date + ".jpeg";
      const baseInputPath = "./tmp/"; // input image save path
      const baseOutputPath = "./result/"; // out put image save path
      const cameraFileName = "cam_" + fileName;
      const aiFileName = "output_" + fileName;
      const cameraFile = baseInputPath + cameraFileName;
      const aiFile = baseOutputPath + aiFileName;
      const modelId = ` ${msg.modelId}`;
      fs.writeFile(cameraFile, base64Data, "base64", function (err) {}); // save image here

      setTimeout(function () {
        execSync(
          "cd ./yolov7 && python main.py --input " +
            "../tmp/" +
            cameraFileName +
            " --output " +
            "../result/" +
            aiFileName +
            modelId // add model id
        );
      }, 300);
      let inte = setInterval(function () {
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
    } catch (e) {}
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
