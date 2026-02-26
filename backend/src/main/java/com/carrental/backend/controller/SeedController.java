package com.carrental.backend.controller;

import com.carrental.backend.model.*;
import com.carrental.backend.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/seed")
@CrossOrigin(origins = "*")
public class SeedController {
        private final ProductRepository productRepository;
        private final CategoryRepository categoryRepository;
        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;

        public SeedController(ProductRepository productRepository, CategoryRepository categoryRepository,
                        UserRepository userRepository, PasswordEncoder passwordEncoder) {
                this.productRepository = productRepository;
                this.categoryRepository = categoryRepository;
                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
        }

        @GetMapping
        public ResponseEntity<String> seedData() {
                // 1. FIX ADMIN ROLE
                User admin = userRepository.findByEmail("admin@admin.com").orElse(null);
                if (admin != null) {
                        admin.setRole("ADMIN");
                        userRepository.save(admin);
                } else {
                        admin = new User();
                        admin.setName("Admin");
                        admin.setLastname("Super");
                        admin.setEmail("admin@admin.com");
                        admin.setPassword(passwordEncoder.encode("admin123"));
                        admin.setRole("ADMIN");
                        userRepository.save(admin);
                }

                // 2. SEED CATEGORIES (idempotent)
                Category suv = getOrCreateCategory("SUV", "Sport Utility Vehicles",
                                "https://images.unsplash.com/photo-1519302959554-a75be0afc82a?auto=format&fit=crop&w=500&q=80");
                Category electric = getOrCreateCategory("Electric", "Sustainable driving",
                                "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=500&q=80");
                Category luxury = getOrCreateCategory("Luxury", "Elegance and comfort",
                                "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=500&q=80");
                Category economy = getOrCreateCategory("Economy", "Fuel efficient and affordable",
                                "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=500&q=80");
                Category convertible = getOrCreateCategory("Convertible", "Feel the wind",
                                "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=500&q=80");
                Category sedan = getOrCreateCategory("Sedan", "Practical and comfortable",
                                "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=500&q=80");

                // 3. SEED PRODUCTS (idempotent)
                createProductIfNotExists("Tesla Model 3", "Fully electric, with impressive acceleration.", "Buenos Aires",
                                electric, 95.0, 4.9, 124,
                                "https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1000&q=80");

                createProductIfNotExists("Jeep Wrangler", "Perfect for tough terrains and off-road adventures.", "Mendoza",
                                suv, 120.0, 4.8, 86,
                                "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80");

                createProductIfNotExists("Chevrolet Onix", "Economic and reliable for city driving.", "Córdoba",
                                economy, 45.0, 4.5, 210,
                                "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80");

                createProductIfNotExists("Ford Mustang", "Iconic muscle car with a powerful engine.", "Miami",
                                convertible, 150.0, 5.0, 45,
                                "https://images.unsplash.com/photo-1584345604481-03bd1a37c741?auto=format&fit=crop&w=1000&q=80");

                createProductIfNotExists("Audi R8", "Supercar performance with luxury finishes.", "Los Angeles",
                                luxury, 350.0, 4.9, 12,
                                "https://images.unsplash.com/photo-1603584173870-7f394856f4d5?auto=format&fit=crop&w=1000&q=80");

                createProductIfNotExists("BMW 3 Series", "The ultimate driving machine for everyday use.", "Bariloche",
                                sedan, 85.0, 4.7, 98,
                                "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80");

                return ResponseEntity.ok("Database: Seed run completed (idempotent).");
        }

        private Category getOrCreateCategory(String name, String description, String imageUrl) {
                return categoryRepository.findAll().stream()
                                .filter(c -> c.getName() != null && c.getName().equalsIgnoreCase(name))
                                .findFirst()
                                .orElseGet(() -> categoryRepository.save(new Category(null, name, description, imageUrl)));
        }

        private void createProductIfNotExists(String name, String desc, String city, Category cat, Double price,
                        Double rating, Integer trips, String imgUrl) {
                boolean exists = productRepository.findAll().stream()
                                .anyMatch(p -> p.getName() != null && p.getName().equalsIgnoreCase(name));
                if (!exists) {
                        Product p = new Product();
                        p.setName(name);
                        p.setDescription(desc);
                        p.setCity(city);
                        p.setCategory(cat);
                        p.setPrice(price);
                        p.setRating(rating);
                        p.setTrips(trips);
                        p.setImages(new ArrayList<>(List.of(new Image(null, name + " Main", imgUrl))));
                        productRepository.save(p);
                }
        }
}
