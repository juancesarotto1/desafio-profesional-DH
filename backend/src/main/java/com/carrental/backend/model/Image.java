package com.carrental.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "images")
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String url;

    public Image() {
    }

    public Image(Long id, String title, String url) {
        this.id = id;
        this.title = title;
        this.url = url;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public static ImageBuilder builder() {
        return new ImageBuilder();
    }

    public static class ImageBuilder {
        private Long id;
        private String title;
        private String url;

        public ImageBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ImageBuilder title(String title) {
            this.title = title;
            return this;
        }

        public ImageBuilder url(String url) {
            this.url = url;
            return this;
        }

        public Image build() {
            return new Image(id, title, url);
        }
    }
}
