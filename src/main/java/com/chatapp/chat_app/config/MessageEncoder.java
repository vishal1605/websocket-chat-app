package com.chatapp.chat_app.config;

import javax.websocket.EncodeException;
import javax.websocket.Encoder;
import javax.websocket.EndpointConfig;

import com.chatapp.chat_app.model.Message;
import com.google.gson.Gson;

public class MessageEncoder implements Encoder.Text<Message> {

    @Override
    public void destroy() {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void init(EndpointConfig arg0) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public String encode(Message message) throws EncodeException {
        System.out.println(message);
        Gson gson = new Gson();
        String json = gson.toJson(message);
        return json;
    }

}
