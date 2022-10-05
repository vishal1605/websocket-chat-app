package com.chatapp.chat_app.config;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

import javax.websocket.EncodeException;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

import com.chatapp.chat_app.model.ChatUser;
import com.google.gson.Gson;

@Component
public class SocketHandler extends AbstractWebSocketHandler{
    static List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    private static Map<String, ChatUser> users  = new HashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        //System.out.println("Connection establish");
        String username = session.getUri().toString().split("/")[4];
        ChatUser user = new ChatUser();
        user.setUserName(username);
        user.setActive(true);
        users.put(session.getId(), user);
        sessions.add(session);
        broadcast(user);
        System.out.println(users.toString());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        //System.out.println("Connection closed");
        sessions.remove(session);
        String username = session.getUri().toString().split("/")[4];
        ChatUser user = new ChatUser();
        user.setUserName(username);
        user.setActive(false);
        users.remove(session.getId());
        
        broadcast(user);
        System.out.println(users.toString());
        
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // TODO Auto-generated method stub
        super.handleTextMessage(session, message);
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        // TODO Auto-generated method stub
        super.handleTransportError(session, exception);
    }

    private static void broadcast(ChatUser user) throws IOException, EncodeException {
        Gson gson = new Gson();
        String json = gson.toJson(user);
        for (WebSocketSession endpoint : sessions) {
            synchronized(endpoint) {
                endpoint.sendMessage(new TextMessage(json));
            }
        }
    }
    
}
