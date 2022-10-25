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
const popUpProfileModel = document.getElementById('profile-pop-up');
const closePopUpProfileModel = document.getElementById('close-profile-model');
const profilePic = document.getElementById('form-file');
const profileDemo = document.getElementById('profile-demo');
const messageSection = document.getElementById('section-of-message');
const messageHeaderLabel = document.getElementById('message-header-label');
const submitMessage = document.getElementById('submit-message');
const messageArea = document.getElementById('message-area');

//Global variable
let active = [];
let notActive = [];
let allChatUsers = [];
let allFriendsUsers = [];
let messageArray = [];
let friend_id = 0;
var username = session.innerHTML;

////Event Listners
refresh.addEventListener('click', whoOnline);
myFriends.onclick = function (e) {
	friendList.style.transform = 'scale(1,1)'
	notFriendList.style.transform = 'scale(0,1)'
	myFriends.style.background = 'gray';
	notMyFriends.style.background = '#f76b2a';
}

notMyFriends.onclick = function (e) {
	friendList.style.transform = 'scale(0,1)'
	notFriendList.style.transform = 'scale(1,1)'
	myFriends.style.background = '#f76b2a';
	notMyFriends.style.background = 'gray';
}

///Init function
initialFunct();
function initialFunct(param) {

	getAllFriends(username);
	getAllChatUsers();
	myFriends.style.background = 'gray';
	profilePic.addEventListener('change', trackProfilePic);
	submitMessage.addEventListener('submit', preocessMessage);
}

function connect() {
	ws = new WebSocket("ws://" + document.location.host + "/chat/" + username);
	ws.onmessage = function (event) {
		var activeUser = JSON.parse(event.data);
		console.log(activeUser);
		if ('user_id' in activeUser) {
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

		} else {
			if (friend_id != activeUser.toUser.friends[0].user_id) {

				messageArray.push(activeUser.toUser.friends[0].user_id)
				console.log(messageArray);
				var count = {};
				messageArray.forEach(function (i) { count[i] = (count[i] || 0) + 1; });
				console.log(count);
				for (let key in count) {
					document.getElementById(key).children[0].textContent = count[key];
				}
			} else {

				var parentDiv = document.createElement('div');
				var childDiv = document.createElement('div');
				parentDiv.className = 'left-div';
				childDiv.className = 'left-msg';
				parentDiv.append(childDiv);
				childDiv.innerHTML = `<small class="text-light">${activeUser.content}</small>`;
				messageSection.append(parentDiv);
			}
		}


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
			console.log(elem);
			if (!(elem === undefined)) {

				elem.style.background = "green";
				var first = elem.cloneNode(true);
				elem.remove();
				friendList.prepend(first);
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
						notFriendList.innerHTML += `<li class="list-of-no-friend border border-1 border-dark mb-1" style="background-color: #fc0d05;" id="${e.user_id}">

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
					friendList.innerHTML += `<li class="list-of-friend border border-1 border-dark mb-1" style="background-color:aqua;position:relative" id="${e.user_id}">
												
												<div id="notification-logo" class="shadow" style="color:black"><span id="notification-count">0</span></div>
												<div class="user-photo">
													<img src="/assets/img_avatar.png" alt="" width="45px" style="border-radius: 50%;">
												</div>
												<div class="user-detail" onclick="showMessageOfSpecificUser(${username}, ${e.user_id}, '${e.userName}')" style="cursor:pointer">
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
		url: "/makeFriend",
		data: {
			requestData: friendId
		},
		success: function (responseObject) {
			var list = document.createElement('li');
			list.className = 'list-of-friend border border-1 border-dark mb-1';
			list.style.backgroundColor = 'aqua';
			list.id = responseObject.user_id;
			list.innerHTML = `<div class="user-photo">
								<img src="/assets/img_avatar.png" alt="" width="45px" style="border-radius: 50%;">
							  </div>
								<div class="user-detail">
									<h5 class="m-0">${responseObject.userName}</h5>
									<p class="m-0">vybbubythbub</p>
								</div>
								<div class="user-remove shadow" onclick="removeFriend(event)" data-id="${responseObject.user_id}">
									<i class="fa-solid fa-x"></i>
								</div>`;


			friendList.append(list);
		}
	});
	document.getElementById(e.target.parentElement.getAttribute('data-id')).remove();

}
function removeFriend(e) {
	var friendId = e.target.parentElement.getAttribute('data-id');
	$.ajax({
		type: "GET",
		url: "/removeFriend",
		data: {
			requestData: friendId
		},
		success: function (responseObject) {
			var list = document.createElement('li');
			list.className = 'list-of-no-friend border border-1 border-dark mb-1';
			list.style.backgroundColor = 'red';
			list.id = responseObject.user_id;
			list.innerHTML = `<div class="user-photo">
								<img src="/assets/img_avatar.png" alt="" width="45px" style="border-radius: 50%;">
							</div>
							<div class="user-detail">
								<h5 class="m-0">${responseObject.userName}</h5>
								<p class="m-0">vybbubythbub</p>
							</div>
							<div class="user-add shadow" onclick="addFriend(event)" data-id="${responseObject.user_id}">
								<i class="fa-solid fa-plus"></i>
							</div>`;

			notFriendList.append(list);

		}
	});
	document.getElementById(e.target.parentElement.getAttribute('data-id')).remove();

}
function openEditProfileModel(e) {
	popUpProfileModel.style.transform = 'scale(1,1)'
}

closePopUpProfileModel.onclick = function (e) {
	popUpProfileModel.style.transform = 'scale(0,0)'
}

function trackProfilePic(e) {
	//console.log(e.target.getAttribute('data-user_id'));
	var imgFile = e.target.files[0];
	if (imgFile.type == 'image/png' || imgFile.type == 'image/jpeg') {
		fileToArray(imgFile).then((e) => {
			var strImg = unit8ToString(e);
			//profileDemo.src = 'data:image/png;base64,' + strImg;
			console.log(strImg);
		})
		console.log(e.target.value.trim().split("\\").at(-1).trim().split(".").at(-1));
	}

}
async function fileToArray(file) {
	const buffer = await file.arrayBuffer();
	let byteArray = new Uint8Array(buffer);
	return byteArray;

}

function unit8ToString(bytes) {
	var out;
	for (let i = 0; i < bytes.length; i++) {
		out += String.fromCharCode(bytes[i]);

	}
	return out;
}

function showMessageOfSpecificUser(u_id, f_id, friendName) {
	document.getElementById(f_id).children[0].textContent = 0;
	friend_id = f_id;
	$.ajax({
		type: "GET",
		url: "/get-message",
		data: {
			requestData: JSON.stringify({ u_id, f_id })
		},

		success: function (response) {
			messageSection.innerHTML = '';
			messageHeaderLabel.innerText = friendName;
			response.sort((a, b) => {
				var date1 = new Date(a.sendDate)
				var date2 = new Date(b.sendDate)
				return date1 - date2;
			});
			response.forEach((e) => {

				var parentDiv = document.createElement('div');
				var childDiv = document.createElement('div');
				if (e.toUser.user_id == username) {
					parentDiv.className = 'left-div';
					childDiv.className = 'left-msg';
					parentDiv.append(childDiv);
					childDiv.innerHTML = `<small class="text-light">${e.content}</small>`;
					messageSection.append(parentDiv);
				} else {
					parentDiv.className = 'right-div';
					childDiv.className = 'right-msg';
					parentDiv.append(childDiv);
					childDiv.innerHTML = `<small class="text-light">${e.content}</small>`;
					messageSection.append(parentDiv);

				}

			})
		}
	});
}

function preocessMessage(e) {
	e.preventDefault();
	var formData = new FormData(e.target);
	let myMessage = formData.get('message');
	if (friend_id != 0) {
		if (online.checked) {
			ws.send(JSON.stringify({
				toUser: {
					user_id: friend_id,
					friends: [{ user_id: username }]
				},
				content: myMessage,
				sendDate: new Date().toString(),
				recievedDate: new Date().toString(),
			}));
			var parentDiv = document.createElement('div');
			var childDiv = document.createElement('div');
			parentDiv.className = 'right-div';
			childDiv.className = 'right-msg';
			parentDiv.append(childDiv);
			childDiv.innerHTML = `<small class="text-light">${myMessage}</small>`;
			messageSection.append(parentDiv);
			messageArea.value = "";
		} else {
			alert("sorry you are not online")
		}

	} else {
		alert("please select user")

	}
	$.ajax({
		type: "POST",
		url: "/send-message",
		data: {
			requestData: JSON.stringify({
				username, friend_id, myMessage
			})
		},

		success: function (response) {
			//console.log(response);
		}
	});



}


