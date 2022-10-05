var ws;
var session = document.getElementById('unique-name');
var online = document.getElementById('online');
let active = [];
function connect() {
    var username = session.innerHTML;
    ws = new WebSocket("ws://" + document.location.host + "/chat/"+username);
    ws.onmessage = function(event){
        var activeUser = JSON.parse(event.data);
		$.ajax({
            type: "GET",
            url: "http://localhost:8080/active-users",
            data: {
                requestData:JSON.stringify(activeUser)
            },
            success: function(response){
                var activeListUser = JSON.parse(response);
                console.log(activeListUser);
            }
            
        });
	}
    
}
function disconnect() {
    ws.close();
    console.log(active);
    

}

online.addEventListener('change', (e) => {
    if (e.target.checked) {
        connect();
        
    } else {
        disconnect();
        
    }
})

function processOnline(response) {

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