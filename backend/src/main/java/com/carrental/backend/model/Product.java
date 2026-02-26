package com.carrental.backend.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    private String city;
    private Double price;
    private Double rating;
    private Integer trips;

    @ManyToOne(fetch = jakarta.persistence.FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = jakarta.persistence.FetchType.EAGER)
    @JoinColumn(name = "product_id")
    private List<Image> images;

    @ManyToMany(cascade = { CascadeType.MERGE }) // quitar PERSIST para no crear features duplicadas
    @JoinTable(name = "product_features", joinColumns = @JoinColumn(name = "product_id"), inverseJoinColumns = @JoinColumn(name = "feature_id"))
    private Set<Feature> features = new HashSet<>(); // usar Set para evitar duplicados

    public Product() {
    }

    public Product(Long id, String name, String description, String city, Double price, Double rating, Integer trips,
            Category category, List<Image> images, Set<Feature> features) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.city = city;
        this.price = price;
        this.rating = rating;
        this.trips = trips;
        this.category = category;
        this.images = images;
        this.features = features != null ? features : new HashSet<>();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getTrips() {
        return trips;
    }

    public void setTrips(Integer trips) {
        this.trips = trips;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public List<Image> getImages() {
        return images;
    }

    public void setImages(List<Image> images) {
        this.images = images;
    }

    public Set<Feature> getFeatures() {
        return features;
    }

    public void setFeatures(Set<Feature> features) {
        this.features = features;
    }

    public static ProductBuilder builder() {
        return new ProductBuilder();
    }

    public static class ProductBuilder {
        private Long id;
        private String name;
        private String description;
        private String city;
        private Double price;
        private Double rating;
        private Integer trips;
        private Category category;
        private List<Image> images;
        private Set<Feature> features;

        public ProductBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ProductBuilder name(String name) {
            this.name = name;
            return this;
        }

        public ProductBuilder description(String description) {
            this.description = description;
            return this;
        }

        public ProductBuilder city(String city) {
            this.city = city;
            return this;
        }

        public ProductBuilder price(Double price) {
            this.price = price;
            return this;
        }

        public ProductBuilder rating(Double rating) {
            this.rating = rating;
            return this;
        }

        public ProductBuilder trips(Integer trips) {
            this.trips = trips;
            return this;
        }

        public ProductBuilder category(Category category) {
            this.category = category;
            return this;
        }

        public ProductBuilder images(List<Image> images) {
            this.images = images;
            return this;
        }

        public ProductBuilder features(Set<Feature> features) {
            this.features = features;
            return this;
        }

        public Product build() {
            return new Product(id, name, description, city, price, rating, trips, category, images, features);
        }
    }
}
