package com.assessmentportal.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class UploadController {

    private final Path uploadDir = Paths.get("./uploads");

    public UploadController() {
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize upload folder!", e);
        }
    }

    @PostMapping("/uploads")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "File is empty");
            return ResponseEntity.badRequest().body(error);
        }

        try {
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                originalFilename = "file_" + UUID.randomUUID().toString();
            }

            // Generate unique filename to prevent overwrite
            String filename = System.currentTimeMillis() + "-" + originalFilename.replaceAll("\\s+", "_");
            Path targetPath = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), targetPath);

            // Construct relative fileUrl pointing to preview endpoint
            String fileUrl = "/api/files/preview/" + filename;

            Map<String, Object> response = new HashMap<>();
            response.put("originalName", originalFilename);
            response.put("filename", filename);
            response.put("fileUrl", fileUrl);
            response.put("mimeType", file.getContentType());
            response.put("size", file.getSize());
            response.put("uploadedAt", Instant.now().toString());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to store file: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/files/preview/{filename:.+}")
    public ResponseEntity<Resource> getFilePreview(@PathVariable String filename) {
        try {
            Path path = uploadDir.resolve(filename).normalize();
            if (!Files.exists(path) || !Files.isReadable(path)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(path.toUri());
            String contentType = Files.probeContentType(path);
            
            if (contentType == null) {
                if (filename.toLowerCase().endsWith(".docx")) {
                    contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                } else if (filename.toLowerCase().endsWith(".xlsx")) {
                    contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                } else if (filename.toLowerCase().endsWith(".pdf")) {
                    contentType = "application/pdf";
                } else {
                    contentType = "application/octet-stream";
                }
            }

            String originalName = filename;
            int dashIndex = filename.indexOf('-');
            if (dashIndex != -1) {
                originalName = filename.substring(dashIndex + 1);
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(Files.size(path)))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + originalName + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/files/download/{filename:.+}")
    public ResponseEntity<Resource> getFileDownload(@PathVariable String filename) {
        try {
            Path path = uploadDir.resolve(filename).normalize();
            if (!Files.exists(path) || !Files.isReadable(path)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(path.toUri());
            String contentType = Files.probeContentType(path);
            
            if (contentType == null) {
                if (filename.toLowerCase().endsWith(".docx")) {
                    contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                } else if (filename.toLowerCase().endsWith(".xlsx")) {
                    contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                } else if (filename.toLowerCase().endsWith(".pdf")) {
                    contentType = "application/pdf";
                } else {
                    contentType = "application/octet-stream";
                }
            }

            String originalName = filename;
            int dashIndex = filename.indexOf('-');
            if (dashIndex != -1) {
                originalName = filename.substring(dashIndex + 1);
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(Files.size(path)))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + originalName + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
