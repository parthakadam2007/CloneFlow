TOKEN = '8035589941:AAGieewkdrgC8laEIYAurQWxyEgPOHCcTgw'
CHAT_ID = '5480913700'
import requests
url = f'https://api.telegram.org/bot{TOKEN}/getUpdates'
print(requests.get(url).json())
print(url)
message = "Hello, prutives!"

url = f"https://api.telegram.org/bot{TOKEN}/sendMessage?chat_id={CHAT_ID}&text={message}"

r=requests.get(url)
print(r.json())