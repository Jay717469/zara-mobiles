package com.zara.mobiles.service.impl;

import com.zara.mobiles.dto.*;
import com.zara.mobiles.entity.Cart;
import com.zara.mobiles.entity.User;
import com.zara.mobiles.entity.Wishlist;
import com.zara.mobiles.exception.BadRequestException;
import com.zara.mobiles.exception.ResourceNotFoundException;
import com.zara.mobiles.repository.CartRepository;
import com.zara.mobiles.repository.UserRepository;
import com.zara.mobiles.repository.WishlistRepository;
import com.zara.mobiles.security.JwtTokenProvider;
import com.zara.mobiles.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final WishlistRepository wishlistRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthServiceImpl(
            UserRepository userRepository,
            CartRepository cartRepository,
            WishlistRepository wishlistRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.wishlistRepository = wishlistRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and confirm password do not match");
        }

        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = new User(
                request.getFullName().trim(),
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                request.getMobileNumber().trim(),
                User.Role.CUSTOMER
        );

        User savedUser = userRepository.save(user);

        // Pre-create cart and wishlist for user
        cartRepository.save(new Cart(savedUser));
        wishlistRepository.save(new Wishlist(savedUser));

        String token = tokenProvider.generateTokenFromUserId(savedUser.getId(), savedUser.getEmail(), savedUser.getRole().name());

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getMobileNumber(),
                savedUser.getRole().name()
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getStatus() != User.Status.ACTIVE) {
            throw new BadRequestException("Your account is deactivated. Please contact support.");
        }

        String token = tokenProvider.generateToken(authentication);

        return new AuthResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getMobileNumber(),
                user.getRole().name()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getMobileNumber(),
                user.getRole().name(),
                user.getStatus().name(),
                user.getCreatedAt()
        );
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new BadRequestException("New password and confirm new password do not match");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
