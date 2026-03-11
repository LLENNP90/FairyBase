import requests

BASE = "http://127.0.0.1:2999/liveclientdata"
ALL_GAME = f"{BASE}/allgamedata"
ACTIVE_PLAYER = f"{BASE}/activeplayer"
PLAYER_LIST = f"{BASE}/playerlist"

# response = requests.get(ACTIVE_PLAYER, verify= False)
# attackspeed = float(response.json()['championStats']['attackSpeed'])
# print(attackspeed)
print("HEllO WORLD")