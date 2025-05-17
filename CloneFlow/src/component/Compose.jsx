import React, { useState ,useEffect} from 'react';
import './Compose.css'
import magicIcon from '../assets/magicStick.svg'
const Compose = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

 
  const[generatedSubject,setGenratedSubject]=useState('');
  const[generatedMessage,setGeneratedMessage]=useState('');
  const[promtToMail,setGeneratedPromtToMail]= useState('');

    
  useEffect(() => {
    console.log('Updated To:', to);
    console.log('Updated Subject:', subject);
  }, [to, subject]);

  const handleSend = async (e) => {
    e.preventDefault();
    const body = message
    const emailData = {
      to,
      subject,
      body,
    };

    try {   
      const response = await fetch('http://127.0.0.1:8000/send_mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });
      if (response.ok) {
        console.log('Email sent successfully!');
      
        }
    }
 catch (error) {

      console.error('Error sending email:', error);
    }

   
 }






  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailData = {
      to,
      subject,
      message,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/compose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        const result = await response.json();
        // alert('Email sent: ' + result.status);
        console.log(result)
        setTo('');
        setSubject('');
        setMessage('');
      } else {
        const error = await response.json();
        alert('Failed to send email: ' + error.message);
      }
    } catch (err) {
      console.error(err);
      alert('Error sending email');
    }
  };
const handleGenerate=async (e)=>{
  e.preventDefault();
  const emailData = {
    to,
    subject,
    message,
    promtToMail

  };

  const generatedData={
   
    generatedSubject,
    generatedMessage,

  }
  
  try{
    const response = await fetch('http://127.0.0.1:8000/generate_compose',{
      method :'POST',
      headers:{
        'Content-Type': 'application/json',
      },
      body:JSON.stringify(emailData)
    }
    )
    const data = await response.json();
    console.log("handleGenerate",data)
    // setTo(data.to || '');
    setSubject(data.subject || '');
    setMessage(data.body || '');
    

    console.log('To',to)
    console.log('subject',subject)
    console.log('message',message)
  }
  catch(err){
console.log("error generating",err)
    
  }

}
  return (
    <div className="Compose">
     
      <div className="compose-container ">
         <div className="newMesseage">New Message</div>
        <form className='compose-form' onSubmit={handleSubmit}>
        <div className='border-bottom'>
            <input
            className='aoT border-bottom'
            type="email"
            placeholder='To:'
            id="to"
            name="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />

        </div>


<div className='border-bottom'>
  <input
          className='aoT'
            placeholder='Subject:'
            type="text"
            id="subject"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
</div>
        

          <textarea
          className='aoT'
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
          
          <div className="generate-container">
          <input
           type="text" 
           placeholder='generate' 
           className='generate-input aoT'
           onChange={(e)=>setGeneratedPromtToMail(e.target.value)} />
           <button className='generate-btn' onClick={handleGenerate}><img src={magicIcon} alt="" /></button>
          </div>
          <button className='composeSend' type="submit" onClick={handleSend}>Send</button>
        </form>
      </div>
    </div>
  );
};

export default Compose;
