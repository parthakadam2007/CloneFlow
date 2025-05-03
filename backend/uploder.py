from dotenv import load_dotenv
load_dotenv()
from langchain_google_vertexai import VertexAIEmbeddings
from pathlib import Path
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, TextLoader, UnstructuredExcelLoader, Docx2txtLoader

import pickle
from langchain_chroma import Chroma

current_dir =Path.cwd() 
persist_directory = current_dir /'db'/ 'main_db'
persist_directory=str(persist_directory)

from langchain_google_vertexai import VertexAIEmbeddings
embeddings = VertexAIEmbeddings(model="text-embedding-004")

from langchain_chroma import Chroma

vector_store = Chroma(
    
    embedding_function=embeddings,
    persist_directory=persist_directory,  # Where to save data locally, remove if not necessary
)



def upload_Embeddings():
    """Function to process files from the 'uploads' directory and store embeddings."""
    
    # Define paths

    uploads_path = current_dir / 'uploads'
    # uploads_path =r"C://Users//DELL//Desktop//CloneFlow//backend//uploads"
    
    print("Current Directory:", current_dir)


    # Get all files in the uploads directory
    files = list(uploads_path.glob("*"))  # ✅ More robust than os.listdir()

    for f in files:
        
            ext = f.suffix.lower().lstrip('.')  # ✅ Get file extension safely

            # Load document based on file type
            if ext == 'txt':
                print(f'{f.name} ---> is a txt')
                loader = TextLoader(str(f))
            elif ext == 'pdf':
                print(f'{f.name} ---> is a pdf')
                loader = PyPDFLoader(str(f))
            elif ext == 'docx':
                print(f'{f.name} ---> is a docx')
                loader = Docx2txtLoader(str(f))
            elif ext == 'xlsx':
                print(f'{f.name} ---> is an xlsx')
                loader = UnstructuredExcelLoader(str(f))
            else:
                print(f'{f.name} ---> skipped')
                continue  

            document = loader.load()
         

            # Split the document into chunks
            text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
            docs = text_splitter.split_documents(document)

            if not docs:
                print(f"Split into {len(docs)} chunks, so skipped")
                continue

            print(f"Split into {len(docs)} chunks")

            # Generate embeddings and store in Chroma
            embeddings = VertexAIEmbeddings(model="text-embedding-004")
            vector_store= Chroma.from_documents(docs, embeddings, persist_directory=str(persist_directory))
            
   
                
            print(f'Done with embeddings for {f}')
       
            

from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI   
from langchain_core.output_parsers import StrOutputParser     
from dotenv import load_dotenv
load_dotenv()
from uuid import uuid4
import os
llm = ChatGoogleGenerativeAI(
    model='gemini-1.5-flash'
)

def json_to_txt(file_path:str):
    '''Makes json in txt format using ai if already in text  format returns the same text'''
    json_content=[]
    
    with open(file_path, 'r') as file:
        json_content = file.read()
        
    response = llm.invoke(f"You are ai whose job is express json in form of sententes:{json_content}",)
    with open(file_path, 'w') as file:
        file.write(response.content)
        
        
    print("response",response.content) 
      
def establish_relation():
          # Define paths
    user_settings = current_dir / 'user_settings' 
    
    files = list((user_settings.glob("*"))) 
    
    print("File names in user_settings:", files)
    
    uuids = [str(uuid4()) for _ in range(len(files))]  # Generate UUIDs for each file
    relationships = {}
    for i in range(len(files)):
        relationships[files[i].name] =uuids[i]
        
    print("UUIDs:", uuids)
    print("Relationships:", relationships)
    
    

user_settings = current_dir / 'user_settings' 
files = list((user_settings.glob("*"))) 
    
relationships = {}
    
    # making ids for each file
ids= [x for x in range(len(files))]
ids= [str(x) for x in ids]  # Convert to string
    
for i in range(len(files)):
     relationships[files[i].name] =ids[i]
    



def docs_list():
    from itertools import chain
    """Function to load the vector store from the database."""
        # Define paths

    user_settings = current_dir / 'user_settings' 
    files = list((user_settings.glob("*"))) 
    print([os.path.basename(f) for f in files])
    docslist = []
    
    for f in files:
        # json_to_txt(str(f))  # Convert JSON to text format
        # print(f)
        loader = TextLoader(str(f)) 
        document = loader.load()
        
        if not document:
            print(f"Split into {len(document)} chunks, so skipped")
            continue
           
        if os.path.basename(f) == 'contact.txt':
            text_splitter = CharacterTextSplitter(chunk_size=5, chunk_overlap=10)
            docs = text_splitter.split_documents(document)
            print("docs",docs)
            
            
        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
        docs = text_splitter.split_documents(document)
        docslist.append(docs)
        # print("docs",docs)
        
        
    print("docslist",docslist)    
    return list(chain.from_iterable(docslist))


def storing_user_settings():
 vector_store= Chroma.from_documents(docs_list(), embeddings, persist_directory=str(persist_directory),ids=ids)