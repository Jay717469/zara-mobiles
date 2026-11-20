package com.zara.mobiles.config;

import com.zara.mobiles.entity.User;
import com.zara.mobiles.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Ensure default ADMIN user exists with valid BCrypt password
        userRepository.findByEmail("admin@zaramobiles.com").ifPresentOrElse(admin -> {
            if (!admin.getPassword().startsWith("$2a$10$") || admin.getPassword().contains("Sample")) {
                admin.setPassword(passwordEncoder.encode("Admin@123"));
                userRepository.save(admin);
            }
        }, () -> {
            User admin = new User(
                    "Zara Admin",
                    "admin@zaramobiles.com",
                    passwordEncoder.encode("Admin@123"),
                    "+91 98765 00001",
                    User.Role.ADMIN
            );
            userRepository.save(admin);
        });

        // Ensure default CUSTOMER user exists with valid BCrypt password
        userRepository.findByEmail("customer@zaramobiles.com").ifPresentOrElse(customer -> {
            if (!customer.getPassword().startsWith("$2a$10$") || customer.getPassword().contains("Sample")) {
                customer.setPassword(passwordEncoder.encode("Customer@123"));
                userRepository.save(customer);
            }
        }, () -> {
            User customer = new User(
                    "John Customer",
                    "customer@zaramobiles.com",
                    passwordEncoder.encode("Customer@123"),
                    "+91 98765 00002",
                    User.Role.CUSTOMER
            );
            userRepository.save(customer);
        });
    }
}
