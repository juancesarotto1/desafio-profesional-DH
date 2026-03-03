package com.carrental.backend.controller;

import com.carrental.backend.model.Feature;
import com.carrental.backend.service.FeatureService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/features")
@CrossOrigin(origins = "*")
public class FeatureController {
    private final FeatureService featureService;

    public FeatureController(FeatureService featureService) {
        this.featureService = featureService;
    }

    @GetMapping
    public List<Feature> getAll() {
        return featureService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Feature> getById(@PathVariable Long id) {
        return featureService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Feature create(@RequestBody Feature feature) {
        return featureService.save(feature);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Feature> update(@PathVariable Long id, @RequestBody Feature feature) {
        return featureService.findById(id)
                .map(existingFeature -> {
                    feature.setId(id);
                    return ResponseEntity.ok(featureService.save(feature));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        featureService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
