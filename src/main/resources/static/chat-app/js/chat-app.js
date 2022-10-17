var ws;
const session = document.getElementById('unique-name');
const online = document.getElementById('online');
const onlineUser = document.getElementById('list-user-online');
const offlineUser = document.getElementById('list-user-offline');
const refresh = document.getElementById('refresh');
const friendList = document.getElementById('friend-list');
const notFriendList = document.getElementById('not-friend-list');
const myFriends = document.getElementById('my-friends');
const notMyFriends = document.getElementById('not-my-friends');
let active = [];
let notActive = [];
let allChatUsers = [];
let allFriendsUsers = [];
var username = session.innerHTML;

////Event Listners
refresh.addEventListener('click', whoOnline);
myFriends.onclick = function (e) {
	friendList.style.transform = 'scale(1,1)'
	notFriendList.style.transform = 'scale(0,1)'
}

notMyFriends.onclick = function (e) {
	friendList.style.transform = 'scale(0,1)'
	notFriendList.style.transform = 'scale(1,1)'
}

///Init function
initialFunct();
function initialFunct(param) {

	getAllFriends(username);
	getAllChatUsers();
}

function connect() {
	ws = new WebSocket("ws://" + document.location.host + "/chat/" + username);
	ws.onmessage = function (event) {
		var activeUser = JSON.parse(event.data);
		if (activeUser.isActive == true) {
			let exist = active.some((e) => {
				return e.user_id == activeUser.user_id;
			})
			if (!exist) {
				if (parseInt(username) != activeUser.user_id) {

					active.push(activeUser)
				}
			}

		} else {
			var removeUser = active.find((e) => {
				return e.user_id == activeUser.user_id;
			})
			//console.log(removeUser);
			active.splice(active.indexOf(removeUser), 1);

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
		// onlineUser.innerHTML = "";
		// offlineUser.innerHTML = "";
		// notActive.forEach((e) => {
		// 	offlineUser.innerHTML += `<li>${e.userName}</li>`;
		// });
		active = [];

	}
});

function whoOnline() {
	//console.log(active);
	if (!active.length == 0) {

		[...friendList.children].forEach((e) => {

			e.style.background = "aqua";
		})
		active.forEach((on) => {
			var elem = [...friendList.children].find((e) => {
				return e.id == on.user_id;
			})
			if (!(elem === undefined)) {

				elem.style.background = "green";
			}
		})


	} else {
		[...friendList.children].forEach((e) => {

			e.style.background = "aqua";
		})

	}

}

//setInterval(()=>whoOnline(),2000);

function getAllChatUsers() {
	$.ajax({
		type: "GET",
		url: "/getAllChatUsers",

		success: function (responseObject) {
			allChatUsers = [...responseObject]
			responseObject.forEach((e) => {
				var result = allFriendsUsers.some((friend) => {
					return friend.user_id == e.user_id
				})
				if (!result) {
					if (e.user_id != username) {
						notFriendList.innerHTML += `<li class="list-of-no-friend border border-1 border-dark mb-1" style="background-color:red;" id="${e.user_id}">

														<div class="user-photo">
															<img src="/assets/img_avatar.png" alt="" width="45px" style="border-radius: 50%;">
														</div>
														<div class="user-detail">
															<h5 class="m-0">${e.userName}</h5>
															<p class="m-0">vybbubythbub</p>
														</div>
														<div class="user-add shadow" onclick="addFriend(event)" data-id="${e.user_id}">
															<i class="fa-solid fa-plus"></i>
														</div>
													</li>`;
					}
				}
			})
		}
	});
}

function getAllFriends(id) {
	$.ajax({
		type: "GET",
		url: "/getAllFriends",
		data: {
			requestData: id
		},
		success: function (responseObject) {
			allFriendsUsers = [...responseObject]
			if (responseObject.length != 0) {
				responseObject.forEach((e) => {
					friendList.innerHTML += `<li class="list-of-friend border border-1 border-dark mb-1" style="background-color:aqua;" id="${e.user_id}">

												<div class="user-photo">
													<img src="/assets/img_avatar.png" alt="" width="45px" style="border-radius: 50%;">
												</div>
												<div class="user-detail">
													<h5 class="m-0">${e.userName}</h5>
													<p class="m-0">vybbubythbub</p>
												</div>
												<div class="user-remove shadow" onclick="removeFriend(event)" data-id="${e.user_id}">
													<i class="fa-solid fa-x"></i>
												</div>
											</li>`;
				});
			} else {
				friendList.innerHTML = `<li class="border border-1 border-dark" style="height:40px; background-color:green;">Sorry! no friends</li>`;
			}

		}
	});
}

function addFriend(e) {
	var friendId = e.target.parentElement.getAttribute('data-id');
	$.ajax({
		type: "GET",
		url: "/makeFriends",
		data: {
			requestData:friendId
		},
		success: function (responseObject) {
			console.log(responseObject);

		}
	});
	document.getElementById(e.target.parentElement.getAttribute('data-id')).remove();

}
function removeFriend(e) {
	document.getElementById(e.target.parentElement.getAttribute('data-id')).remove();
	console.log(e)
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

function allFriends(user) {
	//$.ajax({
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
	//});


}