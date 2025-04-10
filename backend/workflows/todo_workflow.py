from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI      
from dotenv import load_dotenv
load_dotenv();  

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    # other params...
)

from typing_extensions import TypedDict



# Graph state
class State(TypedDict):
    meeting_text_content: str
    todolist:str
    meeting_summery:str
    
    

   
   
def generate_todolist(state:State):
       '''LLM call to generate a todolist '''
       
       msg = llm.lnvoke(f"Make an todolist for the meeting content provided :{state['meeting_text_content']}")
       
       return {"todolist",msg.content}
   
def generate_meeting_summery(state:State):
      '''LLM call to generate meeting summery from the meeting_text_content'''
    
      msg = llm.lnvoke(f"generate meeting summery from the content provided {state['meeting_text_content']}")
       
      return {"meeting_summery",msg.content}
       
       
       