const TIME_AUTOMATICALLY_DELETE_PHOTO = 3; //minutes

const fs = require("fs");
const dayjs = require("dayjs");

const handleRemove = async (listImage, folder) => {
  listImage.forEach((file) => {
    const imageDate = file.split("_")[1].split(".")[0];
    const minuteOfDay1 = dayjs(imageDate, "format").get("date") * 1440;
    const minuteOfHour1 = dayjs(imageDate, "format").get("hour") * 60;
    const minute1 = dayjs(imageDate, "format").get("minute");
    const totalMinute1 = minuteOfDay1 + minuteOfHour1 + minute1;

    const minuteOfDay2 = dayjs().get("date") * 1440;
    const minuteOfHour2 = dayjs().get("hour") * 60;
    const minute2 = dayjs().get("minute");
    const totalMinute2 = minuteOfDay2 + minuteOfHour2 + minute2;

    if (totalMinute2 - totalMinute1 >= TIME_AUTOMATICALLY_DELETE_PHOTO) {
      fs.unlinkSync(`${folder}/${file}`);
      console.log("remove" + " " + file);
    }
  });
};

const handleMoveFile = async (fileArray, oldPath, newPath) => {
  for (let i = fileArray.length - 1; i >= 0; i--) {
    fs.rename(oldPath + fileArray[i], newPath + fileArray[i], (err) => {
      if (err) throw err;
      console.log("success!");
    });
  }
};

module.exports = {
  handleRemove,
  handleMoveFile,
};
