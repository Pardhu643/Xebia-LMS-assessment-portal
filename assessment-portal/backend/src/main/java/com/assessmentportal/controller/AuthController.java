package com.assessmentportal.controller;

import com.assessmentportal.dto.LoginRequest;
import com.assessmentportal.model.User;
import com.assessmentportal.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmailAndRole(request.getEmail(), request.getRole());

        if (!userOpt.isPresent()) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Invalid email or role.");
            return ResponseEntity.status(401).body(err);
        }

        User user = userOpt.get();

        if (!user.getPassword().equals(request.getPassword())) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Invalid password.");
            return ResponseEntity.status(401).body(err);
        }

        Map<String, String> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("avatar", user.getAvatar() != null ? user.getAvatar() : "");
        response.put("batch", user.getBatch() != null ? user.getBatch() : "");
        response.put("rollNumber", user.getRollNumber() != null ? user.getRollNumber() : "");
        return ResponseEntity.ok(response);
    }
}
