package com.carrental.backend.service;

import com.carrental.backend.model.Category;
import com.carrental.backend.repository.CategoryRepository;
import com.carrental.backend.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryService(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

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
    }

    public Category save(Category category) {
        return categoryRepository.save(category);
    }

    public void deleteById(Long id) {
        long count = productRepository.findByCategoryId(id).size();
        if (count > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "No se puede eliminar: la categoría tiene " + count + " producto(s) asociado(s). Reasígnalos antes de eliminar.");
        }
        categoryRepository.deleteById(id);
    }
}
