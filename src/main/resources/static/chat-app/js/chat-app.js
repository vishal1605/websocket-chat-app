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
const backDropOfLoader = document.getElementById('back-drop-of-loader');
const myLoader = document.getElementById('my_loader');
const renameUserInput = document.getElementById('rename-user');
const addToFriendList = document.getElementById('add-to-friend-list');
const saveFriendModal = new bootstrap.Modal(document.getElementById('user-rename-model'));
const againRenameFriendModal = new bootstrap.Modal(document.getElementById('again-rename-model'));
const exampleModal = new bootstrap.Modal(document.getElementById('exampleModal'));
const againRenameInput = document.getElementById('again-rename-user');
const againRenameBtn = document.getElementById('again-rename-user-btn');
//const searchFriendLocal = document.getElementById('search-friend-local');
const messageHeaderTemplete = document.getElementById('message-header-templete');
const messageInputTemplete = document.getElementById('message-input-templete');
const removeConditionalBtn = document.getElementById('remove-conditional-btn');
const elementBody = document.getElementById('element-body');
const appNotification = document.getElementById('app-notification');
const appNotificationCount = document.getElementById('app-notification-count');
const notificationList = document.getElementById('notification-list');
const handleNotificationDetails = new bootstrap.Modal(document.getElementById('handle-notification-details'));
const notifyModalBody = document.getElementById('notify-modal-body');
const notifyModalName = document.getElementById('notify-modal-name');
const notifyModalImg = document.getElementById('notify-modal-img');
const blockNewFriend = document.getElementById('block-new-friend');
const unBlockNewFriend = document.getElementById('unblock-new-friend');
const saveNewFriendFromNotification = document.getElementById('save-new-friend-from-notification');

//Global variable
let active = [];
let notActive = [];
let allChatUsers = [];
let allFriendsUsers = [];
let messageArray = [];
let globalDate = [];
let friend_id = 0;
var username = session.innerHTML;
let fileString = "";
let fileByteArray = [];
let contentType = "";
let holdBinaryMessageDetails = [];
let holdNotificationMessages = [];
let holdNotificationFromUser = [];
let blockList = [];
let isBlocked = false;

////Event Listners
myFriends.onclick = function (e) {
	friendList.style.transform = 'scale(1,1)'
	notFriendList.style.transform = 'scale(0,1)'
	myFriends.style.background = 'rgb(219, 219, 247)';
	notMyFriends.style.background = '#ffe7c7';
}

notMyFriends.onclick = function (e) {
	friendList.style.transform = 'scale(0,1)'
	notFriendList.style.transform = 'scale(1,1)'
	myFriends.style.background = '#ffe7c7';
	notMyFriends.style.background = 'rgb(219, 219, 247)';
}

///Init function
initialFunct();
function initialFunct() {

	myFriends.style.background = '#dbdbf7';
	getMyProfilePicture();
	getAllFriends(username);
	getAllBlockedFriend();
	refresh.addEventListener('click', whoOnline);
	profilePic.addEventListener('change', trackProfilePic);
	submitMessage.addEventListener('submit', preocessMessage);
	profileMoreOptions.addEventListener('click', openMoreOptions);
	submitProfilePicBtn.addEventListener('click', submitProfilePic);
	fileToSendAsChat.addEventListener('change', trackFileToBeSendInChat);
	addToFriendList.addEventListener('click', addInFriendList);
	againRenameBtn.addEventListener('click', renameFriendAgain);
	document.addEventListener('click', closeMoreOptions);
	blockNewFriend.addEventListener('click', blockFriend);
	unBlockNewFriend.addEventListener('click', unBlockFriend);
	//searchFriendLocal.addEventListener('input', searchLocalFriend);
}
///////////////////////////////Fetch Logged in User Profile/////////////////////////////////////
function getMyProfilePicture() {
	$.ajax({
		type: "GET",
		url: "/get-profile-pic",
		data: {
			requestData: username
		},
		success: function (responseObject) {
			if (responseObject == "") {
			} else {

				myProfilePic.src = 'data:image/png;base64,' + responseObject;
			}
		}

	});
}

///////////////////////////////////////Connect To Websocket connection Or Take user to online/////////////////////////////
function connect() {
	ws = new WebSocket("ws://" + document.location.host + "/chat/" + username);
	ws.onmessage = function (event) {
		var parentDiv = document.createElement('div');
		var childDiv = document.createElement('div');
		var timeLabel = document.createElement('label');
		parentDiv.className = 'left-div';
		timeLabel.className = 'left-time';
		timeLabel.innerText = `${moment(labelTime).format('h:mm a')}`;
		if (typeof (event.data) === 'object') {
			if (holdBinaryMessageDetails.length > 0) {
				let userOpenToTakeMsg = holdBinaryMessageDetails[0];
				if (friend_id == userOpenToTakeMsg.toUser.friend[0].myFriend.user_id) {
					var labelTime = new Date();
					if (globalDate.indexOf(moment(labelTime).format("DD/MM/YYYY")) == -1) {

						globalDate.push(moment(labelTime).format("DD/MM/YYYY"));
						var dateTimeStamp = document.createElement('div');
						dateTimeStamp.className = 'd-flex align-items-center justify-content-center';
						dateTimeStamp.innerHTML = `<h6 style="background-color: #e3dede;color:white;border-radius: 10px;padding:1px 2px">Today</h6>`;
						messageSection.append(dateTimeStamp);
					}
					var reader = new FileReader();
					reader.readAsDataURL(event.data);
					reader.onloadend = function () {
						var base64String = reader.result;
						let contentName = bin2String(userOpenToTakeMsg.content).split(",")[2];
						switch (contentType) {
							case 'application':
								childDiv.className = 'left-msg';
								childDiv.innerHTML = `<label for="" style="font-size:17px;"><i class="fa-solid fa-file me-2" style="font-size:25px;"></i><span class="">${contentName}</span></label><br />
                                <hr class="m-0"/><a download="${contentName}" href="${base64String}" style="cursor: pointer;font-size: 13px"><i class="fa-sharp fa-solid fa-circle-down"></i></a>`;

								break;
							case 'image':
								childDiv.className = 'left-msg-img';
								childDiv.innerHTML = `<img src="${base64String}"
					 						  alt="" width="100%" height="105px" style="cursor: pointer;">
					 						  <a download="${contentName}" href="${base64String}" style="cursor: pointer;font-size: 13px"><i class="fa-sharp fa-solid fa-circle-down"></i></a>`;
								break;

							case 'text':
								childDiv.className = 'left-msg';
								childDiv.innerHTML = `<label for="" style="font-size:17px;"><i class="fa-solid fa-file me-2" style="font-size:25px;"></i><span class="">${contentName}</span></label><br />
                                <hr class="m-0"/><a download="${contentName}" href="${base64String}" style="cursor: pointer;font-size: 13px"><i class="fa-sharp fa-solid fa-circle-down"></i></a>`;

								break;

							case 'video':
								childDiv.className = 'left-msg';
								childDiv.innerHTML = `<label for="" style="font-size:17px;"><i class="fa-solid fa-circle-play me-2" style="font-size:25px;"></i><span class="">${contentName}</span></label><br />
									<hr class="m-0"/><a download="${contentName}" href="${base64String}" style="cursor: pointer;font-size: 13px"><i class="fa-sharp fa-solid fa-circle-down"></i></a>`;

								break;

							case 'audio':
								childDiv.className = 'left-msg';
								childDiv.innerHTML = `<label for="" style="font-size:17px;"><i class="fa-solid fa-music me-2" style="font-size:25px;"></i><span class="">${contentName}</span></label><br />
									<hr class="m-0"/><a download="${contentName}" href="${base64String}" style="cursor: pointer;font-size: 13px"><i class="fa-sharp fa-solid fa-circle-down"></i></a>`;

								break;

							default:
								break;
						}
						parentDiv.append(timeLabel);
						parentDiv.append(childDiv);
						messageSection.append(parentDiv);
						holdBinaryMessageDetails.shift();
					}
				} else {
					holdBinaryMessageDetails.shift();
				}
			}
		} else {

			var activeUser = JSON.parse(event.data);

			if ('user_id' in activeUser) {
				if (activeUser.isActive == true) {
					let exist = active.some((e) => {
						return e.user_id == activeUser.user_id;
					})
					if (!exist) {
						if (parseInt(username) != activeUser.user_id) {
							active.push(activeUser);
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
				if (!(friendList.querySelector(`[data-find="find_${activeUser.toUser.friend[0].myFriend.user_id}"]`) == undefined)) {
					if (friend_id != activeUser.toUser.friend[0].myFriend.user_id) {
						if (bin2String(activeUser.content).split(',')[0] == "notification") {

							console.log(bin2String(activeUser.content).split(',')[1]);
							// document.getElementById(activeUser.toUser.friend[0].myFriend.user_id).setAttribute('data-blocked', bin2String(activeUser.content).split(',')[1].trim());
							// isBlocked = bin2String(activeUser.content).split(',')[1].trim();
						} else if (bin2String(activeUser.content).split(',')[0] == "binarydta") {
							holdBinaryMessageDetails.push(activeUser);
							contentType = bin2String(activeUser.content).split(",")[1].split('/')[0];
							messageArray.push(activeUser.toUser.friend[0].myFriend.user_id)
							document.getElementById(activeUser.toUser.friend[0].myFriend.user_id).children[2].children[1].innerText = 'Conte...';
							document.getElementById(activeUser.toUser.friend[0].myFriend.user_id).children[3].children[0].innerText = moment(new Date(activeUser.sendDate)).format('h:mm a');
							//console.log(messageArray);
							var count = {};
							messageArray.forEach(function (i) { count[i] = (count[i] || 0) + 1; });
							//console.log(count);
							for (let key in count) {
								document.getElementById(key).children[0].textContent = count[key];
								document.getElementById(key).children[0].style.display = 'block';

							}
							var first = document.getElementById(activeUser.toUser.friend[0].myFriend.user_id).cloneNode(true);
							document.getElementById(activeUser.toUser.friend[0].myFriend.user_id).remove();
							friendList.prepend(first);
						} else {
							messageArray.push(activeUser.toUser.friend[0].myFriend.user_id)
							document.getElementById(activeUser.toUser.friend[0].myFriend.user_id).children[2].children[1].innerText = bin2String(activeUser.content).substring(0, 10) + '...';
							document.getElementById(activeUser.toUser.friend[0].myFriend.user_id).children[3].children[0].innerText = moment(new Date(activeUser.sendDate)).format('h:mm a');
							//console.log(messageArray);
							var count = {};
							messageArray.forEach(function (i) { count[i] = (count[i] || 0) + 1; });
							//console.log(count);
							for (let key in count) {
								document.getElementById(key).children[0].textContent = count[key];
								document.getElementById(key).children[0].style.display = 'block';

							}
							var first = document.getElementById(activeUser.toUser.friend[0].myFriend.user_id).cloneNode(true);
							document.getElementById(activeUser.toUser.friend[0].myFriend.user_id).remove();
							friendList.prepend(first);
						}

					} else {
						if (bin2String(activeUser.content).split(',')[0] == "notification") {
							console.log(bin2String(activeUser.content).split(',')[1]);
							// document.getElementById(activeUser.toUser.friend[0].myFriend.user_id).setAttribute('data-blocked', bin2String(activeUser.content).split(',')[1].trim());
							// isBlocked = bin2String(activeUser.content).split(',')[1].trim();
						} else if (bin2String(activeUser.content).split(',')[0] == "binarydta") {
							holdBinaryMessageDetails.push(activeUser);
							contentType = bin2String(activeUser.content).split(",")[1].split('/')[0];
						} else {
							var labelTime = new Date();
							if (globalDate.indexOf(moment(labelTime).format("DD/MM/YYYY")) == -1) {

								globalDate.push(moment(labelTime).format("DD/MM/YYYY"))
								var dateTimeStamp = document.createElement('div');
								dateTimeStamp.className = 'd-flex align-items-center justify-content-center';
								dateTimeStamp.innerHTML = `<h6 style="background-color: #e3dede;color:white;border-radius: 10px;padding:1px 2px">Today</h6>`;
								messageSection.append(dateTimeStamp)
							}
							childDiv.className = 'left-msg';
							childDiv.innerHTML = `<small class="">${bin2String(activeUser.content)}</small>`;

							parentDiv.append(timeLabel);
							parentDiv.append(childDiv);
							messageSection.append(parentDiv);
						}
					}
				} else {
					if (holdNotificationMessages.length == 0) {
						holdNotificationMessages.push(activeUser);
						console.log(document.getElementById(activeUser.toUser.friend[0].myFriend.user_id).children[1].children[0].textContent);
						let notiList = document.createElement('li');
						notiList.className = 'dropdown-item list-of-notification-msg';
						notiList.id = `notify-me-${activeUser.toUser.friend[0].myFriend.user_id}`;
						notiList.innerHTML = `
												<div class="nofification-user-photo">
								<img src="${document.getElementById(activeUser.toUser.friend[0].myFriend.user_id).children[0].children[0].src}" alt="" width="35px" height="35px" style="border-radius: 50%;">
							</div>
							<div class="notification-user-detail">
								<h6 class="m-0">${document.getElementById(activeUser.toUser.friend[0].myFriend.user_id).children[1].children[0].textContent}</h6>
								<p class="m-0">${bin2String(activeUser.content).substring(0, 7) + "..."}</p>
							</div>	`;
						notiList.setAttribute('onclick', `showNotifyUserMessage(${username},${activeUser.toUser.friend[0].myFriend.user_id},
							 '${document.getElementById(activeUser.toUser.friend[0].myFriend.user_id).children[0].children[0].src}',
							 '${document.getElementById(activeUser.toUser.friend[0].myFriend.user_id).getAttribute('data-dname')}', this)`);
						notificationList.append(notiList);

					} else {
						let notifyMe = holdNotificationMessages.some(e => {
							holdNotificationFromUser.push(e.toUser.friend[0].myFriend.user_id);
							return (e.toUser.friend[0].myFriend.user_id == activeUser.toUser.friend[0].myFriend.user_id)
						});
						if (notifyMe) {
							document.getElementById('notify-me-' + activeUser.toUser.friend[0].myFriend.user_id).children[1].children[1].textContent = bin2String(activeUser.content).substring(0, 7) + "...";
						} else {
							holdNotificationMessages.push(activeUser);
							let notiList = document.createElement('li');
							notiList.className = 'dropdown-item list-of-notification-msg';
							notiList.id = `notify-me-${activeUser.toUser.friend[0].myFriend.user_id}`;
							notiList.innerHTML = `
												<div class="nofification-user-photo">
								<img src="${document.getElementById(activeUser.toUser.friend[0].myFriend.user_id).children[0].children[0].src}" alt="" width="35px" height="35px" style="border-radius: 50%;">
							</div>
							<div class="notification-user-detail">
								<h6 class="m-0">${document.getElementById(activeUser.toUser.friend[0].myFriend.user_id).children[1].children[0].textContent}</h6>
								<p class="m-0">${bin2String(activeUser.content).substring(0, 7) + "..."}</p>
							</div>`;
							notificationList.append(notiList);
						}
					}
					//appNotification.style.color = 'red';
					//appNotificationCount.innerText = "1";
					//console.log(holdNotificationFromUser)
					console.log(activeUser);
				}
			}
		}
		// whoOnline();
	}

}
function bin2String(array) {
	return String.fromCharCode.apply(String, array);
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

			//e.style.background = "aqua";
		})
		active.forEach((on) => {
			var elem = [...friendList.children].find((e) => {
				return e.id == on.user_id;
			})
			//console.log(elem);
			if (!(elem === undefined)) {

				elem.style.background = "#b8fcca";
				var first = elem.cloneNode(true);
				elem.remove();
				friendList.prepend(first);
			}
		})


	} else {
		[...friendList.children].forEach((e) => {

			if (e.id != "no-friends-list") {
				e.style.background = "";
			}
		})

	}

}

// setInterval(()=>whoOnline(),10000);

////////////////////////////////////////Get All Chat User Who is registered with this chat-app///////////////////////////////////
function getAllChatUsers() {
	$.ajax({
		type: "GET",
		url: "/getAllChatUsers",

		success: function (responseObject) {
			allChatUsers = [...responseObject]
			responseObject.forEach((e) => {
				var result = allFriendsUsers.some((friend) => {
					return friend.user.user_id == e.user_id
				})
				if (!result) {
					if (e.user_id != username) {
						notFriendList.innerHTML += `<li class="list-of-no-friend border border-1 border-dark mb-1" style="background-color: #fc0d05;" id="${e.user_id}" data-dname="${e.dummyName}">

														<div class="user-photo">
															<img src="${(e.profile_img == null) ? '/assets/img_avatar.png' : 'data:image/png;base64,' + e.profile_img}" alt="" width="45px" height="45px" style="border-radius: 50%;">
														</div>
														<div class="user-detail">
															<h6 class="m-0">${e.dummyName.substring(0, 5) + "..."}</h6>
															<p class="m-0"></p>
														</div>
														<div class="user-add shadow" onclick="saveAsFriend(event,'${e.dummyName}')" data-id="${e.user_id}">
															<i class="fa-solid fa-plus"></i>
														</div>
													</li>`;
					}
				}
			})
		}
	});
}

function saveAsFriend(e, param) {
	//e.target.parentElement.getAttribute('data-id');
	saveFriendModal.show();
	renameUserInput.value = param;
	addToFriendList.value = e.target.parentElement.getAttribute('data-id');

}

function addInFriendList(e) {
	addFriend(e.target.value, renameUserInput.value)
	renameUserInput.value = "";
	saveFriendModal.hide();
}

///////////////////////////////////////Get All Your friends In FriendList///////////////////////////////////////////////
function getAllFriends(id) {
	showLoader()
	$.ajax({
		type: "GET",
		url: "/getAllFriends",
		data: {
			requestData: id
		},
		success: function (responseObject) {
			//console.log(responseObject);
			allFriendsUsers = [...responseObject]
			if (responseObject.length != 0) {
				let modifiedFriendList = responseObject.map((u) => ({ ...u.user, profile_img: null }));
				$.ajax({
					type: "GET",
					url: "/get-last-message",
					data: {
						requestData: JSON.stringify(modifiedFriendList),
						myId: id
					}
					,
					success: function (lastMessages) {
						lastMessages.sort((a, b) => {
							var date1 = new Date(a.sendDate)
							var date2 = new Date(b.sendDate)
							return date2 - date1;
						});
						lastMessages.reverse();
						lastMessages.forEach((e1) => {
							responseObject.forEach((e) => {
								if (e1.toUser.user_id == e.user.user_id) {

									let temp = e;
									responseObject.splice(responseObject.indexOf(e), 1)
									responseObject.unshift(temp)

								} else {

								}


							});

						});
						//console.log(responseObject);
						responseObject.forEach((e) => {
							if (e.blocked) {
								blockList.push(e);
							}
							console.log(blockList);
							friendList.innerHTML += `<li class="list-of-friend mb-1" onclick="showMessageOfSpecificUser(${username}, ${e.user.user_id}, '${e.rename}',this)"
									 style="position:relative;cursor:pointer" id="${e.user.user_id}" data-find="${'find_' + e.user.user_id}" data-blocked="${e.blocked}">
														
														<div id="notification-logo" class="shadow" style="color:black"><span id="notification-count">0</span></div>
														<div class="user-photo">
															<img src="${(e.user.profile_img == null) ? '/assets/img_avatar.png' : 'data:image/png;base64,' + e.user.profile_img}" alt="" width="45px" height="45px" style="border-radius: 50%;">
														</div>
														<div class="user-detail">
															<h6 class="m-0">${e.rename}</h6>
															<small class="m-0" style="font-size:12px; opacity:0.8">no msg</small>
														</div>
														<div class="last-time">
															<small style="font-size:10px">3:45</small>
														</div>
													</li>`;
						});
						lastMessages.forEach((e) => {
							var sendDate = new Date(e.sendDate);
							var decodedString = atob(e.content);
							if (+sendDate.getDate() === +new Date().getDate()) {

								document.getElementById(e.toUser.user_id).children[3].children[0].innerText = `${moment(sendDate).format("h:mm a")}`;
							} else {
								document.getElementById(e.toUser.user_id).children[3].children[0].innerText = `${moment(sendDate).format("DD/MM/YY")}`;
							}
							if (e.msgLabel == "") {
								document.getElementById(e.toUser.user_id).children[2].children[1].innerText = decodedString.substring(0, 10) + "...";
							} else {
								document.getElementById(e.toUser.user_id).children[2].children[1].innerText = "document...";
							}
						})
						hideLoader();
						document.querySelectorAll('#notification-logo').forEach(e => e.style.display = 'none');
					}

				});


			} else {
				friendList.innerHTML = `<li class="rounded" id="no-friends-list" style="height:40px; background-color:white;">Sorry! no friends</li>`;
				hideLoader();
			}
			getAllChatUsers();


		}
	});
}
///////////////////////////////////////////////Get All Blocked Friend//////////////////////////////////////////////////
function getAllBlockedFriend() {
	$.ajax({
		type: "GET",
		url: "/getAllBlockFriends",
		data: {
			requestData: username,
		}
		,
		success: function (response) {
			console.log(response);
			response.forEach(e=>{
				blockList.push(e);
			})
		}
	});
}

////////////////////////////////////////// Add More Friends In Your Friend List///////////////////////////////////////////
function addFriend(id, f_dummyName) {
	if (document.getElementById('no-friends-list') != null) {
		document.getElementById('no-friends-list').remove()
	}
	var friendId = id
	$.ajax({
		type: "GET",
		url: "/makeFriend",
		data: {
			requestData: friendId,
			givenName: f_dummyName
		},
		success: function (responseObject) {
			console.log(responseObject)
			var list = document.createElement('li');
			list.className = 'list-of-friend mb-1';
			list.style.backgroundColor = 'white';
			list.style.color = 'black';
			list.style.position = 'relative';
			list.style.cursor = 'pointer'
			list.setAttribute('onclick', `showMessageOfSpecificUser(${username},${responseObject.user.user_id},'${responseObject.rename}', this)`)
			list.id = responseObject.user.user_id;
			list.setAttribute('data-find', 'find_' + responseObject.user.user_id)
			list.setAttribute('data-blocked', responseObject.blocked)
			list.innerHTML = `<div id="notification-logo" class="shadow" style="color:black"><span id="notification-count">0</span></div>
							  <div class="user-photo">
								<img src="${(responseObject.user.profile_img == null) ? '/assets/img_avatar.png' : 'data:image/png;base64,' + responseObject.user.profile_img}" alt="" width="45px" height="45px" style="border-radius: 50%;">
							  </div>
								<div class="user-detail">
									<h6 class="m-0">${f_dummyName}</h6>
									<small class="m-0" style="font-size:12px;opacity:0.8">no msg</small>
								</div>
								<div class="last-time">
									<small style="font-size:10px">3:45</small>
								</div>
								`;


			friendList.append(list);
			document.querySelectorAll('#notification-logo').forEach(e => e.style.display = 'none')
			document.getElementById('notify-me-'+id).remove();
		}
	});
	//console.log(list);

	document.getElementById(id).remove();

}

//////////////////////////////////////////////Remove Your Friend From Friend List OR Unfriend///////////////////////////////////////
function removeFriend(e) {
	var friendId = e.target.getAttribute('data-id');
	messageSection.innerHTML = '';
	messageHeaderLabel.innerText = '';
	profileMoreOptions.innerHTML = ``;
	msgHeaderProfilePic.src = "/assets/img_avatar.png";
	msgHeaderProfilePic.classList.remove('show-element');
	messageHeaderTemplete.classList.remove('shadow-sm');
	messageInputTemplete.classList.remove('show-model');
	moreOptions.children[0].removeAttribute('data-id');
	moreOptions.children[0].removeEventListener('click', removeFriend)
	moreOptions.children[1].removeAttribute('data-rename');
	moreOptions.children[1].removeEventListener('click', renameFriend)
	moreOptions.style.transform = 'scale(1,0)';
	friend_id = 0;
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
			list.setAttribute('data-dname', responseObject.dummyName);
			list.innerHTML = `<div class="user-photo">
								<img src="${(responseObject.profile_img == null) ? '/assets/img_avatar.png' : 'data:image/png;base64,' + responseObject.profile_img}" alt="" width="45px" height="45px" style="border-radius: 50%;">
							</div>
							<div class="user-detail">
								<h5 class="m-0">${responseObject.dummyName.substring(0, 4) + '...'}</h5>
							</div>
							<div class="user-add shadow" onclick="saveAsFriend(event,'${responseObject.dummyName}')" data-id="${responseObject.user_id}">
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

////////////////////////////////////////////////Close Model for Update Your Profile pic ////////////////////////////////////////////////
closePopUpProfileModel.onclick = function (e) {
	profilePic.value = '';
	if (alertMsg.classList.contains('show-model')) {
		alertMsg.classList.remove('show-model');
	}
	if (profileDemo.classList.contains('show-model')) {
		profileDemo.classList.remove('show-model');
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
			profileDemo.classList.add('show-model');
			submitProfilePicBtn.removeAttribute('disabled');

		})

		alertMsg.classList.remove('show-model')
	} else {
		alertMsg.classList.add('show-model')
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
		success: function (response) {
			myProfilePic.src = 'data:image/png;base64,' + response;

		}
	});

	profilePic.value = '';
	profileDemo.classList.remove('show-model');
	submitProfilePicBtn.setAttribute('disabled', 'disabled');

}

////////////////////////////////////////////Show Your Specfic Friend Older Chat with You & Start more Chat///////////////////////////
function showMessageOfSpecificUser(u_id, f_id, friendName, element) {
	//console.log(element.children[1].children[0].src);
	var zro = messageArray.filter(e => e == f_id);
	zro.forEach(e => messageArray.splice(messageArray.indexOf(e), 1))
	document.getElementById(f_id).children[0].textContent = 0;
	document.getElementById(f_id).children[0].style.display = 'none';
	isBlocked = element.getAttribute('data-blocked');
	friend_id = f_id;
	var storeDate = [];
	showLoader();
	$.ajax({
		type: "GET",
		url: "/get-message",
		data: {
			requestData: JSON.stringify({ u_id, f_id })
		},

		success: function (response) {
			if (response.length !== 0) {
				var showDate = new Date();
				if (globalDate.indexOf(moment(showDate).format("DD/MM/YYYY")) == -1) {
					globalDate.push(moment(showDate).format("DD/MM/YYYY"))
				}
			}
			messageSection.innerHTML = '';
			msgHeaderProfilePic.src = element.children[1].children[0].src;
			msgHeaderProfilePic.classList.add('show-element');
			messageHeaderTemplete.classList.add('shadow-sm');
			messageInputTemplete.classList.add('show-model');
			messageHeaderLabel.innerText = friendName;
			profileMoreOptions.innerHTML = `<i class="fa-solid fa-bars"></i>`;
			moreOptions.children[0].setAttribute("data-id", f_id);
			moreOptions.children[0].addEventListener('click', removeFriend);
			moreOptions.children[1].setAttribute("data-rename", f_id);
			moreOptions.children[1].addEventListener('click', renameFriend);
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
					if (!(moment(labelTime).startOf('day').isSame(moment().startOf('day')))) {
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
					timeLabel.className = 'left-time';
					timeLabel.innerText = `${moment(labelTime).format("h:mm")}`;
					parentDiv.append(timeLabel);
					parentDiv.append(childDiv);
					if (e.msgLabel == "") {
						childDiv.className = 'left-msg';
						var decodedString = atob(e.content);
						childDiv.innerHTML = `<small class="">${decodedString}</small>`;

					} else {
						if (e.msgLabel.split(',')[1].split('/')[0].toUpperCase() == 'IMAGE') {
							childDiv.className = 'left-msg-img';
							childDiv.innerHTML = `<img src="${'data:image/png;base64,' + e.content}"
					 						  alt="" width="100%" height="105px" style="cursor: pointer;">
					 						  <a download="${e.msgLabel.split(',')[0]}" href="${'data:image/png;base64,' + e.content}" style="cursor: pointer;font-size: 13px"><i class="fa-sharp fa-solid fa-circle-down"></i></a>`;
						} else {
							childDiv.className = 'left-msg';
							if (e.msgLabel.split(',')[1].split('/')[0].toUpperCase() == 'APPLICATION') {
								childDiv.innerHTML = `<label for="" style="font-size:17px;"><i class="fa-solid fa-file me-2" style="font-size:25px;"></i><span class="">${e.msgLabel.split(',')[0]}</span></label><br />
                                <hr class="m-0"/><a download="${e.msgLabel.split(',')[0]}" href="${'data:' + e.msgLabel.split(',')[1] + ';base64,' + e.content}" style="cursor: pointer;font-size: 13px"><i class="fa-sharp fa-solid fa-circle-down"></i></a>`;
							} else if (e.msgLabel.split(',')[1].split('/')[0].toUpperCase() == 'VIDEO') {
								childDiv.innerHTML = `<label for="" style="font-size:17px;"><i class="fa-solid fa-circle-play me-2" style="font-size:25px;"></i><span class="">${e.msgLabel.split(',')[0]}</span></label><br />
                                <hr class="m-0"/><a download="${e.msgLabel.split(',')[0]}" href="${'data:' + e.msgLabel.split(',')[1] + ';base64,' + e.content}" style="cursor: pointer;font-size: 13px"><i class="fa-sharp fa-solid fa-circle-down"></i></a>`;
							} else if (e.msgLabel.split(',')[1].split('/')[0].toUpperCase() == 'AUDIO') {
								childDiv.innerHTML = `<label for="" style="font-size:17px;"><i class="fa-solid fa-music me-2" style="font-size:25px;"></i><span class="">${e.msgLabel.split(',')[0]}</span></label><br />
                                <hr class="m-0"/><a download="${e.msgLabel.split(',')[0]}" href="${'data:' + e.msgLabel.split(',')[1] + ';base64,' + e.content}" style="cursor: pointer;font-size: 13px"><i class="fa-sharp fa-solid fa-circle-down"></i></a>`;
							} else if (e.msgLabel.split(',')[1].split('/')[0].toUpperCase() == 'TEXT') {
								childDiv.innerHTML = `<label for="" style="font-size:17px;"><i class="fa-solid fa-file me-2" style="font-size:25px;"></i><span class="">${e.msgLabel.split(',')[0]}</span></label><br />
                                <hr class="m-0"/><a download="${e.msgLabel.split(',')[0]}" href="${'data:' + e.msgLabel.split(',')[1] + ';base64,' + e.content}" style="cursor: pointer;font-size: 13px"><i class="fa-sharp fa-solid fa-circle-down"></i></a>`;
							}
						}
					}
					messageSection.append(parentDiv);

				} else {
					if (!(moment(labelTime).startOf('day').isSame(moment().startOf('day')))) {
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

					timeLabel.className = 'right-time';
					timeLabel.innerText = `${moment(labelTime).format("h:mm")}`;
					if (e.msgLabel == "") {
						childDiv.className = 'right-msg';
						var decodedString = atob(e.content);
						childDiv.innerHTML = `<small class="">${decodedString}</small>`;
					} else {
						if (e.msgLabel.split(',')[1].split('/')[0].toUpperCase() == 'IMAGE') {
							childDiv.className = 'right-msg-img';
							childDiv.innerHTML = `<img src="${'data:' + e.msgLabel.split(',')[1] + ';base64,' + e.content}"
					 						  alt="" width="100%" style="cursor: pointer;">`;
						} else {
							childDiv.className = 'right-msg';
							if (e.msgLabel.split(',')[1].split('/')[0].toUpperCase() == 'APPLICATION') {
								childDiv.innerHTML = `<i class="fa-solid fa-file" style="font-size:25px;"></i>&nbsp;<span class="">${e.msgLabel.split(',')[0]}</span>`;
							} else if (e.msgLabel.split(',')[1].split('/')[0].toUpperCase() == 'VIDEO') {
								childDiv.innerHTML = `<i class="fa-solid fa-circle-play" style="font-size:25px;"></i>&nbsp;<span class="">${e.msgLabel.split(',')[0]}</span>`;
							} else if (e.msgLabel.split(',')[1].split('/')[0].toUpperCase() == 'AUDIO') {
								childDiv.innerHTML = `<i class="fa-solid fa-music" style="font-size:25px;"></i>&nbsp;<span class="">${e.msgLabel.split(',')[0]}</span>`;
							} else if (e.msgLabel.split(',')[1].split('/')[0].toUpperCase() == 'TEXT') {
								childDiv.innerHTML = `<i class="fa-solid fa-file" style="font-size:25px;"></i>&nbsp;<span class="">${e.msgLabel.split(',')[0]}</span>`;
							}
						}
					}

					parentDiv.append(timeLabel);
					parentDiv.append(childDiv);
					messageSection.append(parentDiv);


				}
				messageSection.scrollTop = messageSection.scrollHeight;
				messageSection.scrollTop = messageSection.lastChild.offsetTop;

			});
			if (storeDate.indexOf(globalDate[0]) == -1) {

				globalDate.shift();
			} else {
			}
			hideLoader();
		}
	});
}


//////////////////////////////////////////Send Message To Your Friend////////////////////////////////////////////////////
function preocessMessage(e) {
	e.preventDefault();
	var storeDate = [];
	var labelTime = new Date()
	if (friend_id != 0) {
		if (online.checked) {
			if (active.length != 0) {
				let allowMsg = active.some(e => e.user_id == friend_id);
				if (allowMsg) {
					console.log(isBlocked, typeof isBlocked);
					if (isBlocked === 'false') {
						if (fileToSendAsChat.value != "") {
							//ws.binaryType = "arraybuffer"
							ws.send(JSON.stringify({
								toUser: {
									user_id: friend_id,
									friend: [{
										myFriend: {
											user_id: username
										}
									}]
								},
								content: unpack("binarydta," + fileToSendAsChat.files[0].type + "," + fileToSendAsChat.files[0].name),
								sendDate: new Date().toString(),
								recievedDate: new Date().toString(),

							}))
							ws.send(fileToSendAsChat.files[0]);

							var parentDiv = document.createElement('div');
							var childDiv = document.createElement('div');
							var timeLabel = document.createElement('label');
							if (globalDate.indexOf(moment(labelTime).format("DD/MM/YYYY")) == -1) {

								globalDate.push(moment(labelTime).format("DD/MM/YYYY"))
								var dateTimeStamp = document.createElement('div');
								dateTimeStamp.className = 'd-flex align-items-center justify-content-center';
								dateTimeStamp.innerHTML = `<h6 style="background-color: #e3dede;color:white;border-radius: 10px;padding:1px 2px">Today</h6>`;
								messageSection.append(dateTimeStamp)
							}
							if (fileToSendAsChat.files[0].type == 'image/png' || fileToSendAsChat.files[0].type == 'image/jpeg') {

								parentDiv.className = 'right-div';
								childDiv.className = 'right-msg-img';
								timeLabel.className = 'right-time';
								timeLabel.innerText = `${moment(labelTime).format('h:mm a')}`;
								parentDiv.append(timeLabel);
								parentDiv.append(childDiv);
								childDiv.innerHTML = `<img src="${'data:image/png;base64,' + fileString}"
						 alt="" width="100%" style="cursor: pointer;">`;

								messageSection.append(parentDiv);

								let formFile = new FormData();
								formFile.append('msgFile', fileToSendAsChat.files[0])
								formFile.append('username', username)
								formFile.append('friend_id', friend_id)
								$.ajax({
									type: "POST",
									url: "/send-file",
									contentType: false,
									processData: false,
									data: formFile,
									success: function (response) {
										// console.log(response);
									}
								});


							} else {
								parentDiv.className = 'right-div';
								childDiv.className = 'right-msg';
								timeLabel.className = 'right-time';
								timeLabel.innerText = `${moment(labelTime).format('h:mm a')}`;
								parentDiv.append(timeLabel);
								parentDiv.append(childDiv);
								switch (fileToSendAsChat.files[0].type) {
									case 'application/pdf':
										childDiv.innerHTML = `<i class="fa-solid fa-file-pdf" style="font-size:25px;"></i>&nbsp;<span class="">${fileToSendAsChat.files[0].name}</span>`;

										break;

									case 'application/x-zip-compressed':
										childDiv.innerHTML = `<i class="fa-solid fa-file-zipper" style="font-size:25px;"></i>&nbsp;<span class="">${fileToSendAsChat.files[0].name}</span>`;
										break;

									case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
										childDiv.innerHTML = `<i class="fa-solid fa-file-excel" style="font-size:25px;"></i>&nbsp;<span class="">${fileToSendAsChat.files[0].name}</span>`;
										break;

									case 'application/zip':
										childDiv.innerHTML = `<i class="fa-solid fa-file-zipper" style="font-size:25px;"></i>&nbsp;<span class="">${fileToSendAsChat.files[0].name}</span>`;
										break;

									case 'video/mp4':
										childDiv.innerHTML = `<i class="fa-solid fa-circle-play" style="font-size:25px;"></i>&nbsp;<span class="">${fileToSendAsChat.files[0].name}</span>`;
										break;

									case 'audio/mpeg':
										childDiv.innerHTML = `<i class="fa-solid fa-music" style="font-size:25px;"></i>&nbsp;<span class="">${fileToSendAsChat.files[0].name}</span>`;
										break;

									case 'text/html':
										childDiv.innerHTML = `<i class="fa-solid fa-file" style="font-size:25px;"></i>&nbsp;<span class="">${fileToSendAsChat.files[0].name}</span>`;
										break;

									case 'text/htm':
										childDiv.innerHTML = `<i class="fa-solid fa-file" style="font-size:25px;"></i>&nbsp;<span class="">${fileToSendAsChat.files[0].name}</span>`;
										break;

									case 'text/javascript':
										childDiv.innerHTML = `<i class="fa-solid fa-file" style="font-size:25px;"></i>&nbsp;<span class="">${fileToSendAsChat.files[0].name}</span>`;
										break;

									case 'text/plain':
										childDiv.innerHTML = `<i class="fa-solid fa-file" style="font-size:25px;"></i>&nbsp;<span class="">${fileToSendAsChat.files[0].name}</span>`;
										break;

									default:
										break;
								}

								messageSection.append(parentDiv);
								let formFile = new FormData();
								formFile.append('msgFile', fileToSendAsChat.files[0])
								formFile.append('username', username)
								formFile.append('friend_id', friend_id)
								$.ajax({
									type: "POST",
									url: "/send-file",
									contentType: false,
									processData: false,
									data: formFile,
									success: function (response) {
										//console.log(response);
									}
								});
							}
						} else {
							var formData = new FormData(e.target);
							let myMessage = formData.get('message');
							ws.send(JSON.stringify({
								toUser: {
									user_id: friend_id,
									friend: [{
										myFriend: {
											user_id: username
										}
									}]
								},
								content: unpack(myMessage),
								sendDate: new Date().toString(),
								recievedDate: new Date().toString(),
							}));
							var parentDiv = document.createElement('div');
							var childDiv = document.createElement('div');
							var timeLabel = document.createElement('label');

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
							childDiv.innerHTML = `<small class="">${myMessage}</small>`;
							messageSection.append(parentDiv);
							// $.ajax({
							// 	type: "POST",
							// 	url: "/send-message",
							// 	data: {
							// 		requestData: JSON.stringify({
							// 			username, friend_id, myMessage
							// 		})
							// 	},
							// 	success: function (response) {
							// 		//console.log(response);
							// 	}
							// });
						}
						messageArea.value = "";
						fileToSendAsChat.value = "";
					} else {
						alert("You Blocked This User");
					}
				} else {
					alert("sorry your friend is not online");

				}
			} else {
				alert("sorry your friend is not online");
			}

		} else {
			alert("sorry you are not online");
		}

	} else {
		alert("please select user");

	}


}
function unpack(str) {
	var arr = [];
	for (var i = 0; i < str.length; i++) {
		arr.push(str.charCodeAt(i));
	}
	return arr
}

///////////////////////////////////////////////Select Specfic Friend of more Option three dot///////////////////////////////////////
var i = 0;
function openMoreOptions(e) {
	if (i == 0) {
		moreOptions.style.transform = 'scale(1,1)';
		i = 1;
	} else {
		moreOptions.style.transform = 'scale(1,0)';
		i = 0;
	}
}


//////////////////////////////////////////////File send in chat////////////////////////////////////////////////////////////

function trackFileToBeSendInChat(e) {
	messageArea.value = e.target.value.split("\\")[2];
	let sendMyFile = e.target.files[0]
	fileTobyte(sendMyFile).then((e) => {
		fileByteArray = e;
		fileString = btoa(uint8ToString(e))

	})
}
///////////////////////////////////////////////////Loader Function /////////////////////////////////////////////////////////

function showLoader() {
	backDropOfLoader.classList.add('show-model');
	myLoader.classList.add('show-model');
}
function hideLoader() {
	backDropOfLoader.classList.remove('show-model');
	myLoader.classList.remove('show-model');
}

//////////////////////////////////////////////////Close More Options//////////////////////////////////////////////////////
function closeMoreOptions(e) {
	if (e.target.tagName.toLowerCase() == 'img') {
		removeConditionalBtn.classList.remove('fade-model');
		exampleModal.show();
		if (e.target.id == 'profile-pic') {

			elementBody.innerHTML = `<img src='${e.target.src}' width='400px' height='470px' />`;
		} else {
			elementBody.innerHTML = `<img src='${e.target.src}' width='400px' height='470px' />`;
			removeConditionalBtn.classList.add('fade-model');
		}
	} else {
		//console.log(e.target);
	}

}

/////////////////////////////////////////////////////Rename Friend//////////////////////////////////////////////////////

function renameFriend(e) {
	var friendId = e.target.getAttribute('data-rename');
	againRenameFriendModal.show();
	againRenameInput.value = messageHeaderLabel.innerText;
	againRenameBtn.value = friendId;
	//console.log(saveFriendModal._element);
}

function renameFriendAgain(e) {
	let id = e.target.value;
	$.ajax({
		type: "GET",
		url: "/rename-friend",
		data: {
			rename: againRenameInput.value,
			user_id: username,
			friendId: id
		},
		success: function (response) {
			console.log(response);
			//messageHeaderLabel.innerText = response;
			//friendList.querySelector(`[data-find="find_${id}"]`).children[2].children[0].innerText = response;
		}
	});
	againRenameInput.value = '';
	e.target.value = '';
	againRenameFriendModal.hide();
}

function searchLocalFriend(e) {
	//let allElement = [...friendList.children];
	//allElement.forEach(e=>{
	//console.log(e.[]);
	//})
	//console.log(friendList.textContent)

}

//////////////////////////////////////////////////////////App Notification Releted///////////////////////////////////
function showNotifyUserMessage(u_id, f_id, imgString, dummyName, element) {
	console.log(blockList);
	blockNewFriend.value = f_id;
	unBlockNewFriend.value = f_id;
	notifyModalBody.innerHTML = "";
	handleNotificationDetails.show();
	notifyModalImg.src = imgString;
	notifyModalName.innerText = dummyName;
	$.ajax({
		type: "GET",
		url: "/check-blocked-friend",
		data: {
			requestData: f_id
		},
		success: function (result) {
			console.log(result)
			if (result) {

				blockNewFriend.classList.add('fade-model');
				unBlockNewFriend.classList.remove('fade-model');
			} else {

				blockNewFriend.classList.remove('fade-model');
				unBlockNewFriend.classList.add('fade-model');
			}
		}
	});

	$.ajax({
		type: "GET",
		url: "/get-message",
		data: {
			requestData: JSON.stringify({ u_id, f_id })
		},
		success: function (result) {
			result.forEach(e => {
				var dateTimeStamp = document.createElement('div');
				dateTimeStamp.className = 'd-flex align-items-center justify-content-center';
				dateTimeStamp.innerHTML = `<h6 style="background-color: #e3dede;color:white;border-radius: 10px;padding:1px 2px">${moment(e.recievedDate).format("DD/MM/YYYY")}</h6>`;
				var parentDiv = document.createElement('div');
				var childDiv = document.createElement('div');
				var timeLabel = document.createElement('label');
				parentDiv.className = 'left-div';
				timeLabel.className = 'left-time';
				timeLabel.innerText = `${moment(e.recievedDate).format("h:mm")}`;
				parentDiv.append(timeLabel);
				parentDiv.append(childDiv);
				childDiv.className = 'left-msg';
				var decodedString = atob(e.content);
				childDiv.innerHTML = `<small class="">${decodedString}</small>`;
				notifyModalBody.append(dateTimeStamp);
				notifyModalBody.append(parentDiv);
			})
		}
	});
	console.log(document.getElementById(f_id).getAttribute('data-dname'))
	saveNewFriendFromNotification.setAttribute('onclick', `saveNotificationFriend(${f_id},'${document.getElementById(f_id).getAttribute('data-dname')}')`);
}

function saveNotificationFriend(id, param) {
	handleNotificationDetails.hide();
	saveFriendModal.show();
	renameUserInput.value = param;
	addToFriendList.value = id;
}

function blockFriend(e) {
	if (e.target.value != "") {
		ws.send(JSON.stringify({
			toUser: {
				user_id: e.target.value,
				friend: [{
					myFriend: {
						user_id: username
					}
				}]
			},
			content: unpack("notification," + "true," + "block"),
			sendDate: new Date().toString(),
			recievedDate: new Date().toString(),

		}));

		$.ajax({
			type: "GET",
			url: "/blocked-friend",
			data: {
				requestData: e.target.value
			},
			success: function (result) {
				console.log(result);
				blockList.push(result);
			}
		});
	}
	handleNotificationDetails.hide();
	e.target.value = "";

}

function unBlockFriend(e) {
	console.log(e);
	if (e.target.value != "") {
		ws.send(JSON.stringify({
			toUser: {
				user_id: e.target.value,
				friend: [{
					myFriend: {
						user_id: username
					}
				}]
			},
			content: unpack("notification," + "false," + "block"),
			sendDate: new Date().toString(),
			recievedDate: new Date().toString(),

		}));
		$.ajax({
			type: "GET",
			url: "/unblocked-friend",
			data: {
				requestData: e.target.value
			},
			success: function (result) {
				console.log(result);
				blockList.splice(blockList.indexOf(blockList.find(e=>e.fId == result.fId)),1);
			}
		});
	}
	handleNotificationDetails.hide();
	e.target.value = "";
}