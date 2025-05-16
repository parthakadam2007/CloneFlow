let mediaRecorder;
let recordedChunks = [];

document.getElementById("start").addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true
    });

    mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm; codecs=vp8,opus'
    });

    recordedChunks = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });

      // 🟢 Upload to FastAPI server via HTTP POST
      const formData = new FormData();
      formData.append('file', blob, 'google_meet_recording.webm');

      try {
        const response = await fetch('http://127.0.0.1:8000/uploadRecording', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          alert('✅ Recording uploaded successfully!');
        } else {
          alert('❌ Upload failed');
        }
      } catch (err) {
        console.error('Upload error:', err);
        alert('❌ Could not upload the recording.');
      }

      // Optional: local download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "google_meet_recording.webm";
      a.click();
    };

    mediaRecorder.start(1000); // collect every second
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
