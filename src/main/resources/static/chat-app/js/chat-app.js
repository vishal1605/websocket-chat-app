var ws;
var session = document.getElementById('unique-name');
var online = document.getElementById('online');
function connect() {
    var username = session.innerHTML;
    ws = new WebSocket("ws://" + document.location.host + "/chat/" + username);
}
function disconnect(){
    ws.close(); 
    
}

online.onchange = function(e){
    if (e.target.checked) {
        connect();
        
        
    } else {
        disconnect();
    }

}


// function send() {
//     var content = document.getElementById("msg").value;
//     var to = document.getElementById("to").value;
//     var json = JSON.stringify({
//         "to":to,
//         "content":content
//     });

//     ws.send(json);
//     log.innerHTML += "Me : " + content + "\n";
// }