package com.amor.api.controller;

import com.amor.api.model.TimelineMoment;
import com.amor.api.repository.TimelineMomentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador da Linha do Tempo 📅
 */
@RestController
@RequestMapping("/api/timeline")
@RequiredArgsConstructor
public class TimelineController {

    private final TimelineMomentRepository repository;

    /**
     * GET /api/timeline
     * Retorna todos os momentos ordenados por data (do primeiro ao último).
     */
    @GetMapping
    public List<TimelineMoment> getAll() {
        return repository.findAllByOrderByDateAsc();
    }

    /**
     * POST /api/timeline
     * Adiciona um novo momento à linha do tempo.
     * Body esperado:
     * {
     *   "date": "2024-02-14",
     *   "title": "Aniversário de 1 ano!",
     *   "description": "...",
     *   "photoUrl": "https://..."
     * }
     */
    @PostMapping
    public TimelineMoment create(@RequestBody TimelineMoment moment) {
        return repository.save(moment);
    }

    /**
     * DELETE /api/timeline/{id}
     * Remove um momento pelo id.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
