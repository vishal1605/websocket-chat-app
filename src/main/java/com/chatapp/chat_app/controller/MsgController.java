package com.chatapp.chat_app.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpSession;

import org.apache.tomcat.util.codec.binary.Base64;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.chatapp.chat_app.model.ChatUser;
import com.chatapp.chat_app.model.Friends;
import com.chatapp.chat_app.model.Message;
import com.chatapp.chat_app.services.FriendsDao;
import com.chatapp.chat_app.services.MessageDao;
import com.chatapp.chat_app.services.UserDao;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;

@RestController
@RestControllerAdvice
public class MsgController {

	@Autowired
	private UserDao dao;

	@Autowired
	private MessageDao mDao;

	@Autowired
	private FriendsDao fDao;

	private List<ChatUser> listOfUsers = new ArrayList<>();

	@GetMapping("/")
	public ModelAndView home(HttpSession session, Model m) {
		ModelAndView mv = new ModelAndView();
		var s = session.getAttribute("successMsg");
		m.addAttribute("succMsg", s);
		session.removeAttribute("successMsg");
		mv.setViewName("pages/register");
		return mv;

	}

	@PostMapping("/register")
	public ModelAndView registerProcess(ChatUser user, HttpSession session) {
		ModelAndView mv = new ModelAndView();
		boolean success = false;
		ChatUser u = dao.saveUser(user);

		System.out.println(u);
		session.setAttribute("successMsg", success);
		mv.setViewName("redirect:/");
		return mv;
	}

	@GetMapping("/login-form")
	public ModelAndView login() {
		ModelAndView mv = new ModelAndView();
		mv.setViewName("pages/login");
		return mv;

	}

	@PostMapping("/login")
	public ModelAndView loginProcess(ChatUser user, HttpSession session) {
		ModelAndView mv = new ModelAndView();
		ChatUser u = dao.login(user.getUserName());
		byte[] b = new byte[0];
		if (u == null) {
			mv.setViewName("redirect:/login-form");
			return mv;
		}
		u.getFriend().clear();
		u.getMessages().clear();
		u.setProfile_img(b);
		session.setAttribute("user", u);
		mv.setViewName("redirect:/dashboard/" + u.getUserName());
		return mv;
	}

	@GetMapping("/logout")
	public ModelAndView logoutProcess(HttpSession session) {
		ModelAndView mv = new ModelAndView();
		session.removeAttribute("user");
		mv.setViewName("redirect:/login-form");
		return mv;
	}

	@GetMapping("/dashboard/{name}")
	public ModelAndView dashboard(@PathVariable("name") String name, HttpSession session) {
		ModelAndView mv = new ModelAndView();
		ChatUser c = (ChatUser) session.getAttribute("user");
		if (c == null) {
			mv.setViewName("pages/error");
			return mv;
		}
		mv.setViewName("pages/dashboard");
		return mv;

	}

	@GetMapping("/dashboard/chat/{name}")
	public ModelAndView chat(@PathVariable("name") String name, Model m, HttpSession session) {
		ModelAndView mv = new ModelAndView();
		ChatUser c = (ChatUser) session.getAttribute("user");
		if (c == null) {
			mv.setViewName("pages/error");
			return mv;
		}
		m.addAttribute("username", name);
		mv.setViewName("pages/chat-app");
		return mv;

	}

	@GetMapping("/active-users")
	public String activeUsers(String requestData, HttpSession session, ChatUser u)
			throws JsonMappingException, JsonProcessingException {
		// System.out.println(requestData);
		Gson gson = new Gson(); // Or use new GsonBuilder().create();
		ChatUser user = gson.fromJson(requestData, ChatUser.class);
		listOfUsers.add(user);
		// System.out.println(user);

		String json = new Gson().toJson(listOfUsers);

		return json;

	}

	@GetMapping("/getAllFriends")
	public ResponseEntity<?> getAllFriends(String requestData, HttpSession session) {
		try {
			ChatUser c = (ChatUser) session.getAttribute("user");
			if (c == null)
				return ResponseEntity.badRequest().body("Session has expired");
			List<Friends> friends = fDao.getAllFriends(Long.parseLong(requestData));
			return ResponseEntity.ok().body(friends);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e);
		}

	}

	@GetMapping("/getAllBlockFriends")
	public ResponseEntity<?> listOfBlockFriends(String requestData, HttpSession session) {
		try {
			ChatUser c = (ChatUser) session.getAttribute("user");
			if (c == null)
				return ResponseEntity.badRequest().body("Session has expired");
			return ResponseEntity.ok().body(fDao.listOfBlockFriends(Long.parseLong(requestData)));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e);
		}
	}

	@GetMapping("/get-last-message")
	public ResponseEntity<?> getLastMessage(String requestData, String myId, HttpSession session) {
		try {
			ChatUser c = (ChatUser) session.getAttribute("user");
			if (c == null)
				return ResponseEntity.badRequest().body("Session has expired");
			// System.out.println(requestData);
			TypeToken<List<ChatUser>> token = new TypeToken<List<ChatUser>>() {
			};
			List<ChatUser> friends = new Gson().fromJson(requestData, token.getType());
			List<Message> messages1 = new ArrayList<>();
			if (friends.size() != 0) {
				List<Message> messages = new ArrayList<>();
				for (ChatUser chatUser : friends) {
					messages.addAll(mDao.getFriendMessages(Long.parseLong(myId), chatUser.getUser_id()));
					messages.addAll(mDao.getFriendMessages(chatUser.getUser_id(), Long.parseLong(myId)));
					// System.out.println(messages);
					if (messages.size() != 0) {
						for (int i = 0; i < messages.size(); i++) {
							for (int j = i + 1; j < messages.size(); j++) {
								if (LocalDateTime.parse(messages.get(i).getSendDate())
										.isAfter(LocalDateTime.parse(messages.get(j).getSendDate()))) {
									Message temp = messages.get(j);
									messages.set(j, messages.get(i));
									messages.set(i, temp);
								}
							}
						}
						Message m = new Message();
						m.setToUser(chatUser);
						m.setContent(messages.get(messages.size() - 1).getContent());
						m.setSendDate(messages.get(messages.size() - 1).getSendDate());
						m.setMsgLabel(messages.get(messages.size() - 1).getMsgLabel());
						messages1.add(m);

					} else {

					}
					messages.clear();
				}
			}
			return ResponseEntity.ok().body(messages1);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e);
		}
	}

	@GetMapping("/makeFriend")
	public ResponseEntity<?> makeFriends(String requestData, String givenName, HttpSession session) {
		try {
			ChatUser c = (ChatUser) session.getAttribute("user");
			if (c == null)
				return ResponseEntity.badRequest().body("Session has expired");
			Friends f = fDao.checkBlockedOrNot(c.getUser_id(), Long.parseLong(requestData));
			if (f == null) {
				ChatUser friend = dao.getSingleUser(Long.parseLong(requestData));
				System.out.println("Creted");
				return ResponseEntity.ok().body(fDao.saveMyFriends(givenName, friend, c.getUser_id()));
			} else {
				return ResponseEntity.ok()
						.body(fDao.saveMyFriends1(f.getfId(), givenName, f.getUser(), c.getUser_id(), f.isBlocked()));
			}
		} catch (Exception e) {
			return ResponseEntity.ok().body(e);
		}

	}

	@GetMapping("/removeFriend")
	public ResponseEntity<?> removeFriend(String requestData, HttpSession session) {
		try {
			ChatUser c = (ChatUser) session.getAttribute("user");
			if (c == null)
				return ResponseEntity.badRequest().body("Session has expired");
			ChatUser friend = dao.getSingleUser(Long.parseLong(requestData));
			fDao.deleteSingleFriend(c.getUser_id(), Long.parseLong(requestData));
			return ResponseEntity.ok().body(friend);
		} catch (Exception e) {
			return ResponseEntity.ok().body(e);
		}
	}

	@GetMapping("/getAllChatUsers")
	public ResponseEntity<?> getAllChatUsers(HttpSession session) {
		try {
			ChatUser c = (ChatUser) session.getAttribute("user");
			if (c == null)
				return ResponseEntity.badRequest().body("Session has expired");
			return ResponseEntity.ok().body(dao.getAllChatUser());
		} catch (Exception e) {
			return ResponseEntity.ok().body(e);
		}
	}

	@PostMapping("/send-message")
	public ResponseEntity<?> saveUserMessage(String requestData, HttpSession session) {
		try {
			ChatUser c = (ChatUser) session.getAttribute("user");
			if (c == null)
				return ResponseEntity.badRequest().body("Session has expired");
			JSONObject json = new JSONObject(requestData);
			long user_id = json.getLong("username");
			long f_id = json.getLong("friend_id");
			String message = json.getString("myMessage");
			ChatUser f = dao.getSingleUser(f_id);
			Set<Message> set = new HashSet<Message>();
			set.add(mDao.saveMessage(user_id, new Message(f, message.getBytes(), "", LocalDateTime.now().toString())));
			return ResponseEntity.ok().body(set);
		} catch (Exception e) {
			return ResponseEntity.ok().body(e);
		}
	}

	@PostMapping("/recieved-message")
	public ResponseEntity<?> saveRecievedMessage(String requestData, HttpSession session) {
		try {
			ChatUser c = (ChatUser) session.getAttribute("user");
			if (c == null)
				return ResponseEntity.badRequest().body("Session has expired");
			JSONObject json = new JSONObject(requestData);
			long recievedMessageId = json.getLong("recievedMessageId");
			Message mId = mDao.getSingleMessage(recievedMessageId);
			Set<Message> set = new HashSet<Message>();

			set.add(mDao.updateMessage(new Message(mId.getMessage_id(), mId.getToUser(), mId.getContent(),
					null, mId.getMsgLabel(),
					mId.getSendDate(), LocalDateTime.now().toString())));
			return ResponseEntity.ok().body(set);
		} catch (Exception e) {
			return ResponseEntity.ok().body(e);
		}
	}

	@PostMapping("/send-file")
	public ResponseEntity<?> saveUserFileMessage(@RequestParam("msgFile") MultipartFile myMultipartFile,
			@RequestParam("username") int myId, @RequestParam("friend_id") int friend_id, HttpSession session) {
		ChatUser c = (ChatUser) session.getAttribute("user");
		if (c == null)
			return ResponseEntity.badRequest().body("Session has expired");
		ChatUser f = dao.getSingleUser(friend_id);
		try {
			Set<Message> set = new HashSet<Message>();
			set.add(mDao.saveMessage(myId,
					new Message(f, myMultipartFile.getBytes(),
							myMultipartFile.getOriginalFilename() + "," + myMultipartFile.getContentType(),
							LocalDateTime.now().toString())));
			return ResponseEntity.ok().body(set);
		} catch (Exception e) {
			return ResponseEntity.ok().body(e);
		}

	}

	@PostMapping("/recieved-file")
	public ResponseEntity<?> saveRecievedUserFileMessage(String requestData, HttpSession session)
			throws IOException {
		try {
			ChatUser c = (ChatUser) session.getAttribute("user");
			if (c == null)
				return ResponseEntity.badRequest().body("Session has expired");
			JSONObject json = new JSONObject(requestData);
			long recievedMessageId = json.getLong("recievedMessageId");
			Message mId = mDao.getSingleMessage(recievedMessageId);
			Set<Message> set = new HashSet<Message>();

			set.add(mDao.updateMessage(new Message(mId.getMessage_id(), mId.getToUser(), mId.getContent(),
					null, mId.getMsgLabel(),
					mId.getSendDate(), LocalDateTime.now().toString())));
			return ResponseEntity.ok().body(set);
		} catch (Exception e) {
			return ResponseEntity.ok().body(e);
		}
	}

	@GetMapping("/get-message")
	public ResponseEntity<?> fetchMessage(String requestData, HttpSession session) {
		try {
			ChatUser c = (ChatUser) session.getAttribute("user");
			if (c == null)
				return ResponseEntity.badRequest().body("Session has expired");
			JSONObject json = new JSONObject(requestData);
			long user_id = json.getLong("u_id");
			long f_id = json.getLong("f_id");
			List<Message> list = new ArrayList<>();
			list.addAll(mDao.getFriendMessages(user_id, f_id));
			list.addAll(mDao.getFriendMessages(f_id, user_id));
			return ResponseEntity.ok().body(list);
		} catch (Exception e) {
			return ResponseEntity.ok().body(e);
		}
	}

	@PostMapping("/upload-profile-pic")
	public ResponseEntity<?> uploadProfilePic(@RequestParam("file") MultipartFile uploadfile, HttpSession session) {
		try {
			ChatUser c = (ChatUser) session.getAttribute("user");
			if (c == null)
				return ResponseEntity.badRequest().body("Session has expired");
			dao.uploadProfilePic(uploadfile.getBytes(), c.getUser_id());
			byte[] encodeBase64 = Base64.encodeBase64(uploadfile.getBytes());

			return ResponseEntity.ok().body(encodeBase64);
		} catch (Exception e) {
			return ResponseEntity.ok().body(e);
		}
	}

	@GetMapping("/get-profile-pic")
	public ResponseEntity<?> uploadProfilePic(String requestData, HttpSession session) {
		try {
			ChatUser c = (ChatUser) session.getAttribute("user");
			if (c == null)
				return ResponseEntity.badRequest().body("Session has expired");
			byte[] loggedInPic = dao.getLoggedInPic(Long.parseLong(requestData));
			byte[] profilePic = Base64.encodeBase64(loggedInPic);

			return ResponseEntity.ok().body(profilePic);
		} catch (Exception e) {
			return ResponseEntity.ok().body(e);
		}
	}

	@GetMapping("/rename-friend")
	public ResponseEntity<?> renameFriend(String rename, long user_id, long friendId, HttpSession session) {
		try {
			ChatUser c = (ChatUser) session.getAttribute("user");
			if (c == null)
				return ResponseEntity.badRequest().body("Session has expired");
			fDao.renameMyFriend(rename, user_id, friendId);
			return ResponseEntity.ok().body(rename);
		} catch (Exception e) {
			return ResponseEntity.ok().body(e);
		}
	}

	@GetMapping("/blocked-friend")
	public ResponseEntity<?> saveBlockedUser(String requestData, HttpSession session) {
		try {
			ChatUser c = (ChatUser) session.getAttribute("user");
			if (c == null)
				return ResponseEntity.badRequest().body("Session has expired");
			ChatUser friend = dao.getSingleUser(Long.parseLong(requestData));
			Friends checkRowExist = fDao.checkBlockedOrNot(c.getUser_id(), friend.getUser_id());
			if (checkRowExist == null) {
				return ResponseEntity.ok().body(fDao.saveBlockedFriends(friend, c.getUser_id(), true));
			} else {
				return ResponseEntity.ok()
						.body(fDao.updateSaveBlockedFriends(checkRowExist.getfId(), checkRowExist.getSaveName(),
								checkRowExist.getMyFriend(), c.getUser_id(), true, checkRowExist.isFriend()));
			}
		} catch (Exception e) {
			return ResponseEntity.ok().body(e);
		}

	}

	@GetMapping("/unblocked-friend")
	public ResponseEntity<?> saveUnBlockedUser(String requestData, HttpSession session) {
		try {
			ChatUser c = (ChatUser) session.getAttribute("user");
			if (c == null)
				return ResponseEntity.badRequest().body("Session has expired");
			ChatUser friend = dao.getSingleUser(Long.parseLong(requestData));
			Friends checkRowExist = fDao.checkBlockedOrNot(c.getUser_id(), friend.getUser_id());
			if (checkRowExist == null) {
				return null;

			} else {
				return ResponseEntity.ok()
						.body(fDao.updateSaveBlockedFriends(checkRowExist.getfId(), checkRowExist.getSaveName(),
								checkRowExist.getMyFriend(), c.getUser_id(), false, checkRowExist.isFriend()));
			}
		} catch (Exception e) {
			return ResponseEntity.ok().body(e);
		}

	}

	@GetMapping("/check-blocked-friend")
	public ResponseEntity<?> checkBlockedOrNot(String requestData, HttpSession session) {
		try {
			ChatUser c = (ChatUser) session.getAttribute("user");
			if (c == null)
				return ResponseEntity.badRequest().body("Session has expired");
			ChatUser friend = dao.getSingleUser(Long.parseLong(requestData));
			Friends checkBlockedOrNot = fDao.checkBlockedOrNot(c.getUser_id(), friend.getUser_id());
			if (checkBlockedOrNot == null) {
				return ResponseEntity.ok().body(false);
			} else {

				return ResponseEntity.ok().body(checkBlockedOrNot.isBlocked());
			}
		} catch (Exception e) {
			return ResponseEntity.ok().body(e);
		}
	}

	@GetMapping("/get-friend-row")
	public ResponseEntity<?> getFriendRow(String requestData, HttpSession session) {

		try {
			ChatUser c = (ChatUser) session.getAttribute("user");
			if (c == null)
				return ResponseEntity.badRequest().body("Session has expired");
			ChatUser friend = dao.getSingleUser(Long.parseLong(requestData));
			Friends checkBlockedOrNot = fDao.checkBlockedOrNot(c.getUser_id(), friend.getUser_id());
			if (checkBlockedOrNot == null) {
				return null;
			} else {

				return ResponseEntity.ok().body(friend);
			}
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e);
		}
	}

	// @ExceptionHandler(Exception.class)
	// public ModelAndView handleError(Exception ex, Model m, HttpSession session) {
	// System.out.println("Exception aaya hai");
	// ModelAndView mv = new ModelAndView();
	// mv.setViewName("pages/error");
	// return mv;
	// }

}
