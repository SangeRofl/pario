let ws = new WebSocket("ws://localhost:8000/ws");
function btnClick(){
  ws.send("Tank 1");
}
ws.onmessage = function(e){
  console.log(e)
}