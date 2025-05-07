import React, { useState, useRef, useEffect } from 'react';
import GiveContext from "./GiveContext.jsx"

import './Rag.css'; // Import the CSS file
import './Card.css'


const element = (
  <>
    <div>dnddsd</div>
    <div>ndnf</div>
  </>
);



function Rag() {
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
  const handleUploadContanct = async () => {
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

  const [userDetailVisible, setUserDetailVisible] = useState(false);

  function handleUserDetailVisible() {
    setUserDetailVisible(prev => !prev);
  }

  ////////////////////////////////////////////////////////////////
  //ELements
  const userinfo = (
    <div className="userDetail">
      <div className="userDetailCard" onClick={handleUserDetailVisible}>
        <div className="user-card">
          <h2 className="user-name">John Doe</h2>
          <p className="user-info"><strong>Email:</strong> john@example.com</p>
          <p className="user-info"><strong>Phone:</strong> 123-456-7890</p>
          <p className="user-info"><strong>Address:</strong> 123 Main St, Cityville</p>
        </div>
        {userDetailVisible && element}
      </div>
    </div>
  )

  const uploadDocuments = (
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
  )

  const contact = (

    <div className="contacts">
      <h1>Contacts</h1>
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
      <button id="uploadButton" onClick={handleUploadContanct}>
        Upload
      </button>
      <ul id="file-list">
        {files.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    </div>
  )
  const ragContainer=(
    
<div className="rag-container">
  <div className="userinfo-card item">
  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="grey" className="bi bi-person-lines-fill" viewBox="0 0 16 16">
  <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"/>
</svg>
    <div className=" item-heading">User info</div>
  </div>
  
  <div className="uplodeDocument-card item">
  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="grey" className="bi bi-file-earmark-arrow-up" viewBox="0 0 16 16">
  <path d="M8.5 11.5a.5.5 0 0 1-1 0V7.707L6.354 8.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 7.707z"/>
  <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
</svg>
    <div className="item-heading">Uplode Document</div>
  </div>
  
  <div className="instruction-card item">
  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="grey" className="bi bi-gear-fill" viewBox="0 0 16 16">
  <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
</svg>
    <div className="item-heading">Instruction </div>
  </div>
  
  <div className="contact-card item">
  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="grey" className="bi bi-person-rolodex" viewBox="0 0 16 16">
  <path d="M8 9.05a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
  <path d="M1 1a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h.5a.5.5 0 0 0 .5-.5.5.5 0 0 1 1 0 .5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5.5.5 0 0 1 1 0 .5.5 0 0 0 .5.5h.5a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H6.707L6 1.293A1 1 0 0 0 5.293 1zm0 1h4.293L6 2.707A1 1 0 0 0 6.707 3H15v10h-.085a1.5 1.5 0 0 0-2.4-.63C11.885 11.223 10.554 10 8 10c-2.555 0-3.886 1.224-4.514 2.37a1.5 1.5 0 0 0-2.4.63H1z"/>
</svg>
    <div className="item-heading">Contact</div>
  </div>
</div>

  )
  ///////////////////////////////////////////////////////  // 

  return (
    <div className="Rag">



<div className="rag-main-container">
{/* {ragContainer} */}
hello
</div>

      

    </div>
  );
}

export default Rag;
