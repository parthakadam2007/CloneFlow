from google import genai

client = genai.Client(api_key="AIzaSyBVcVdaE1qCdpONTHd2LS-6Tcz3vu65zww")

myfile = client.files.upload(file=r"C://Users//DELL//Desktop//CloneFlow//production//Recording.m4a")

response = client.models.generate_content(
    model="gemini-2.0-flash", contents=["Describe this audio clip", myfile]
)

print(response.text)