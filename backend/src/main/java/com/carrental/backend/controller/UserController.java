package com.carrental.backend.controller;

import com.carrental.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAll() {
        List<Map<String, Object>> users = userService.findAll().stream()
                .map(u -> {
                    Map<String, Object> dto = new HashMap<>();
                    dto.put("id", u.getId());
                    dto.put("name", u.getName());
                    dto.put("lastname", u.getLastname());
                    dto.put("email", u.getEmail());
                    dto.put("role", u.getRole());
                    return dto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String role = body.get("role");
        var updated = userService.updateRole(id, role);
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", updated.getId());
        dto.put("name", updated.getName());
        dto.put("lastname", updated.getLastname());
        dto.put("email", updated.getEmail());
        dto.put("role", updated.getRole());
        return ResponseEntity.ok(dto);
    }
}
