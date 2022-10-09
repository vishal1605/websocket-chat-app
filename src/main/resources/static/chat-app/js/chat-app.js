var ws;
const session = document.getElementById('unique-name');
const online = document.getElementById('online');
const onlineUser = document.getElementById('list-user-online');
const offlineUser = document.getElementById('list-user-offline');
const refresh = document.getElementById('refresh');
refresh.addEventListener('click', whoOnline);
let active = [];
let notActive = [];
var username = session.innerHTML;
function connect() {
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
        //console.log(active);
		
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
		offlineUser.innerHTML = "";
		notActive.forEach((e)=>{
				offlineUser.innerHTML += `<li>${e.userName}</li>`; 
			});
		active = [];
        
    }
});

function whoOnline() {
	if (!active.length == 0) {
		onlineUser.innerHTML = "";
		offlineUser.innerHTML = "";
		notActive.forEach((off) => {	
			active.forEach((on)=>{
				if(on.userName==off.userName){
					onlineUser.innerHTML += `<li>${on.userName}</li>`;
				}
			})

		})
		notActive.forEach((e)=>{
			var index = active.indexOf(active.find((e1)=>{
				return e1.userName == e.userName;
			}));
			if (index===(-1)) {
				offlineUser.innerHTML += `<li>${e.userName}</li>`;
			}
		})


	} else {
		onlineUser.innerHTML = "";
	}

}

//setInterval(()=>whoOnline(),2000);

function allFriends(user){
	$.ajax({
		// type:'GET',
		// url: '/getAllFriends',
		// data:{requestData:user},
		// success: function(responseObject){
		// 	notActive = [...responseObject]
		// 	responseObject.forEach((e)=>{
		// 		offlineUser.innerHTML += `<li>${e.userName}</li>`; 
		// 	});
		// 	console.log(notActive);
			
		// }
	});
	
	
}
allFriends(username);


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