var ws;
var session = document.getElementById('unique-name');
var online = document.getElementById('online');
let active = [];
function connect() {
    var username = session.innerHTML;
    ws = new WebSocket("ws://" + document.location.host + "/chat/" + username);
    ws.onmessage = function (event) {
        var activeUser = JSON.parse(event.data);
        //console.log(activeUser);
        if (activeUser.isActive==true) {
            active.push(activeUser);            
            
        } else {
            var removeUser = active.find((e)=>{
                return e.userName == activeUser.userName;
            })
            //console.log(removeUser);
            active.splice(active.indexOf(removeUser),1);
            
        }
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/active-users",
            data: {
                requestData:JSON.stringify(active)
            },
            success: function(response){
                console.log(JSON.parse(response));
            }
            
        });
        

    };
}
function disconnect() {

    
    ws.close();
    

}

online.addEventListener('change', (e) => {
    if (e.target.checked) {
        connect();
        //console.log("connected");
    } else {
        disconnect();
        ///console.log("disconnected");
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