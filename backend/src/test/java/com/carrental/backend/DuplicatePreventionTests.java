package com.carrental.backend;

import com.carrental.backend.controller.SeedController;
import com.carrental.backend.model.Category;
import com.carrental.backend.model.Feature;
import com.carrental.backend.model.Image;
import com.carrental.backend.model.Product;
import com.carrental.backend.repository.CategoryRepository;
import com.carrental.backend.repository.FeatureRepository;
import com.carrental.backend.repository.ProductRepository;
import com.carrental.backend.repository.UserRepository;
import com.carrental.backend.service.ProductService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
        "spring.datasource.driverClassName=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.show-sql=false"
})
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class DuplicatePreventionTests {

    @Autowired
    private SeedController seedController;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private FeatureRepository featureRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductService productService;

    @BeforeEach
    public void cleanup() {
        // Ensure fresh state before each test
        productRepository.deleteAll();
        categoryRepository.deleteAll();
        featureRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    public void testSeedIsIdempotent() {
        // Run seed first time
        seedController.seedData();
        List<Category> afterFirstCat = categoryRepository.findAll();
        List<Product> afterFirstProd = productRepository.findAll();

        int catCount1 = afterFirstCat.size();
        int prodCount1 = afterFirstProd.size();

        // Run seed second time
        seedController.seedData();
        int catCount2 = categoryRepository.findAll().size();
        int prodCount2 = productRepository.findAll().size();

        Assertions.assertEquals(catCount1, catCount2, "Categories count should be unchanged after second seed");
        Assertions.assertEquals(prodCount1, prodCount2, "Products count should be unchanged after second seed");
    }

    @Test
    public void testCreatingProductDoesNotDuplicateCategoryOrFeature() {
        // Prepare existing category and feature
        Category existing = categoryRepository.save(new Category(null, "SUV", "desc", "img"));
        Feature existingFeature = featureRepository.save(new Feature("Air Conditioning", "icon", "cooling"));

        // Build product payload with category by name only and feature by name only
        Product p = new Product();
        p.setName("Test Car");
        p.setDescription("desc");
        p.setCity("City");
        p.setPrice(100.0);
        p.setRating(4.5);
        p.setTrips(10);
        p.setCategory(new Category(null, "SUV", null, null));
        p.setImages(new ArrayList<>(List.of(new Image(null, "Main", "http://img"))));
        Set<Feature> feats = new HashSet<>();
        feats.add(new Feature("Air Conditioning", null, null));
        feats.add(new Feature("Sunroof", null, null));
        p.setFeatures(feats);

        // Save product first time
        productService.save(p);

        long catCountAfterFirst = categoryRepository.findAll().size();
        long featCountAfterFirst = featureRepository.findAll().size();
        long prodCountAfterFirst = productRepository.findAll().size();

        // Save same (similar) product again
        Product p2 = new Product();
        p2.setName("Test Car 2");
        p2.setCategory(new Category(null, "SUV", null, null));
        Set<Feature> feats2 = new HashSet<>();
        feats2.add(new Feature("Air Conditioning", null, null));
        feats2.add(new Feature("Sunroof", null, null));
        p2.setFeatures(feats2);
        p2.setImages(new ArrayList<>(List.of(new Image(null, "Main", "http://img2"))));

        productService.save(p2);

        long catCountAfterSecond = categoryRepository.findAll().size();
        long featCountAfterSecond = featureRepository.findAll().size();
        long prodCountAfterSecond = productRepository.findAll().size();

        // Expect categories to remain 1 (no duplicate SUV), features to be 2 (Air Conditioning + Sunroof), products to be 2
        Assertions.assertEquals(1, catCountAfterFirst, "There should be 1 category after first product save");
        Assertions.assertEquals(2, featCountAfterFirst, "There should be 2 features after first product save");
        Assertions.assertEquals(2, prodCountAfterSecond, "There should be 2 products after saving two different products");

        Assertions.assertEquals(catCountAfterFirst, catCountAfterSecond, "Category count should not increase after saving similar product");
        Assertions.assertEquals(featCountAfterFirst, featCountAfterSecond, "Feature count should not increase after saving similar product");
    }
}
