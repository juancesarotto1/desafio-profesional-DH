package com.carrental.backend.repository;

import com.carrental.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query("SELECT DISTINCT c FROM Category c")
    @Override
    List<Category> findAll();

    Optional<Category> findByNameIgnoreCase(String name);
=======
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
>>>>>>> origin/master
}
