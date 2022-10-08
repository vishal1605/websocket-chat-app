var ws;
var session = document.getElementById('unique-name');
var online = document.getElementById('online');
var onlineUser = document.getElementById('list-user');
var refresh = document.getElementById('refresh');
refresh.addEventListener('click', whoOnline);
let active = [];
function connect() {
    var username = session.innerHTML;
    ws = new WebSocket("ws://" + document.location.host + "/chat/"+username);
    ws.onmessage = function(event){
        var activeUser = JSON.parse(event.data);
        if (activeUser.isActive==true) {
            let exist = active.some((e) => {
				return e.userName == activeUser.userName;
			})
			if (!exist) {
				if (username != activeUser.userName) {

					active.push(activeUser)
				}
			}         

        } else {
            var removeUser = active.find((e)=>{
                return e.userName == activeUser.userName;
            })
            //console.log(removeUser);
            active.splice(active.indexOf(removeUser),1);

        }
        console.log(active);
		
	}
    
}
function disconnect() {
    ws.close();
    

}

online.addEventListener('change', (e) => {
    if (e.target.checked) {
        connect();
        
    } else {
        disconnect();
        onlineUser.innerHTML = "";
		active = [];
        
    }
});

function whoOnline(params) {
	if (!active.length == 0) {
		onlineUser.innerHTML = "";
		active.forEach((e) => {
			onlineUser.innerHTML += `<li>${e.userName}</li>`;

		})


	} else {
		onlineUser.innerHTML = "";
	}

}

//setInterval(()=>whoOnline(),2000);


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