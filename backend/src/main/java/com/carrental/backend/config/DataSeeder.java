package com.carrental.backend.config;

import com.carrental.backend.model.*;
import com.carrental.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.HashSet;
import java.util.stream.Collectors;

@Configuration
public class DataSeeder {

        @Bean
        CommandLineRunner initDatabase(ProductRepository productRepository,
                        CategoryRepository categoryRepository,
                        UserRepository userRepository,
                        PasswordEncoder passwordEncoder) {
                return args -> {
                        cleanupDuplicates(productRepository, categoryRepository);

                        // Users
                        if (userRepository.findByEmail("admin@admin.com").isEmpty()) {
                                User admin = new User();
                                admin.setName("Admin");
                                admin.setLastname("Super");
                                admin.setEmail("admin@admin.com");
                                admin.setPassword(passwordEncoder.encode("admin123"));
                                admin.setRole("ADMIN");
                                userRepository.save(admin);
                                System.out.println("ADMIN user created: admin@admin.com / admin123");
                        }

                        // Categories
                        Category suv = getOrCreateCategory(categoryRepository, "SUV", "Sport Utility Vehicles",
                                        "https://images.unsplash.com/photo-1519302959554-a75be0afc82a?auto=format&fit=crop&w=500&q=80");
                        Category electric = getOrCreateCategory(categoryRepository, "Electric", "Sustainable driving",
                                        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=500&q=80");
                        Category luxury = getOrCreateCategory(categoryRepository, "Luxury", "Elegance and comfort",
                                        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=500&q=80");
                        Category economy = getOrCreateCategory(categoryRepository, "Economy",
                                        "Fuel efficient and affordable",
                                        "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=500&q=80");
                        Category convertible = getOrCreateCategory(categoryRepository, "Convertible", "Feel the wind",
                                        "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=500&q=80");
                        Category sedan = getOrCreateCategory(categoryRepository, "Sedan", "Practical and comfortable",
                                        "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=500&q=80");

                        // Products
                        List<Product> existingProducts = productRepository.findAll();

                        createProductIfNotExists(productRepository, existingProducts, "Tesla Model 3",
                                        "Fully electric, with impressive acceleration.", "Buenos Aires", electric, 95.0,
                                        4.9, 124,
                                        "https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1000&q=80");

                        createProductIfNotExists(productRepository, existingProducts, "Jeep Wrangler",
                                        "Perfect for tough terrains and off-road adventures.", "Mendoza", suv, 120.0,
                                        4.8, 86,
                                        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80");

                        createProductIfNotExists(productRepository, existingProducts, "Chevrolet Onix",
                                        "Economic and reliable for city driving.", "Córdoba", economy, 45.0, 4.5, 210,
                                        "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80");

                        createProductIfNotExists(productRepository, existingProducts, "Ford Mustang",
                                        "Iconic muscle car with a powerful engine.", "Miami", convertible, 150.0, 5.0,
                                        45,
                                        "https://images.unsplash.com/photo-1584345604481-03bd1a37c741?auto=format&fit=crop&w=1000&q=80");

                        createProductIfNotExists(productRepository, existingProducts, "Audi R8",
                                        "Supercar performance with luxury finishes.", "Los Angeles", luxury, 350.0, 4.9,
                                        12,
                                        "https://images.unsplash.com/photo-1603584173870-7f394856f4d5?auto=format&fit=crop&w=1000&q=80");

                        createProductIfNotExists(productRepository, existingProducts, "BMW 3 Series",
                                        "The ultimate driving machine for everyday use.", "Bariloche", sedan, 85.0, 4.7,
                                        98,
                                        "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80");
                };
        }

        private void createProductIfNotExists(ProductRepository repo, List<Product> existing, String name, String desc,
                        String city, Category cat, Double price, Double rating, Integer trips, String imgUrl) {
                if (existing.stream().noneMatch(p -> p.getName().equalsIgnoreCase(name))) {
                        Product p = new Product();
                        p.setName(name);
                        p.setDescription(desc);
                        p.setCity(city);
                        p.setCategory(cat);
                        p.setPrice(price);
                        p.setRating(rating);
                        p.setTrips(trips);
                        p.setImages(new ArrayList<>(List.of(new Image(null, name + " Main", imgUrl))));
                        repo.save(p);
                        System.out.println("Product created: " + name);
                }
        }

        private Category getOrCreateCategory(CategoryRepository repo, String name, String description,
                        String imageUrl) {
                return repo.findAll().stream()
                                .filter(c -> c.getName().equalsIgnoreCase(name))
                                .findFirst()
                                .orElseGet(() -> {
                                        System.out.println("Category created: " + name);
                                        return repo.save(new Category(null, name, description, imageUrl));
                                });
        }

        private void cleanupDuplicates(ProductRepository productRepo, CategoryRepository categoryRepo) {
                System.out.println("Checking for duplicates...");

                // 1. Deduplicate Categories
                List<Category> allCategories = categoryRepo.findAll();
                Map<String, List<Category>> categoriesByName = allCategories.stream()
                                .collect(Collectors.groupingBy(c -> c.getName().trim().toLowerCase()));

                for (Map.Entry<String, List<Category>> entry : categoriesByName.entrySet()) {
                        List<Category> duplicates = entry.getValue();
                        if (duplicates.size() > 1) {
                                System.out.println("Found duplicate categories for: " + entry.getKey());
                                Category primary = duplicates.get(0);
                                List<Category> toReference = duplicates.subList(1, duplicates.size());
                                Set<Long> duplicateIds = toReference.stream().map(Category::getId)
                                                .collect(Collectors.toSet());

                                // Update products referencing duplicates to reference primary
                                List<Product> products = productRepo.findAll();
                                boolean productsUpdated = false;
                                for (Product p : products) {
                                        if (p.getCategory() != null && duplicateIds.contains(p.getCategory().getId())) {
                                                p.setCategory(primary);
                                                productRepo.save(p);
                                                productsUpdated = true;
                                        }
                                }
                                if (productsUpdated) {
                                        productRepo.flush();
                                        System.out.println("Updated products to reference primary category: "
                                                        + primary.getName());
                                }

                                // Delete duplicates
                                categoryRepo.deleteAll(toReference);
                                System.out.println("Deleted " + toReference.size() + " duplicate categories.");
                        }
                }

                // 2. Deduplicate Products
                List<Product> allProducts = productRepo.findAll();
                Map<String, List<Product>> productsByName = allProducts.stream()
                                .collect(Collectors.groupingBy(p -> p.getName().trim().toLowerCase()));

                for (Map.Entry<String, List<Product>> entry : productsByName.entrySet()) {
                        List<Product> duplicates = entry.getValue();
                        if (duplicates.size() > 1) {
                                System.out.println("Found duplicate products for: " + entry.getKey());
                                // Keep the first one
                                List<Product> toDelete = duplicates.subList(1, duplicates.size());
                                try {
                                        productRepo.deleteAll(toDelete);
                                        System.out.println("Deleted " + toDelete.size() + " duplicate products.");
                                } catch (Exception e) {
                                        System.err.println("Could not delete duplicate products for " + entry.getKey()
                                                        + ": " + e.getMessage());
                                }
                        }
                }
                System.out.println("Deduplication complete.");
        }
}
