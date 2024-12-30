package com.raison.timesheet.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raison.timesheet.DTO.LoginRequest;
import com.raison.timesheet.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/user")
public class UserController {

     @Autowired
    private UserService userService;

   @GetMapping("/generate-random")
public int generateRandomNumber(@RequestParam String username, HttpServletRequest request) {
    return userService.generateRandomNumber(username, request.getRemoteAddr());
}

    @PostMapping("/decode-and-login")
    public String loginUser(@RequestBody LoginRequest loginRequest) {
        return userService.decodeAndLogin(loginRequest);
    }
}


