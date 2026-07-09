package com.assessmentportal.controller;

import com.assessmentportal.model.Batch;
import com.assessmentportal.repository.BatchRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/batches")
public class BatchController {

    private final BatchRepository batchRepository;

    public BatchController(BatchRepository batchRepository) {
        this.batchRepository = batchRepository;
    }

    @GetMapping
    public List<Batch> getAll() {
        return batchRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Batch batch) {
        if (batch.getBatchName() == null || batch.getBatchName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Batch name is required");
        }
        
        Optional<Batch> existing = batchRepository.findByBatchName(batch.getBatchName().trim());
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("A batch with name '" + batch.getBatchName() + "' already exists.");
        }

        batch.setId(UUID.randomUUID().toString());
        String now = LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME);
        batch.setCreatedAt(now);
        batch.setUpdatedAt(now);
        
        Batch saved = batchRepository.save(batch);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return batchRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Batch updates) {
        return batchRepository.findById(id).map(existing -> {
            if (updates.getBatchName() != null && !updates.getBatchName().trim().isEmpty()) {
                String newName = updates.getBatchName().trim();
                if (!newName.equals(existing.getBatchName())) {
                    Optional<Batch> duplicate = batchRepository.findByBatchName(newName);
                    if (duplicate.isPresent()) {
                        return ResponseEntity.status(HttpStatus.CONFLICT).body("A batch with name '" + newName + "' already exists.");
                    }
                    existing.setBatchName(newName);
                }
            }
            if (updates.getCourse() != null) existing.setCourse(updates.getCourse());
            if (updates.getSubject() != null) existing.setSubject(updates.getSubject());
            if (updates.getDescription() != null) existing.setDescription(updates.getDescription());
            if (updates.getStartDate() != null) existing.setStartDate(updates.getStartDate());
            if (updates.getEndDate() != null) existing.setEndDate(updates.getEndDate());
            
            existing.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
            
            Batch saved = batchRepository.save(existing);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        if (!batchRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        batchRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
