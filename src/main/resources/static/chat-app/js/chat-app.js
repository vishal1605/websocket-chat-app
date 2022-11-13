///Global Dom//////////////////////////////////////////
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
const profileMoreOptions = document.getElementById('profile-more-options');
const moreOptions = document.getElementById('more-option');
const alertMsg = document.getElementById('alert-msg');
const submitProfilePicBtn = document.getElementById('submit-profile-pic');
const myProfilePic = document.getElementById('profile-pic');
const msgHeaderProfilePic = document.getElementById('message-header-profile-pic');
const fileToSendAsChat = document.getElementById('send-file');

//Global variable
let active = [];
let notActive = [];
let allChatUsers = [];
let allFriendsUsers = [];
let messageArray = [];
let globalDate = [];
let friend_id = 0;
var username = session.innerHTML;

////Event Listners
refresh.addEventListener('click', whoOnline);
myFriends.onclick = function(e) {
	friendList.style.transform = 'scale(1,1)'
	notFriendList.style.transform = 'scale(0,1)'
	myFriends.style.background = 'gray';
	notMyFriends.style.background = '#f76b2a';
}

notMyFriends.onclick = function(e) {
	friendList.style.transform = 'scale(0,1)'
	notFriendList.style.transform = 'scale(1,1)'
	myFriends.style.background = '#f76b2a';
	notMyFriends.style.background = 'gray';
}

///Init function
initialFunct();
function initialFunct() {

	getAllFriends(username);
	myFriends.style.background = 'gray';
	getMyProfilePicture();
	profilePic.addEventListener('change', trackProfilePic);
	submitMessage.addEventListener('submit', preocessMessage);
	profileMoreOptions.addEventListener('click', openMoreOptions);
	submitProfilePicBtn.addEventListener('click', submitProfilePic)
	fileToSendAsChat.addEventListener('change', trackFileToBeSendInChat)
}
///////////////////////////////Fetch Logged in User Profile/////////////////////////////////////
function getMyProfilePicture() {
	$.ajax({
		type: "GET",
		url: "/get-profile-pic",
		data: {
			requestData: username
		},
		success: function(responseObject) {
			if (responseObject == "") {
			} else {
				console.log("Not empty");
				myProfilePic.src = 'data:image/png;base64,' + responseObject;
			}
		}

	});
}

///////////////////////////////////////Connect To Websocket connection Or Take user to online/////////////////////////////
function connect() {
	ws = new WebSocket("ws://" + document.location.host + "/chat/" + username);
	ws.onmessage = function(event) {
		var activeUser = JSON.parse(event.data);
		//console.log(activeUser);
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
				//console.log(messageArray);
				var count = {};
				messageArray.forEach(function(i) { count[i] = (count[i] || 0) + 1; });
				//console.log(count);
				for (let key in count) {
					document.getElementById(key).children[0].textContent = count[key];
					document.getElementById(key).children[0].style.display = 'block';
					document.getElementById(key).children[2].children[1].innerText = activeUser.content.substring(0, 10) + '...';
					document.getElementById(key).children[3].children[0].innerText = moment(activeUser.sendDate).format('h:mm a');

				}
			} else {
				var labelTime = new Date();
				console.log(globalDate);
				if (globalDate.indexOf(moment(labelTime).format("DD/MM/YYYY")) == -1) {

					globalDate.push(moment(labelTime).format("DD/MM/YYYY"))
					var dateTimeStamp = document.createElement('div');
					dateTimeStamp.className = 'd-flex align-items-center justify-content-center';
					dateTimeStamp.innerHTML = `<h6 style="background-color: #e3dede;color:white;border-radius: 10px;padding:1px 2px">Today</h6>`;
					messageSection.append(dateTimeStamp)
				}
				var parentDiv = document.createElement('div');
				var childDiv = document.createElement('div');
				var timeLabel = document.createElement('label');
				parentDiv.className = 'left-div';
				childDiv.className = 'left-msg'; timeLabel.className = 'left-time';
				timeLabel.innerText = `${labelTime.getHours()}:${labelTime.getMinutes()}`;
				parentDiv.append(timeLabel);

				parentDiv.append(childDiv);
				childDiv.innerHTML = `<small class="text-light">${activeUser.content}</small>`;
				messageSection.append(parentDiv);
			}
		}


		// whoOnline();
	}

}

//////////////////////////////Disconnected User from websocket connection/////////////////////////////////////
function disconnect() {
	ws.close();


}

//////////////////////////////////Toggle User to Online OR Offline/////////////////////////////////////////
online.addEventListener('change', (e) => {
	if (e.target.checked) {
		connect();

	} else {
		disconnect();
		active = [];

	}
});

//////////////////////////////////// Check User Which Friend is online////////////////////////////////////////////
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
			//console.log(elem);
			if (!(elem === undefined)) {

				elem.style.background = "green";
				var first = elem.cloneNode(true);
				elem.remove();
				friendList.prepend(first);
			}
		})


	} else {
		[...friendList.children].forEach((e) => {

			if (e.id != "no-friends-list") {
				e.style.background = "aqua";
			}
		})

	}

}

//setInterval(()=>whoOnline(),2000);

////////////////////////////////////////Get All Chat User Who is registered with this chat-app///////////////////////////////////
function getAllChatUsers() {
	$.ajax({
		type: "GET",
		url: "/getAllChatUsers",

		success: function(responseObject) {
			allChatUsers = [...responseObject]
			responseObject.forEach((e) => {
				var result = allFriendsUsers.some((friend) => {
					return friend.user_id == e.user_id
				})
				if (!result) {
					if (e.user_id != username) {
						notFriendList.innerHTML += `<li class="list-of-no-friend border border-1 border-dark mb-1" style="background-color: #fc0d05;" id="${e.user_id}">

														<div class="user-photo">
															<img src="${(e.profile_img == null) ? '/assets/img_avatar.png' : 'data:image/png;base64,' + e.profile_img}" alt="" width="45px" height="45px" style="border-radius: 50%;">
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

///////////////////////////////////////Get All Your friends In FriendList///////////////////////////////////////////////
function getAllFriends(id) {
	$.ajax({
		type: "GET",
		url: "/getAllFriends",
		data: {
			requestData: id
		},
		success: function(responseObject) {
			allFriendsUsers = [...responseObject]
			if (responseObject.length != 0) {
				responseObject.forEach((e) => {
					friendList.innerHTML += `<li class="list-of-friend border border-1 border-dark mb-1" onclick="showMessageOfSpecificUser(${username}, ${e.user_id}, '${e.userName}',this)"
							 style="background-color:aqua;position:relative;cursor:pointer" id="${e.user_id}">
												
												<div id="notification-logo" class="shadow" style="color:black"><span id="notification-count">0</span></div>
												<div class="user-photo">
													<img src="${(e.profile_img == null) ? '/assets/img_avatar.png' : 'data:image/png;base64,' + e.profile_img}" alt="" width="45px" height="45px" style="border-radius: 50%;">
												</div>
												<div class="user-detail">
													<h6 class="m-0">${e.userName}</h6>
													<small class="m-0" style="font-size:13px">no msg</small>
												</div>
												<div class="last-time">
													<small>3:45</small>
												</div>
											</li>`;
				});
				let modifiedFriendList = responseObject.map((u) => ({ ...u, profile_img: null }));
				$.ajax({
					type: "GET",
					url: "/get-last-message",
					data: {
						requestData: JSON.stringify(modifiedFriendList),
						myId: id
					}
					,
					success: function(lastMessages) {
						lastMessages.forEach((e) => {
							var sendDate = new Date(e.sendDate);
							if (+sendDate.getDate() === +new Date().getDate()) {

								document.getElementById(e.toUser.user_id).children[3].children[0].innerText = `${moment(sendDate).format("h:mm a")}`;
							} else {
								document.getElementById(e.toUser.user_id).children[3].children[0].innerText = `${moment(sendDate).format("DD/MM/YY")}`;
							}
							document.getElementById(e.toUser.user_id).children[2].children[1].innerText = e.content.substring(0, 10) + "...";
						})


					}

				});

				document.querySelectorAll('#notification-logo').forEach(e => e.style.display = 'none');

			} else {
				friendList.innerHTML = `<li class="border border-1 border-dark" id="no-friends-list" style="height:40px; background-color:green;">Sorry! no friends</li>`;
			}
			getAllChatUsers();


		}
	});
}

////////////////////////////////////////// Add More Friends In Your Friend List///////////////////////////////////////////
function addFriend(e) {
	if (document.getElementById('no-friends-list') != null) {
		document.getElementById('no-friends-list').remove()
	}
	var friendId = e.target.parentElement.getAttribute('data-id');
	$.ajax({
		type: "GET",
		url: "/makeFriend",
		data: {
			requestData: friendId
		},
		success: function(responseObject) {
			var list = document.createElement('li');
			list.className = 'list-of-friend border border-1 border-dark mb-1';
			list.style.backgroundColor = 'aqua';
			list.style.position = 'relative';
			list.style.cursor = 'pointer'
			list.setAttribute('onclick', `showMessageOfSpecificUser(${username},${responseObject.user_id},'${responseObject.userName}', this)`)
			list.id = responseObject.user_id;
			list.innerHTML = `<div id="notification-logo" class="shadow" style="color:black"><span id="notification-count">0</span></div>
							  <div class="user-photo">
								<img src="${(responseObject.profile_img == null) ? '/assets/img_avatar.png' : 'data:image/png;base64,' + responseObject.profile_img}" alt="" width="45px" height="45px" style="border-radius: 50%;">
							  </div>
								<div class="user-detail">
									<h6 class="m-0">${responseObject.userName}</h6>
									<small class="m-0" style="font-size:13px">no msg</small>
								</div>
								<div class="last-time">
									<small>3:45</small>
								</div>
								`;


			friendList.append(list);
			document.querySelectorAll('#notification-logo').forEach(e => e.style.display = 'none')
		}
	});
	//console.log(list);

	document.getElementById(e.target.parentElement.getAttribute('data-id')).remove();

}

//////////////////////////////////////////////Remove Your Friend From Friend List OR Unfriend///////////////////////////////////////
function removeFriend(e) {
	var friendId = e.target.getAttribute('data-id');
	messageSection.innerHTML = '';
	messageHeaderLabel.innerText = '';
	profileMoreOptions.innerHTML = ``;
	msgHeaderProfilePic.src = "/assets/img_avatar.png"
	moreOptions.children[0].removeAttribute('data-id');
	moreOptions.children[0].removeEventListener('click', removeFriend)
	moreOptions.style.transform = 'scale(0,0)';
	friend_id = 0;
	$.ajax({
		type: "GET",
		url: "/removeFriend",
		data: {
			requestData: friendId
		},
		success: function(responseObject) {
			var list = document.createElement('li');
			list.className = 'list-of-no-friend border border-1 border-dark mb-1';
			list.style.backgroundColor = 'red';
			list.id = responseObject.user_id;
			list.innerHTML = `<div class="user-photo">
								<img src="${(responseObject.profile_img == null) ? '/assets/img_avatar.png' : 'data:image/png;base64,' + responseObject.profile_img}" alt="" width="45px" height="45px" style="border-radius: 50%;">
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
	document.getElementById(friendId).remove();
	if (friendList.innerHTML == "") {
		friendList.innerHTML = `<li class="border border-1 border-dark" id="no-friends-list" style="height:40px; background-color:green;">Sorry! no friends</li>`;
	}

}

////////////////////////////////////////////////Open Model for Update Your Profile pic ////////////////////////////////////////////////
function openEditProfileModel(e) {
	popUpProfileModel.style.transform = 'scale(1,1)'
}

////////////////////////////////////////////////Close Model for Update Your Profile pic ////////////////////////////////////////////////
closePopUpProfileModel.onclick = function(e) {
	popUpProfileModel.style.transform = 'scale(0,0)'
	profilePic.value = '';
	if (alertMsg.classList.contains('show')) {
		alertMsg.classList.remove('show');
	}
	if (profileDemo.classList.contains('show')) {
		profileDemo.classList.remove('show');
	}
	submitProfilePicBtn.setAttribute('disabled', 'disabled');
}

////////////////////////////////////Check Selected File For upload is Image or not/////////////////////////////////////////////////
function trackProfilePic(e) {

	var imgFile = e.target.files[0];
	if (imgFile.type == 'image/png' || imgFile.type == 'image/jpeg') {
		fileTobyte(imgFile).then((e) => {
			var base64 = btoa(uint8ToString(e))
			profileDemo.src = 'data:image/png;base64,' + base64;
			profileDemo.classList.add('show');
			submitProfilePicBtn.removeAttribute('disabled');

		})

		// console.log(e.target.value.trim().split("\\").at(-1).trim().split(".").at(-1));
		alertMsg.classList.remove('show')
	} else {
		alertMsg.classList.add('show')
	}

}
async function fileTobyte(file) {
	let arrayFile = await file.arrayBuffer();
	let bytes = new Uint8Array(arrayFile);
	return bytes;
}
function uint8ToString(buf) {
	var i, length, out = '';
	for (i = 0, length = buf.length; i < length; i += 1) {
		out += String.fromCharCode(buf[i]);
	}
	return out;
}

//////////////////////////////////////Updating Your Profile Picture//////////////////////////////////////////////////////////
function submitProfilePic() {
	let formData = new FormData();
	formData.append("file", profilePic.files[0]);
	$.ajax({
		type: "POST",
		url: "/upload-profile-pic",
		contentType: false,
		processData: false,
		data: formData,
		success: function(response) {
			myProfilePic.src = 'data:image/png;base64,' + response;

		}
	});

	profilePic.value = '';
	profileDemo.classList.remove('show');
	submitProfilePicBtn.setAttribute('disabled', 'disabled');

}

////////////////////////////////////////////Show Your Specfic Friend Older Chat with You & Start more Chat///////////////////////////
function showMessageOfSpecificUser(u_id, f_id, friendName, element) {
	//console.log(element.children[1].children[0].src);
	var zro = messageArray.filter(e => e == f_id);
	zro.forEach(e => messageArray.splice(messageArray.indexOf(e), 1))
	document.getElementById(f_id).children[0].textContent = 0;
	document.getElementById(f_id).children[0].style.display = 'none';
	friend_id = f_id;
	var storeDate = [];
	$.ajax({
		type: "GET",
		url: "/get-message",
		data: {
			requestData: JSON.stringify({ u_id, f_id })
		},

		success: function(response) {
			if (response.length !== 0) {
				var showDate = new Date();
				if (globalDate.indexOf(moment(showDate).format("DD/MM/YYYY")) == -1) {
					globalDate.push(moment(showDate).format("DD/MM/YYYY"))
				}
			}
			messageSection.innerHTML = '';
			msgHeaderProfilePic.src = element.children[1].children[0].src;
			messageHeaderLabel.innerText = friendName;
			profileMoreOptions.innerHTML = `<i class="fa-solid fa-ellipsis-vertical"></i>`;
			moreOptions.children[0].setAttribute("data-id", f_id);
			moreOptions.children[0].addEventListener('click', removeFriend)
			response.sort((a, b) => {
				var date1 = new Date(a.sendDate)
				var date2 = new Date(b.sendDate)
				return date1 - date2;
			});

			response.forEach((e) => {
				var labelTime = new Date(e.sendDate)
				var parentDiv = document.createElement('div');
				var childDiv = document.createElement('div');
				var timeLabel = document.createElement('label');
				if (e.toUser.user_id == username) {
					if (!(moment(moment(labelTime).format("DD/MM/YYYY")).isSame(moment(moment(new Date()).format("DD/MM/YYYY"))))) {
						if (storeDate.indexOf(moment(labelTime).format("DD/MM/YYYY")) == -1) {
							storeDate.push(moment(labelTime).format("DD/MM/YYYY"))
							var dateTimeStamp = document.createElement('div');
							dateTimeStamp.className = 'd-flex align-items-center justify-content-center';
							dateTimeStamp.innerHTML = `<h6 style="background-color: #e3dede;color:white;border-radius: 10px;padding:1px 2px">${moment(labelTime).format("DD/MM/YYYY")}</h6>`;
							messageSection.append(dateTimeStamp)
						}

					} else {
						if (storeDate.indexOf(moment(labelTime).format("DD/MM/YYYY")) == -1) {
							storeDate.push(moment(labelTime).format("DD/MM/YYYY"));
							var dateTimeStamp = document.createElement('div');
							dateTimeStamp.className = 'd-flex align-items-center justify-content-center';
							dateTimeStamp.innerHTML = `<h6 style="background-color: #e3dede;color:white;border-radius: 10px;padding:1px 2px">Today</h6>`;
							messageSection.append(dateTimeStamp)
						}
					}
					parentDiv.className = 'left-div';
					childDiv.className = 'left-msg';
					timeLabel.className = 'left-time';
					timeLabel.innerText = `${moment(labelTime).format("h:mm")}`;
					parentDiv.append(timeLabel);
					parentDiv.append(childDiv);
					childDiv.innerHTML = `<small class="text-light">${e.content}</small>`;
					messageSection.append(parentDiv);

				} else {
					if (!(moment(moment(labelTime).format("DD/MM/YYYY")).isSame(moment(moment(new Date()).format("DD/MM/YYYY"))))) {
						if (storeDate.indexOf(moment(labelTime).format("DD/MM/YYYY")) == -1) {

							storeDate.push(moment(labelTime).format("DD/MM/YYYY"))
							var dateTimeStamp = document.createElement('div');
							dateTimeStamp.className = 'd-flex align-items-center justify-content-center';
							dateTimeStamp.innerHTML = `<h6 style="background-color: #e3dede;color:white;border-radius: 10px;padding:1px 2px">${moment(labelTime).format("DD/MM/YYYY")}</h6>`;
							messageSection.append(dateTimeStamp)
						}
					} else {
						if (storeDate.indexOf(moment(labelTime).format("DD/MM/YYYY")) == -1) {
							storeDate.push(moment(labelTime).format("DD/MM/YYYY"))
							var dateTimeStamp = document.createElement('div');
							dateTimeStamp.className = 'd-flex align-items-center justify-content-center';
							dateTimeStamp.innerHTML = `<h6 style="background-color: #e3dede;color:white;border-radius: 10px;padding:1px 2px">Today</h6>`;
							messageSection.append(dateTimeStamp)
						}
					}
					parentDiv.className = 'right-div';
					childDiv.className = 'right-msg';
					timeLabel.className = 'right-time';
					timeLabel.innerText = `${moment(labelTime).format("h:mm")}`;
					parentDiv.append(timeLabel);
					parentDiv.append(childDiv);
					childDiv.innerHTML = `<small class="text-light">${e.content}</small>`;
					messageSection.append(parentDiv);


				}

			});
			//console.log(storeDate);
			// while (storeDate.length > 0) {
			// 	storeDate.pop();
			// }

		}
	});
}


//////////////////////////////////////////Send Message To Your Friend////////////////////////////////////////////////////
function preocessMessage(e) {
	e.preventDefault();
	var storeDate = [];
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
			var timeLabel = document.createElement('label');
			var labelTime = new Date()
			if (globalDate.indexOf(moment(labelTime).format("DD/MM/YYYY")) == -1) {

				globalDate.push(moment(labelTime).format("DD/MM/YYYY"))
				var dateTimeStamp = document.createElement('div');
				dateTimeStamp.className = 'd-flex align-items-center justify-content-center';
				dateTimeStamp.innerHTML = `<h6 style="background-color: #e3dede;color:white;border-radius: 10px;padding:1px 2px">Today</h6>`;
				messageSection.append(dateTimeStamp)
			}
			parentDiv.className = 'right-div';
			childDiv.className = 'right-msg';
			timeLabel.className = 'right-time';
			timeLabel.innerText = `${labelTime.getHours()}:${labelTime.getMinutes()}`;
			parentDiv.append(timeLabel);
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

		success: function(response) {
			//console.log(response);
		}
	});


}

///////////////////////////////////////////////Select Specfic Friend of more Option three dot///////////////////////////////////////
var i = 0;
function openMoreOptions(e) {
	if (i == 0) {
		moreOptions.style.transform = 'scale(1,1)';
		i = 1;
	} else {
		moreOptions.style.transform = 'scale(0,0)';
		i = 0;
	}
}


//////////////////////////////////////////////File send in chat////////////////////////////////////////////////////////////

function trackFileToBeSendInChat(e) {
	messageArea.value = e.target.value.split("\\")[2];
	let sendMyFile = e.target.files[0]
	console.log(sendMyFile)
	fileTobyte(sendMyFile).then((e) => {
			var base64Img = btoa(uint8ToString(e))
			console.log(base64Img)

		})
}

