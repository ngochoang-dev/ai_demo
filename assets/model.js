$(document).ready(function () {
  // $('#snap').click(function() {
  //     var canvas = document.getElementById("canvas");
  //     var video = document.querySelector("video");
  //     canvas.width = video.videoWidth;
  //     canvas.height = video.videoHeight;
  //     canvas.getContext("2d").drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
  //     // send msg here

  //     // canvas.toDataURL()
  // })

  var socket = io();

  setTimeout(function () {
    openCamera();
  }, 2000);

  socket.on("recivemsg", function (result) {
    //todo drag anh tai day
    $("#aiimage").attr("src", "data:image/png;base64," + result.contents);

    const info = JSON.parse(result.infoImage);

    const infoArr = Object.keys(info).map((item) => {
      return `<p class="infomation-item"><span>${item}</span> : ${info[item]}</p>`;
    });

    const infomationElm = document.querySelector("#infomation");

    if (infomationElm) {
      infomationElm.innerHTML = infoArr.join("\n");
    }

    loadCameraFinish();
  });
  function loadCameraFinish() {
    setTimeout(function () {
      // socket.emit("sendmsg", c.toDataURL());
      // thay vì gửi ảnh fix thì phải gửi ảnh camera gửi lên
      var canvas = document.getElementById("canvas");
      canvas.style.width = "520px";
      canvas.style.height = "390px";

      var video = document.querySelector("video");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      socket.emit("sendmsg", canvas.toDataURL());
    }, 2000);
  }

  function openCamera() {
    console.log("open camera");
    // Grab elements, create settings, etc.
    var video = document.getElementById("video");

    // Get access to the camera!
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Not adding `{ audio: true }` since we only want video now
      console.log(navigator.mediaDevices);
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          //video.src = window.URL.createObjectURL(stream);
          video.srcObject = stream;
          video.play();
          loadCameraFinish();
        });
    } else {
      console.log("not find camera info");
    }
  }
}); /* END ready*/
