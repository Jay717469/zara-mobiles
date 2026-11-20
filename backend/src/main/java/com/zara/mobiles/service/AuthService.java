package com.zara.mobiles.service;

import com.zara.mobiles.dto.*;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserProfileResponse getCurrentUser(Long userId);
    void changePassword(Long userId, ChangePasswordRequest request);
}
