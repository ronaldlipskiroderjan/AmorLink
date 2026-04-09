package com.amor.api.controller;

import com.amor.api.model.LoveReason;
import com.amor.api.repository.LoveReasonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador do "Potinho de Amor" 💝
 */
@RestController
@RequestMapping("/api/love-reasons")
@RequiredArgsConstructor
public class LoveReasonController {

    private final LoveReasonRepository repository;

    /** GET /api/love-reasons/random — Razão aleatória */
    @GetMapping("/random")
    public ResponseEntity<LoveReason> getRandom() {
        return repository.findRandom()
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /** GET /api/love-reasons — Lista todas */
    @GetMapping
    public List<LoveReason> getAll() {
        return repository.findAll();
    }

    /** POST /api/love-reasons — Adiciona nova razão (ADMIN only — protegido no SecurityConfig) */
    @PostMapping
    public LoveReason create(@RequestBody LoveReason reason) {
        return repository.save(reason);
    }

    /** DELETE /api/love-reasons/{id} — Remove razão (ADMIN only — protegido no SecurityConfig) */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

