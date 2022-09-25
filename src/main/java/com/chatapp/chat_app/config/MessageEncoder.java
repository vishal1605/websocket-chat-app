package com.chatapp.chat_app.config;

import java.util.Map;

import javax.websocket.EncodeException;
import javax.websocket.Encoder;
import javax.websocket.EndpointConfig;

import com.chatapp.chat_app.model.ChatUser;
import com.chatapp.chat_app.model.Message;
import com.google.gson.Gson;

public class MessageEncoder implements Encoder.Text<ChatUser> {

    @Override
    public void destroy() {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void init(EndpointConfig arg0) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public String encode(ChatUser user) throws EncodeException {
        System.out.println(user);
        Gson gson = new Gson();
        String json = gson.toJson(user);
        return json;
    }

}
