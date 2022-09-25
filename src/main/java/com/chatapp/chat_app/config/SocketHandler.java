package com.chatapp.chat_app.config;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

import javax.servlet.http.HttpSession;
import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import org.springframework.stereotype.Component;

import com.chatapp.chat_app.model.ChatUser;
import com.chatapp.chat_app.model.Message;
import com.google.gson.Gson;

@Component
@ServerEndpoint(value = "/chat/{username}",
                encoders = MessageEncoder.class, 
                decoders = MessageDecoder.class
)
public class SocketHandler{
    private static Map<String, ChatUser> users  = new HashMap<>();
    private Session session;
    private String username;
    private static final Set<SocketHandler> chatEndpoints = new CopyOnWriteArraySet<>();
    
    @OnOpen
    public void onOpen(Session session, @PathParam("username") String username) throws IOException, EncodeException {
        this.session = session;
        this.username = username;
        chatEndpoints.add(this);
        // System.out.println(users.toString());
        ChatUser user = new ChatUser();
        user.setUserName(username);
        user.setActive(true);
        users.put(session.getId(), user);        
        broadcast(user);

    }
    @OnMessage
    public void onMessage(Session session, Message message) throws IOException, EncodeException {
        System.out.println("Message");
        // message.setFromUser(users.get(session.getId()));
        // sendMessageToOneUser(message);
    }
    @OnClose
    public void onClose(Session session) throws IOException, EncodeException {

        chatEndpoints.remove(this);
        System.out.println("Disconnetced");
        ChatUser user = new ChatUser();
        user.setUserName(username);
        user.setActive(false);
        users.put(session.getId(), user);
        
        broadcast(user);
        users.remove(session.getId());
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        System.out.println(throwable);
        
    }
    private static void sendMessageToOneUser(Message message) throws IOException, EncodeException {
        for (SocketHandler endpoint : chatEndpoints) {
            synchronized(endpoint) {
                if (endpoint.session.getId().equals(getSessionId(message.getToUser()))) {
                    endpoint.session.getBasicRemote().sendObject(message);
                }
            }
        }
    }

    private static String getSessionId(String to) {
        if (users.containsValue(to)) {
            for (String sessionId: users.keySet()) {
                if (users.get(sessionId).equals(to)) {
                    return sessionId;
                }
            }
        }
        return null;
    }
    private static void broadcast(ChatUser user) throws IOException, EncodeException {
        for (SocketHandler endpoint : chatEndpoints) {
            synchronized(endpoint) {
                endpoint.session.getBasicRemote().sendObject(user);
            }
        }
    }
    
}
