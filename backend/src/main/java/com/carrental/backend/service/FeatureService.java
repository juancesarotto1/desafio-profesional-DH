package com.carrental.backend.service;

import com.carrental.backend.model.Feature;
import com.carrental.backend.repository.FeatureRepository;
import com.carrental.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class FeatureService {
    private final FeatureRepository featureRepository;
    private final ProductRepository productRepository;

    public FeatureService(FeatureRepository featureRepository, ProductRepository productRepository) {
        this.featureRepository = featureRepository;
        this.productRepository = productRepository;
    }

    public List<Feature> findAll() {
        return featureRepository.findAll();
    }

    public Optional<Feature> findById(Long id) {
        return featureRepository.findById(id);
    }

    public Feature save(Feature feature) {
        return featureRepository.save(feature);
    }

    @Transactional
    public void deleteById(Long id) {
        // Remove feature from all products first to avoid FK constraint on product_features
        productRepository.findAll().forEach(product -> {
            if (product.getFeatures().removeIf(f -> f.getId().equals(id))) {
                productRepository.save(product);
            }
        });
        featureRepository.deleteById(id);
    }
}
