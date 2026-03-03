package com.carrental.backend.repository;

import com.carrental.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD
import org.springframework.data.jpa.repository.Query;
=======
>>>>>>> origin/master
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
<<<<<<< HEAD
    // Solo FETCH de category: evita duplicados (un producto con N imágenes generaba N filas).
    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.category")
    List<Product> findAll();
    
    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.category WHERE p.category.id = :categoryId")
=======
>>>>>>> origin/master
    List<Product> findByCategoryId(Long categoryId);
}
