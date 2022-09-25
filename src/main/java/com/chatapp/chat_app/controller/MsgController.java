package com.chatapp.chat_app.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.chatapp.chat_app.model.ChatUser;
import com.chatapp.chat_app.services.UserDao;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

@RestController
public class MsgController {

    @Autowired
    private UserDao dao;

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
        if (u == null) {
            mv.setViewName("redirect:/login-form");
            return mv;
        }
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
    public ModelAndView dashboard(@PathVariable("name") String name) {
        ModelAndView mv = new ModelAndView();
        // System.out.println(name+"dash");
        mv.setViewName("pages/dashboard");
        return mv;

    }

    @GetMapping("/dashboard/chat/{name}")
    public ModelAndView chat(@PathVariable("name") String name, Model m, HttpSession session) {
        ModelAndView mv = new ModelAndView();
        m.addAttribute("username", name);
        // System.out.println(name+"dash");
        // ChatUser c = (ChatUser)session.getAttribute("user");
        // c.setActive(true);
        mv.setViewName("pages/chat-app");
        return mv;

    }

    @GetMapping("/active-users")
    public String activeUsers(String requestData, HttpSession session, ChatUser u) throws JsonMappingException, JsonProcessingException {
        System.out.println(requestData);
        List<Object> list = new ArrayList<>();
        JSONArray jsonArray = new JSONArray(requestData);
        for (int i = 0; i < jsonArray.length(); i++) {
            list.add(jsonArray.get(i));
            //JSONObject jo = jsonArray.getJSONObject(i);
            
            // u = dao.login(jo.getString("userName"));
            // u.setActive(jo.getBoolean("isActive"));
        }
        // System.out.println(u);
        
        return list.toString();

    }

}
