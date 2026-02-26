package com.carrental.backend.controller;

import com.carrental.backend.model.Booking;
import com.carrental.backend.model.Product;
import com.carrental.backend.model.User;
import com.carrental.backend.repository.BookingRepository;
import com.carrental.backend.repository.ProductRepository;
import com.carrental.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public BookingController(BookingRepository bookingRepository, UserRepository userRepository,
            ProductRepository productRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Booking> getAll() {
        return bookingRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Booking booking) {
        System.out.println("Processing booking request for product ID: " +
                (booking.getProduct() != null ? booking.getProduct().getId() : "null"));

        try {
            if (booking.getProduct() == null || booking.getProduct().getId() == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Auto no especificado."));
            }

            if (booking.getStartDate() == null || booking.getEndDate() == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Fechas no especificadas."));
            }

            if (booking.getStartDate().isAfter(booking.getEndDate())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "La fecha de inicio debe ser anterior a la de fin."));
            }

            System.out.println("Booking dates: " + booking.getStartDate() + " to " + booking.getEndDate());

            // Fetch managed product
            Product product = productRepository.findById(booking.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException(
                            "Auto no encontrado en la base de datos con ID: " + booking.getProduct().getId()));
            System.out.println("Found product: " + product.getName());

            // Validate overlap
            List<Booking> overlaps = bookingRepository.findOverlappingBookings(
                    product.getId(),
                    booking.getStartDate(),
                    booking.getEndDate());

            if (!overlaps.isEmpty()) {
                System.out.println("Booking overlap detected! Found " + overlaps.size() + " overlapping bookings.");
                return ResponseEntity.badRequest()
                        .body(Map.of("message",
                                "Lo sentimos, este auto ya está reservado para las fechas seleccionadas."));
            }

            // Fetch managed user
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String email;
            if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
                email = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
            } else {
                email = SecurityContextHolder.getContext().getAuthentication().getName();
            }

            System.out.println("Searching for user with email: " + email);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado en la base de datos: " + email));

            // Save booking
            booking.setProduct(product);
            booking.setUser(user);

            Booking saved = bookingRepository.save(booking);
            System.out.println("Booking successfully created with ID: " + saved.getId());
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            System.err.println("CRITICAL Booking error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Error interno al procesar la reserva: " + e.getMessage()));
        }
    }

    @GetMapping("/user")
    public List<Booking> getByUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;
        if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
            email = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
        } else {
            email = SecurityContextHolder.getContext().getAuthentication().getName();
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + email));
        return bookingRepository.findByUserId(user.getId());
    }

    @GetMapping("/product/{productId}")
    public List<Booking> getByProduct(@PathVariable Long productId) {
        return bookingRepository.findByProductId(productId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        System.out.println("Attempting to delete booking ID: " + id);
        try {
            // Fetch the booking
            Booking booking = bookingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + id));

            // Security Check: Verify ownership
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String currentUserEmail;
            if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
                currentUserEmail = ((org.springframework.security.core.userdetails.UserDetails) principal)
                        .getUsername();
            } else {
                currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            }

            if (!booking.getUser().getEmail().equals(currentUserEmail)) {
                System.out.println(
                        "Unauthorized deletion attempt! User " + currentUserEmail + " tried to delete booking " + id);
                return ResponseEntity.status(403)
                        .body(Map.of("message", "No tienes permiso para cancelar esta reserva."));
            }

            // Delete the booking
            bookingRepository.delete(booking);
            System.out.println("Booking " + id + " successfully deleted by " + currentUserEmail);
            return ResponseEntity.ok(Map.of("message", "Reserva cancelada con éxito."));

        } catch (Exception e) {
            System.err.println("Error deleting booking: " + e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Error al cancelar la reserva: " + e.getMessage()));
        }
    }
}
