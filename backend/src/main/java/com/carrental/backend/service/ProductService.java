package com.carrental.backend.service;

import com.carrental.backend.model.Feature;
import com.carrental.backend.model.Product;
import com.carrental.backend.model.Category;
import com.carrental.backend.repository.BookingRepository;
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
    private final BookingRepository bookingRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository,
            FeatureRepository featureRepository, BookingRepository bookingRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.featureRepository = featureRepository;
        this.bookingRepository = bookingRepository;
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
        // Resolve category: prefer id lookup first, then name-based fallback
        if (product.getCategory() != null) {
            Category cat = product.getCategory();
            if (cat.getId() != null && cat.getId() != 0L) {
                // Fetch managed entity from DB to avoid detached entity issues
                categoryRepository.findById(cat.getId()).ifPresent(product::setCategory);
            } else {
                String catName = cat.getName() != null ? cat.getName().trim() : null;
                if (catName != null) {
                    Category existing = categoryRepository.findByNameIgnoreCase(catName).orElse(null);
                    if (existing != null) {
                        product.setCategory(existing);
                    } else {
                        Category toSave = new Category(null, catName, cat.getDescription(), cat.getImageUrl());
                        product.setCategory(categoryRepository.save(toSave));
                    }
                }
            }
        }

        // Resolve features: fetch managed entities from DB to avoid detached/transient issues
        if (product.getFeatures() != null && !product.getFeatures().isEmpty()) {
            Set<Feature> resolved = product.getFeatures().stream()
                    .filter(f -> f != null)
                    .map(f -> {
                        if (f.getId() != null) {
                            // Fetch managed entity from DB
                            return featureRepository.findById(f.getId()).orElse(null);
                        }
                        String fname = f.getName() != null ? f.getName().trim() : null;
                        if (fname == null) return null;
                        return featureRepository.findByNameIgnoreCase(fname)
                                .orElseGet(() -> featureRepository.save(new Feature(fname, f.getIcon(), f.getDescription())));
                    })
                    .filter(f -> f != null)
                    .collect(Collectors.toSet());
            product.setFeatures(resolved);
        }

        return productRepository.save(product);
    }

    @Transactional
    public void deleteById(Long id) {
        // Remove bookings for this product first to avoid FK constraint
        bookingRepository.deleteAll(bookingRepository.findByProductId(id));
        productRepository.deleteById(id);
    }
}
