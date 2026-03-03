package com.carrental.backend.service;

import com.carrental.backend.model.Category;
import com.carrental.backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;
<<<<<<< HEAD
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
=======
import java.util.List;
>>>>>>> origin/master

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

<<<<<<< HEAD
    @Transactional(readOnly = true)
    public List<Category> findAll() {
        // La consulta DISTINCT en el repositorio ya elimina duplicados
        // Pero mantenemos una deduplicación adicional por seguridad
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .collect(Collectors.toMap(
                        Category::getId,
                        category -> category,
                        (existing, replacement) -> existing
                ))
                .values()
                .stream()
                .collect(Collectors.toList());
=======
    public List<Category> findAll() {
        return categoryRepository.findAll();
>>>>>>> origin/master
    }

    public Category save(Category category) {
        return categoryRepository.save(category);
    }
<<<<<<< HEAD

    public void deleteById(Long id) {
        categoryRepository.deleteById(id);
    }
=======
>>>>>>> origin/master
}
