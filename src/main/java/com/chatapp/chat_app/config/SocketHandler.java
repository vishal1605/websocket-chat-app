package com.chatapp.chat_app.config;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import javax.websocket.EncodeException;

import org.json.JSONObject;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

import com.chatapp.chat_app.model.ChatUser;
import com.chatapp.chat_app.model.Message;
import com.google.gson.Gson;

@Component
public class SocketHandler extends AbstractWebSocketHandler {
    static List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    private static Map<String, ChatUser> users = new HashMap<>();
    Message m = null;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // System.out.println("Connection establish");
        ChatUser user = (ChatUser) session.getAttributes().get("log");
        // String username = session.getUri().toString().split("/")[4];

        user.setActive(true);
        users.put(session.getId(), user);
        sessions.add(session);
        // System.out.println(session.getHandshakeHeaders().get("sec-websocket-key")+"connect");
        ConnectBroadcast();
        System.out.println(users.toString());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // System.out.println("Connection closed");
        sessions.remove(session);
        ChatUser user = (ChatUser) session.getAttributes().get("log");
        user.setActive(false);
        users.remove(session.getId());
        ConnectBroadcast();
        disconnectBroadcast(user);
        System.out.println(users.toString());

    }

    @Override
	public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
    	if (message instanceof TextMessage) {
            m = new Gson().fromJson((String) message.getPayload(), Message.class);
            sendMessageToOneUser(m);
		}else if (message instanceof BinaryMessage) {
			ByteBuffer b = (ByteBuffer) message.getPayload();
			sendByteToOneUser(m, b.array());
		}
    	
	}

    private static void sendMessageToOneUser(Message message) throws IOException,
            EncodeException {
        for (WebSocketSession endpoint : sessions) {
            synchronized (endpoint) {
                if (endpoint.getId().equals(getSessionId(message.getToUser()))) {
                    endpoint.sendMessage(new TextMessage(new Gson().toJson(message)));
                }
                
            }
        }
    }
    private static void sendByteToOneUser(Message message, byte[] b) throws IOException, EncodeException {
		for (WebSocketSession endpoint : sessions) {
			synchronized (endpoint) {
				if (endpoint.getId().equals(getSessionId(message.getToUser()))) {
					endpoint.sendMessage(new BinaryMessage(b));
				}
				
			}
		}
	}

    private static String getSessionId(ChatUser to) {
        Map<String, ChatUser> map = users.entrySet().stream()
                .filter((u) -> u.getValue().getUser_id() == to.getUser_id())
                .collect(Collectors.toMap(Entry::getKey, Entry::getValue));
        for (var entry : map.entrySet()) {
            return entry.getKey();
        }
        return null;
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        // TODO Auto-generated method stub
        System.out.println(exception);
        super.handleTransportError(session, exception);
    }

    private static void ConnectBroadcast() throws IOException, EncodeException {
        for (String sessionId : users.keySet()) {
            Gson gson = new Gson();
            String json = gson.toJson(users.get(sessionId));
            for (WebSocketSession endpoint : sessions) {
                synchronized (endpoint) {

                    endpoint.sendMessage(new TextMessage(json));
                }
            }

        }

    }

    private static void disconnectBroadcast(ChatUser user) throws IOException, EncodeException {

        Gson gson = new Gson();
        String json = gson.toJson(user);
        for (WebSocketSession endpoint : sessions) {
            synchronized (endpoint) {

                endpoint.sendMessage(new TextMessage(json));
            }
        }

    }


}
