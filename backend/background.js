let mediaRecorder;
let recordedChunks = [];

const ws = new WebSocket("ws://localhost:8080"); // ma

document.getElementById("start").addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true
    });

    mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm; codecs=vp8,opus'
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);

        // 🟡 Send chunk via WebSocket (streaming)
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(e.data); // stream the chunk
        }
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });

      // 🟢 Optional: Send final blob again
      // ws.send(blob);

      // 🟢 Optional: Also download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "google_meet_recording.webm";
      a.click();

      recordedChunks = [];
    };

    mediaRecorder.start(1000); // send data every second
    document.getElementById("start").disabled = true;
    document.getElementById("stop").disabled = false;

  } catch (err) {
    console.error("Recording failed:", err);
    alert("Please select a screen/tab and allow audio access.");
  }
});

document.getElementById("stop").addEventListener("click", () => {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    document.getElementById("start").disabled = false;
    document.getElementById("stop").disabled = true;
  }
});
