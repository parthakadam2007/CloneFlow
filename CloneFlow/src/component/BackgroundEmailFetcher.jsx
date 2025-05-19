// component/BackgroundEmailFetcher.jsx
import { useEffect } from 'react';

const BackgroundEmailFetcher = ({ onFetch }) => {
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/emails");
        let data = await response.json();
        data = data.sort((a, b) => b.id - a.id);
        onFetch(data);
      } catch (error) {
        console.error('Error fetching emails:', error);
      }
    };

    fetchEmails();
    const interval = setInterval(fetchEmails, 30000); // fetch every 30 seconds
    return () => clearInterval(interval);
  }, [onFetch]);

  return null; // nothing rendered
};

export default BackgroundEmailFetcher;
