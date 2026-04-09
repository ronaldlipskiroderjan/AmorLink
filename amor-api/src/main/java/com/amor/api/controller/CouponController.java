package com.amor.api.controller;

import com.amor.api.model.Coupon;
import com.amor.api.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador dos Cupons Românticos 🎁
 */
@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponRepository repository;

    /** GET /api/coupons — Retorna todos os cupons */
    @GetMapping
    public List<Coupon> getAll() {
        return repository.findAll();
    }

    /** POST /api/coupons — Cria novo cupom (ADMIN only — protegido no SecurityConfig) */
    @PostMapping
    public Coupon create(@RequestBody Coupon coupon) {
        coupon.setRedeemed(false);
        return repository.save(coupon);
    }

    /** PATCH /api/coupons/{id}/redeem — Resgata um cupom */
    @PatchMapping("/{id}/redeem")
    public ResponseEntity<Coupon> redeem(@PathVariable Long id) {
        return repository.findById(id)
            .map(coupon -> {
                coupon.setRedeemed(true);
                return ResponseEntity.ok(repository.save(coupon));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    /** PATCH /api/coupons/{id}/unredeem — Cancela o resgate de um cupom */
    @PatchMapping("/{id}/unredeem")
    public ResponseEntity<Coupon> unredeem(@PathVariable Long id) {
        return repository.findById(id)
            .map(coupon -> {
                coupon.setRedeemed(false);
                return ResponseEntity.ok(repository.save(coupon));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    /** DELETE /api/coupons/{id} — Remove cupom (ADMIN only — protegido no SecurityConfig) */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

