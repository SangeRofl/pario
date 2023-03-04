from typing import List

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.responses import HTMLResponse
from fastapi.routing import Mount

from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

from server.game import *

from time import sleep

from threading import *
t = 0
room = Room()
testdata = [[10, 10] for i in range(10000)]
def fun():
    global t
    while True:
        time.sleep(0.01)
        t+=1
        room.update()

t1 = Thread(target=fun)
t1.start()
routes = [
    Mount('/static', StaticFiles(directory='./static'), name='static')
]

app = FastAPI(routes=routes)
templates = Jinja2Templates(directory="templates")


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, data, websocket: WebSocket):
        await websocket.send_json(data)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


manager = ConnectionManager()


@app.get("/")
async def get(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    room.add_player()
    await manager.send_personal_message({'pos': {'x': 0, 'y': 0}}, websocket)
    try:
        while True:
            await manager.send_personal_message({'pos':{'x':t, 'y':0}, 'generated': room.getUpdateInfo()}, websocket)
            sleep(0.01)
            print({'pos':{'x':t, 'y':0}, 'generated': room.getUpdateInfo()})
            # await manager.send_personal_message(f"You wrote: {data}", websocket)
            # await manager.broadcast(f"{data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)





