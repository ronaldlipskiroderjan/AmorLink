package com.amor.api.controller;

import com.amor.api.model.Couple;
import com.amor.api.model.Usuario;
import com.amor.api.repository.CoupleRepository;
import com.amor.api.repository.UsuarioRepository;
import com.amor.api.security.JwtUtils;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

/**
 * Endpoints de autenticação.
 * POST /api/auth/login   — autenticação existente
 * POST /api/auth/signup  — cadastro público de novo casal (tenant)
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final CoupleRepository coupleRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // ─────────────────────────────────────────────── LOGIN ──────────────────

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );

            Usuario usuario = (Usuario) auth.getPrincipal();
            String token = jwtUtils.generateToken(usuario);

            Map<String, Object> body = new java.util.HashMap<>();
            body.put("token", token);
            body.put("role", usuario.getRole());
            body.put("username", usuario.getUsername());

            if (usuario.getCouple() != null) {
                Couple c = usuario.getCouple();
                body.put("coupleId", c.getId());
                body.put("plan", c.getPlan().name());
                body.put("isPremium", c.getPlan() == Couple.Plan.PREMIUM);
                body.put("startDate", c.getStartDate() != null ? c.getStartDate().toString() : null);
                body.put("name1", c.getName1());
                body.put("name2", c.getName2());
            }

            return ResponseEntity.ok(body);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Usuário ou senha incorretos."));
        }
    }

    // ─────────────────────────────────────────────── SIGNUP ─────────────────

    /**
     * Cria um novo casal (tenant) e dois usuários associados.
     * Acessível publicamente (sem JWT).
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest req) {
        // Verifica se username já existe
        if (usuarioRepository.findByUsername(req.adminUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username '" + req.adminUsername() + "' já está em uso."));
        }
        if (usuarioRepository.findByUsername(req.partnerUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username '" + req.partnerUsername() + "' já está em uso."));
        }

        // Cria o Couple
        Couple couple = Couple.builder()
            .name1(req.name1())
            .name2(req.name2())
            .startDate(req.startDate())
            .plan(Couple.Plan.FREE)
            .active(true)
            .build();
        coupleRepository.save(couple);

        // Cria o ADMIN do casal
        Usuario admin = Usuario.builder()
            .username(req.adminUsername())
            .email(req.adminEmail())
            .password(passwordEncoder.encode(req.adminPassword()))
            .role("ROLE_ADMIN")
            .couple(couple)
            .build();

        // Cria o USER (parceiro)
        Usuario partner = Usuario.builder()
            .username(req.partnerUsername())
            .email(req.partnerEmail())
            .password(passwordEncoder.encode(req.partnerPassword()))
            .role("ROLE_USER")
            .couple(couple)
            .build();

        usuarioRepository.save(admin);
        usuarioRepository.save(partner);

        return ResponseEntity.status(201).body(Map.of(
            "message", "Casal cadastrado com sucesso! Faça login para começar. 💕",
            "coupleId", couple.getId()
        ));
    }

    // ──────────────────────────────────────────────── DTOs ──────────────────

    public record LoginRequest(String username, String password) {}

    public record SignupRequest(
        @NotBlank String name1,
        @NotBlank String name2,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,

        @NotBlank String adminUsername,
        @NotBlank String adminEmail,
        @NotBlank @Size(min = 6) String adminPassword,

        @NotBlank String partnerUsername,
        @NotBlank String partnerEmail,
        @NotBlank @Size(min = 6) String partnerPassword
    ) {}
}
