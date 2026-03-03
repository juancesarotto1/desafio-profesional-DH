package com.carrental.backend.controller;

import com.carrental.backend.model.Category;
import com.carrental.backend.service.CategoryService;
<<<<<<< HEAD
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
=======
>>>>>>> origin/master
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<Category> getAll() {
        return categoryService.findAll();
    }

    @PostMapping
<<<<<<< HEAD
    @PreAuthorize("hasRole('ADMIN')")
    public Category create(@RequestBody Category category) {
        return categoryService.save(category);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Category> update(@PathVariable Long id, @RequestBody Category category) {
        // Simple check if exists effectively handled by save in this simpler impl,
        // but explicit check is better for 404s on non-existent IDs if desired.
        // For consistency with other controllers:
        // We need findById in service to do this cleanly, checking service now.
        // Assuming findById exists (it usually does in JPA repos).
        // If service doesn't expose it, we might need to add it or just save.
        // Let's assume standard pattern.
        category.setId(id);
        return ResponseEntity.ok(categoryService.save(category));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.deleteById(id);
        return ResponseEntity.ok().build();
    }
=======
    public Category create(@RequestBody Category category) {
        return categoryService.save(category);
    }
>>>>>>> origin/master
}
