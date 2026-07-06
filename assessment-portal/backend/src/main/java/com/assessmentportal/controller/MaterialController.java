package com.assessmentportal.controller;

import com.assessmentportal.model.Material;
import com.assessmentportal.repository.MaterialRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    private final MaterialRepository materialRepository;

    public MaterialController(MaterialRepository materialRepository) {
        this.materialRepository = materialRepository;
    }

    @GetMapping
    public List<Material> getAll(@RequestParam(required = false) String batch) {
        if (batch != null && !batch.isEmpty() && !batch.equals("All Batches")) {
            return materialRepository.findByBatch(batch);
        }
        return materialRepository.findAll();
    }

    @PostMapping
    public Material upload(@RequestBody Material material) {
        return materialRepository.save(material);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        if (!materialRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        materialRepository.deleteById(id);
        Map<String, Boolean> result = new HashMap<>();
        result.put("success", true);
        return ResponseEntity.ok(result);
    }
}
