package com.carrental.backend.service;

import com.carrental.backend.model.Feature;
import com.carrental.backend.model.Product;
import com.carrental.backend.model.Category;
import com.carrental.backend.repository.CategoryRepository;
import com.carrental.backend.repository.FeatureRepository;
import com.carrental.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final FeatureRepository featureRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, FeatureRepository featureRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.featureRepository = featureRepository;
    }

    @Transactional(readOnly = true)
    public List<Product> findAll() {
        // La consulta DISTINCT en el repositorio ya elimina duplicados
        // Pero mantenemos una deduplicación adicional por seguridad
        List<Product> products = productRepository.findAll();
        return products.stream()
                .collect(Collectors.toMap(
                        Product::getId,
                        product -> product,
                        (existing, replacement) -> existing
                ))
                .values()
                .stream()
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Product> findByCategory(Long categoryId) {
        // La consulta DISTINCT en el repositorio ya elimina duplicados
        // Pero mantenemos una deduplicación adicional por seguridad
        List<Product> products = productRepository.findByCategoryId(categoryId);
        return products.stream()
                .collect(Collectors.toMap(
                        Product::getId,
                        product -> product,
                        (existing, replacement) -> existing
                ))
                .values()
                .stream()
                .collect(Collectors.toList());
    }

    public Product save(Product product) {
        // Resolve or create category by name if provided without id
        if (product.getCategory() != null) {
            Category cat = product.getCategory();
            String catName = cat.getName() != null ? cat.getName().trim() : null;
            if (catName != null && (cat.getId() == null || cat.getId() == 0L)) {
                Category existing = categoryRepository.findByNameIgnoreCase(catName).orElse(null);
                if (existing != null) {
                    product.setCategory(existing);
                } else {
                    // create and persist new category to avoid transient references
                    Category toSave = new Category(null, catName, cat.getDescription(), cat.getImageUrl());
                    product.setCategory(categoryRepository.save(toSave));
                }
            }
        }

        // Resolve features by name to reuse existing ones or persist new ones
        if (product.getFeatures() != null && !product.getFeatures().isEmpty()) {
            Set<Feature> resolved = product.getFeatures().stream()
                    .map(f -> {
                        if (f == null) return null;
                        if (f.getId() != null) return f; // assume managed
                        String fname = f.getName() != null ? f.getName().trim() : null;
                        if (fname == null) return null;
                        Optional<Feature> existing = featureRepository.findByNameIgnoreCase(fname);
                        if (existing.isPresent()) return existing.get();
                        // persist a new feature so it's managed
                        Feature toSave = new Feature(fname, f.getIcon(), f.getDescription());
                        return featureRepository.save(toSave);
                    })
                    .filter(f -> f != null)
                    .collect(Collectors.toSet());
            product.setFeatures(resolved);
        }

        return productRepository.save(product);
    }

    public void deleteById(Long id) {
        productRepository.deleteById(id);
    }
}
