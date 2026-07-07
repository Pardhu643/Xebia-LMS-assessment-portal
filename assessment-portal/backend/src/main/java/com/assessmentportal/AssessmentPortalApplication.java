package com.assessmentportal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@SpringBootApplication
public class AssessmentPortalApplication {

    public static void main(String[] args) {
        loadDotEnv();
        SpringApplication.run(AssessmentPortalApplication.class, args);
    }

    private static void loadDotEnv() {
        Path[] pathsToTry = {
            Paths.get(".env"),
            Paths.get("../.env"),
            Paths.get("backend/.env"),
            Paths.get("../backend/.env")
        };

        for (Path path : pathsToTry) {
            if (Files.exists(path)) {
                try {
                    List<String> lines = Files.readAllLines(path);
                    for (String line : lines) {
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#")) {
                            continue;
                        }
                        int eqIdx = line.indexOf('=');
                        if (eqIdx != -1) {
                            String key = line.substring(0, eqIdx).trim();
                            String value = line.substring(eqIdx + 1).trim();
                            if (System.getenv(key) == null && System.getProperty(key) == null) {
                                System.setProperty(key, value);
                            }
                        }
                    }
                    System.out.println("[DotEnv] Loaded environment properties from: " + path.toAbsolutePath());
                    break;
                } catch (IOException e) {
                    System.err.println("[DotEnv] Failed to read .env file: " + e.getMessage());
                }
            }
        }
    }
}
