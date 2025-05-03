import React, { useRef, useState, useEffect } from "react";

const FileUploader = () => {
  const dropAreaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    const dropArea = dropAreaRef.current;

    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const highlightArea = () => setHighlight(true);
    const unhighlightArea = () => setHighlight(false);

    const handleDrop = (e) => {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles(droppedFiles);
    };

    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) =>
      dropArea.addEventListener(eventName, preventDefaults)
    );
    ["dragenter", "dragover"].forEach((eventName) =>
      dropArea.addEventListener(eventName, highlightArea)
    );
    ["dragleave", "drop"].forEach((eventName) =>
      dropArea.addEventListener(eventName, unhighlightArea)
    );
    dropArea.addEventListener("drop", handleDrop);

    return () => {
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) =>
        dropArea.removeEventListener(eventName, preventDefaults)
      );
      ["dragenter", "dragover"].forEach((eventName) =>
        dropArea.removeEventListener(eventName, highlightArea)
      );
      ["dragleave", "drop"].forEach((eventName) =>
        dropArea.removeEventListener(eventName, unhighlightArea)
      );
      dropArea.removeEventListener("drop", handleDrop);
    };
  }, []);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await fetch("/uploadFiles", {
        method: "POST",
        body: formData,
      });
      const result = await response.text();
      console.log(result)
      alert("Uploaded successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container-droup">
      <h1>Upload Multiple Files</h1>
      <div
        id="drop-area"
        ref={dropAreaRef}
        className={highlight ? "highlight" : ""}
        onClick={handleClick}
        style={{
          border: "2px dashed #007bff",
          padding: "20px",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          margin: "20px",
          cursor: "pointer",
          backgroundColor: highlight ? "#e3f2fd" : "#fff",
        }}
      >
        <p>Drag & Drop files here or click to upload</p>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>
      <button id="uploadButton" onClick={handleUpload}>
        Upload
      </button>
      <ul id="file-list">
        {files.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default FileUploader;
