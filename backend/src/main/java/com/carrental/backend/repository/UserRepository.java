package com.carrental.backend.repository;

import com.carrental.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

<<<<<<< HEAD
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
=======
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
>>>>>>> origin/master
}
