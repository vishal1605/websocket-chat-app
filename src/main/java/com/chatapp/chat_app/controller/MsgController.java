package com.chatapp.chat_app.controller;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import com.chatapp.chat_app.model.ChatUser;
import com.chatapp.chat_app.services.UserDao;

@Controller
public class MsgController {

    @Autowired
    private UserDao dao;

    @GetMapping("/")
    public String home(HttpSession session, Model m) {

        var s = session.getAttribute("successMsg");
        m.addAttribute("succMsg", s);
        session.removeAttribute("successMsg");
        return "pages/register";

    }

    @PostMapping("/register")
    public String registerProcess(ChatUser user, HttpSession session) {
        boolean success = false;
        ChatUser u = dao.saveUser(user);

        System.out.println(u);
        session.setAttribute("successMsg", success);
        return "redirect:/";
    }

    @GetMapping("/login-form")
    public String login() {
        System.out.println("Login");
        return "pages/login";

    }

    @PostMapping("/login")
    public String loginProcess(ChatUser user, HttpSession session) {
        
        ChatUser u = dao.login(user.getUserName());
        if (u == null) {
            return "redirect:/login-form";
        }
        session.setAttribute("user", u);
        return "redirect:/dashboard/" + u.getUserName();
    }

    @GetMapping("/dashboard/{name}")
    public String dashboard(@PathVariable("name") String name) {
        // System.out.println(name+"dash");
        return "pages/dashboard";

    }

    @GetMapping("/dashboard/chat/{name}")
    public String chat(@PathVariable("name") String name, Model m) {
        m.addAttribute("username", name);
        // System.out.println(name+"dash");
        return "pages/chat-app";

    }

}
