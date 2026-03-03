package com.carrental.backend.controller;

import com.carrental.backend.model.*;
import com.carrental.backend.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
<<<<<<< HEAD
import org.springframework.security.crypto.password.PasswordEncoder;
=======
>>>>>>> origin/master
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/seed")
@CrossOrigin(origins = "*")
public class SeedController {
        private final ProductRepository productRepository;
        private final CategoryRepository categoryRepository;
<<<<<<< HEAD
        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;

        public SeedController(ProductRepository productRepository, CategoryRepository categoryRepository,
                        UserRepository userRepository, PasswordEncoder passwordEncoder) {
                this.productRepository = productRepository;
                this.categoryRepository = categoryRepository;
                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
=======

        public SeedController(ProductRepository productRepository, CategoryRepository categoryRepository) {
                this.productRepository = productRepository;
                this.categoryRepository = categoryRepository;
>>>>>>> origin/master
        }

        @GetMapping
        public ResponseEntity<String> seedData() {
<<<<<<< HEAD
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
=======
                // Categories
>>>>>>> origin/master
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

<<<<<<< HEAD
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
=======
                // Products
                if (productRepository.count() < 6) {
                        // 1. Tesla Model 3 (Electric)
                        Product tesla = new Product();
                        tesla.setName("Tesla Model 3");
                        tesla.setDescription("Fully electric, with impressive acceleration.");
                        tesla.setCity("Buenos Aires");
                        tesla.setCategory(electric);
                        tesla.setPrice(95.0);
                        tesla.setRating(4.9);
                        tesla.setTrips(124);
                        tesla.setImages(new ArrayList<>(List.of(
                                        new Image(null, "Tesla Main",
                                                        "https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1000&q=80"))));

                        // 2. Jeep Wrangler (SUV)
                        Product jeep = new Product();
                        jeep.setName("Jeep Wrangler");
                        jeep.setDescription("Perfect for tough terrains and off-road adventures.");
                        jeep.setCity("Mendoza");
                        jeep.setCategory(suv);
                        jeep.setPrice(120.0);
                        jeep.setRating(4.8);
                        jeep.setTrips(86);
                        jeep.setImages(new ArrayList<>(List.of(
                                        new Image(null, "Jeep Main",
                                                        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80"))));

                        // 3. Chevrolet Onix (Economy)
                        Product onix = new Product();
                        onix.setName("Chevrolet Onix");
                        onix.setDescription("Economic and reliable for city driving.");
                        onix.setCity("Córdoba");
                        onix.setCategory(economy);
                        onix.setPrice(45.0);
                        onix.setRating(4.5);
                        onix.setTrips(210);
                        onix.setImages(new ArrayList<>(List.of(
                                        new Image(null, "Onix Main",
                                                        "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80"))));

                        // 4. Ford Mustang (Convertible)
                        Product mustang = new Product();
                        mustang.setName("Ford Mustang");
                        mustang.setDescription("Iconic muscle car with a powerful engine.");
                        mustang.setCity("Miami");
                        mustang.setCategory(convertible);
                        mustang.setPrice(150.0);
                        mustang.setRating(5.0);
                        mustang.setTrips(45);
                        mustang.setImages(new ArrayList<>(List.of(
                                        new Image(null, "Mustang Main",
                                                        "https://images.unsplash.com/photo-1584345604481-03bd1a37c741?auto=format&fit=crop&w=1000&q=80"))));

                        // 5. Audi R8 (Luxury)
                        Product audi = new Product();
                        audi.setName("Audi R8");
                        audi.setDescription("Supercar performance with luxury finishes.");
                        audi.setCity("Los Angeles");
                        audi.setCategory(luxury);
                        audi.setPrice(350.0);
                        audi.setRating(4.9);
                        audi.setTrips(12);
                        audi.setImages(new ArrayList<>(List.of(
                                        new Image(null, "Audi Main",
                                                        "https://images.unsplash.com/photo-1603584173870-7f394856f4d5?auto=format&fit=crop&w=1000&q=80"))));

                        // 6. BMW 3 Series (Sedan)
                        Product bmw = new Product();
                        bmw.setName("BMW 3 Series");
                        bmw.setDescription("The ultimate driving machine for everyday use.");
                        bmw.setCity("Bariloche");
                        bmw.setCategory(sedan);
                        bmw.setPrice(85.0);
                        bmw.setRating(4.7);
                        bmw.setTrips(98);
                        bmw.setImages(new ArrayList<>(List.of(
                                        new Image(null, "BMW Main",
                                                        "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80"))));

                        productRepository.saveAll(List.of(tesla, jeep, onix, mustang, audi, bmw));
                }

                return ResponseEntity.ok("Database updated with Sprint 1 data.");
>>>>>>> origin/master
        }

        private Category getOrCreateCategory(String name, String description, String imageUrl) {
                return categoryRepository.findAll().stream()
<<<<<<< HEAD
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
=======
                                .filter(c -> c.getName().equalsIgnoreCase(name))
                                .findFirst()
                                .orElseGet(() -> categoryRepository
                                                .save(new Category(null, name, description, imageUrl)));
>>>>>>> origin/master
        }
}
