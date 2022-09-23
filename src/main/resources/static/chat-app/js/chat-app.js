var ws;
var elem = document.getElementById("username");

function connect() {
    var username = elem.innerHTML;
    ws = new WebSocket("ws://" + document.location.host + "/chat/" + username);
    elem.style = "color:green";
}
function disconnect(){
    
    ws.close();
    elem.style = "color:red";
    
}

function send() {
    var content = document.getElementById("msg").value;
    var to = document.getElementById("to").value;
    var json = JSON.stringify({
        "to":to,
        "content":content
    });

    ws.send(json);
    log.innerHTML += "Me : " + content + "\n";
}