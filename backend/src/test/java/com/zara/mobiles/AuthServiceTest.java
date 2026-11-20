package com.zara.mobiles;

import com.zara.mobiles.dto.AuthResponse;
import com.zara.mobiles.dto.LoginRequest;
import com.zara.mobiles.dto.RegisterRequest;
import com.zara.mobiles.entity.User;
import com.zara.mobiles.exception.BadRequestException;
import com.zara.mobiles.repository.CartRepository;
import com.zara.mobiles.repository.UserRepository;
import com.zara.mobiles.repository.WishlistRepository;
import com.zara.mobiles.security.JwtTokenProvider;
import com.zara.mobiles.security.UserPrincipal;
import com.zara.mobiles.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private WishlistRepository wishlistRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User("Alice Tester", "alice@example.com", "encodedPass", "+919999999999", User.Role.CUSTOMER);
        sampleUser.setId(10L);
    }

    @Test
    void register_Success() {
        RegisterRequest req = new RegisterRequest();
        req.setFullName("Alice Tester");
        req.setEmail("alice@example.com");
        req.setPassword("Secret@123");
        req.setConfirmPassword("Secret@123");
        req.setMobileNumber("+919999999999");

        when(userRepository.existsByEmail("alice@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Secret@123")).thenReturn("encodedPass");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(tokenProvider.generateTokenFromUserId(10L, "alice@example.com", "CUSTOMER")).thenReturn("mock-jwt-token");

        AuthResponse res = authService.register(req);

        assertNotNull(res);
        assertEquals("mock-jwt-token", res.getToken());
        assertEquals("alice@example.com", res.getEmail());
        verify(cartRepository, times(1)).save(any());
        verify(wishlistRepository, times(1)).save(any());
    }

    @Test
    void register_PasswordMismatch_ThrowsBadRequest() {
        RegisterRequest req = new RegisterRequest();
        req.setFullName("Alice");
        req.setEmail("alice@example.com");
        req.setPassword("Secret@123");
        req.setConfirmPassword("Different@123");

        assertThrows(BadRequestException.class, () -> authService.register(req));
    }

    @Test
    void login_Success() {
        LoginRequest req = new LoginRequest();
        req.setEmail("alice@example.com");
        req.setPassword("Secret@123");

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(sampleUser));
        when(tokenProvider.generateToken(auth)).thenReturn("mock-login-token");

        AuthResponse res = authService.login(req);

        assertNotNull(res);
        assertEquals("mock-login-token", res.getToken());
        assertEquals(10L, res.getId());
    }
}
