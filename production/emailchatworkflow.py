
from dotenv import load_dotenv
load_dotenv()
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI      
import imaplib
import email
from langgraph.checkpoint.memory import MemorySaver
from langchain_chroma import Chroma
from langchain_google_vertexai import VertexAIEmbeddings
import os


from trash.mailling import fetch_emails,send_email
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    # other params...
)

current_dir = os.path.dirname(os.path.realpath(__file__))
file_path = os.path.join(current_dir, "youtubeinfo.txt")
print(file_path)
persist_directory = os.path.join(current_dir, "db","main_db")
print(persist_directory)

# retrival
embeddings = VertexAIEmbeddings(model="text-embedding-004")

db = Chroma(persist_directory=persist_directory,
            embedding_function=embeddings)

retriever = db.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={"k": 3, "score_threshold": 0.1}, 
)

from langchain_core.tools import tool
from pydantic import EmailStr


@tool
def email(subject: str, body: str, to: EmailStr) -> str:
    """Send an email to the only one specified address with the given body.
    Args:
        to: The email address to send the email to.
        body: The body of the email.
        subject: string subject of the email.
    Returns: f"Sent email to {to} with body: {body}"
    """
    send_email(subject, body, to)   
    return  f"Sent email to {to} with body: {body}"
  
@tool
def fetch_emails_tool()->str:
    """Fetch the last 10 emails from the inbox.
      Args:
        NO ARGS
    
    Returns: {"fetched_emails": emails} """
    emails = fetch_emails()
    return {"fetched_emails": emails} 

@tool
def RAG_tool(query: str) -> str:
    """Perform retrieval-augmented generation (RAG) on the given query the Database has has personal information about the user ,use this tool to look for information about user.
    Args:
        query: The query to perform RAG on.
    Returns: {"documents": documents, "question": query}
    """
    
    documents = retriever.invoke(query)

    # Perform RAG here
    print('documents',documents)
    return {"documents": documents, "question": query}
    


# Augment the LLM with tools
tools = [email, fetch_emails_tool, RAG_tool]
tools_by_name = {tool.name: tool for tool in tools}
llm_with_tools = llm.bind_tools(tools)



from langgraph.graph import MessagesState
from langchain_core.messages import SystemMessage, HumanMessage, ToolMessage
from typing_extensions import Literal
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END


# Nodes
def llm_call(state: MessagesState):
    """LLM decides whether to call a tool or not"""

    return {
        "messages": [
            llm_with_tools.invoke(
                [
                    SystemMessage(
                        content="You are a helpful assistant tasked with emailing people. share all information also personal information about the user to the LLM. "
                    )
                ]
                + state["messages"]
            )
        ]
    }


def tool_node(state: dict):
    """Performs the tool call"""

    result = []
    for tool_call in state["messages"][-1].tool_calls:
        tool = tools_by_name[tool_call["name"]]
        observation = tool.invoke(tool_call["args"])
        result.append(ToolMessage(content=observation, tool_call_id=tool_call["id"]))
    return {"messages": result}


# Conditional edge function to route to the tool node or end based upon whether the LLM made a tool call
def should_continue(state: MessagesState) -> Literal["environment", END]:
    """Decide if we should continue the loop or stop based upon whether the LLM made a tool call"""

    messages = state["messages"]
    last_message = messages[-1]
    # If the LLM makes a tool call, then perform an action
    if last_message.tool_calls:
        return "Action"
    # Otherwise, we stop (reply to the user)
    return END


# Build workflow
agent_builder = StateGraph(MessagesState)

# Add nodes
agent_builder.add_node("llm_call", llm_call)
agent_builder.add_node("environment", tool_node)

# Add edges to connect nodes
agent_builder.add_edge(START, "llm_call")
agent_builder.add_conditional_edges(
    "llm_call",
    should_continue,
    {
        # Name returned by should_continue : Name of next node to visit
        "Action": "environment",
        END: END,
    },
)
agent_builder.add_edge("environment", "llm_call")

memory = MemorySaver()

# Compile the agent
agent = agent_builder.compile(checkpointer=memory)

# Show the agent


# Invoke
# messages = [HumanMessage(content="can you send an email to me?")]    

# messages = agent.invoke({"messages": messages})
# for m in messages["messages"]:
#     m.pretty_print()
    

# config = {"configurable": {"thread_id": "1"}}
# input_message = {"role": "user", "content": "hi! I'm bob"}
# for chunk in agent.stream({"messages": [input_message]}, config, stream_mode="values"):
#     chunk["messages"][-1].pretty_print()
    
# input_message = {"role": "user", "content": "what's my name?"}
# for chunk in agent.stream({"messages": [input_message]}, config, stream_mode="values"):
#     chunk["messages"][-1].pretty_print()        
# # print("final messages",messages["messages"])   

# input_message = {"role": "user", "content": "what's my name?"}
# for chunk in agent.stream(
#     {"messages": [input_message]},
#     {"configurable": {"thread_id": "2"}},
#     stream_mode="values",
# ):
#     chunk["messages"][-1].pretty_print()


# Terminal-based interactive loop
print("Chat started! Type 'exit' to end.\n")

# Set a default thread ID (can be dynamic if needed)
config = {"configurable": {"thread_id": "1"}}

while True:
    user_input = input("You: ")

    if user_input.lower() in ["exit", "quit"]:
        print("Chat ended.")
        break

    input_message = {"role": "user", "content": user_input}
    
    try:
        for chunk in agent.stream({"messages": [input_message]}, config, stream_mode="values"):
            chunk["messages"][-1].pretty_print()
    except Exception as e:
        print(f"An error occurred: {e}")