package com.raison.timesheet.service;

import java.util.Optional;
import java.util.Random;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.raison.timesheet.DTO.LoginRequest;
import com.raison.timesheet.Entity.RandomNumberLog;
import com.raison.timesheet.Entity.UserCredential;
import com.raison.timesheet.Repository.RandomNumberLogRepository;
import com.raison.timesheet.Repository.UserCredentialRepository;

@Service
public class UserService {

    @Autowired
    private UserCredentialRepository userCredentialRepository;

    @Autowired
    private RandomNumberLogRepository randomNumberLogRepository;

    public int generateRandomNumber(String username, String ipAddress) {
        int randomNumber = new Random().nextInt(999999);
        RandomNumberLog log = new RandomNumberLog(username, ipAddress, randomNumber);
        randomNumberLogRepository.save(log);
        return randomNumber;
    }

   // Decode the value sent by the frontend and validate credentials
   public String decodeAndLogin(LoginRequest loginRequest) {
    Optional<RandomNumberLog> log = randomNumberLogRepository.findByUsername(loginRequest.getUsername());
    if (log.isEmpty()) {
        return "Random number not found";
    }

    int randomNumber = log.get().getRandomNumber();
    int decodedPassword = Integer.parseInt(loginRequest.getEncodedValue()) - randomNumber;

    UserCredential user = userCredentialRepository.findByUsername(loginRequest.getUsername());
    if (user == null || user.getPassword().hashCode() != decodedPassword) {
        return "Invalid username or password";
    }

    // Cleanup after successful login
    randomNumberLogRepository.delete(log.get());
    return "Login successful";
}
}


