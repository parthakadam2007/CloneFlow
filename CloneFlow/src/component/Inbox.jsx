import React, { useEffect, useState } from 'react';
import './Inbox.css';

function stripHtml(html) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
}

const Inbox = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [replyVisible, setReplyVisible] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/emails");
      let data = await response.json();
      data = data.sort((a, b) => b.id - a.id);
      setEmails(data);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  const showEmailDetail = (email) => {
    setSelectedEmail({ ...email, read: true });
    setReplyVisible(false);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    const senderEmail = document.querySelector('.reply-header').value;
    const userInput = document.querySelector('.reply-textarea').value;
    const subject = document.querySelector('.sub-add').value;

    try {
      const res = await fetch("http://127.0.0.1:8000/send_mail", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: senderEmail, body: userInput, sub: subject }),
      });

      const data = await res.json();
      if (data) {
        setResponseMessage('✅ Email sent successfully!');
      } else {
        setResponseMessage(`❌ Failed to send email: ${data.error}`);
      }
    } catch (err) {
        console.log(err)
      setResponseMessage('❌ Something went wrong!');
    }
  };

  const generateReply = async () => {
    const emailBody = document.querySelector('.email-content-body').innerText;
    const senderEmail = document.querySelector('.reply-header').value;
    const userInput = document.querySelector('.reply-textarea').value;

    try {
      const response = await fetch("http://127.0.0.1:8000/generate_reply", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailBody, sender_email: senderEmail, emailTime: 11, user_input: userInput }),
      });

      const data = await response.json();
      if (data) {
        document.querySelector('.reply-textarea').value = data.body;
        document.querySelector('.sub-add').value = data.subject;
      } else {
        document.querySelector('.reply-textarea').value = 'Error generating response.';
      }
    } catch (error) {
      console.error('Error generating reply:', error.message);
    }
  };

  return (
    <main className="main-content">
      {/* Email List */}
      <div className="email-list">
        <h2 className="section-title">Inbox</h2>
        <div className="email-items">
          {emails.map(email => (
            <div
              key={email.id}
              className={`email-item ${!email.read ? 'unread' : ''}`}
              onClick={() => showEmailDetail(email)}
            >
              <div className="email-item-header">
                <span className="email-from">{email.from}</span>
                <span className="email-date">{email.date}</span>
              </div>
              <div className="email-subject">{email.subject}</div>
              <div className="email-preview">{stripHtml(email.body)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Detail */}
      <div className="email-detail">
        {!selectedEmail ? (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-6l-2 3h-4l-2-3H2"></path>
              <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
            </svg>
            <p>Select an email to read</p>
          </div>
        ) : (
          <div className="email-content">
            <div className="email-content-header">
              <h1 className="email-content-subject">{selectedEmail.subject}</h1>
              <div className="email-content-meta">
                <span>{selectedEmail.from}</span>
                <span>{selectedEmail.date}</span>
              </div>
            </div>
            <div className="email-content-body" dangerouslySetInnerHTML={{ __html: selectedEmail.body.replace(/\n/g, '<br>') }} />

            <button className="reply-button" onClick={() => setReplyVisible(!replyVisible)}>
              Reply
            </button>

            {replyVisible && (
              <div className="reply-window">
                <form onSubmit={handleSendReply}>
                  <input className="reply-header" type="email" defaultValue={selectedEmail.sender_email} placeholder="Enter email" required />
                  <input className="sub-add" type="text" placeholder="Enter subject" required />
                  <textarea className="reply-textarea" placeholder="Write your reply here..." required></textarea>
                  <div className="reply-actions">
                    <button type="button" className="reply-cancel" onClick={() => setReplyVisible(false)}>Cancel</button>
                    <button type="button" className="generate-reply" onClick={generateReply}>Generate Reply</button>
                    <button type="submit" className="reply-send">Send Reply</button>
                  </div>
                </form>
                {responseMessage && (
                  <div id="responseMessage">{responseMessage}</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Inbox;
