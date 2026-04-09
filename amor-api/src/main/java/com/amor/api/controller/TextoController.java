package com.amor.api.controller;

import com.amor.api.model.Texto;
import com.amor.api.repository.TextoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/textos")
public class TextoController {

    @Autowired
    private TextoRepository textoRepository;

    @GetMapping
    public List<Texto> getAllTextos() {
        return textoRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public Texto addTexto(@RequestBody Texto texto) {
        if (texto.getCreatedAt() == null) {
            texto.setCreatedAt(LocalDate.now());
        }
        return textoRepository.save(texto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTexto(@PathVariable Long id) {
        if (!textoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        textoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

