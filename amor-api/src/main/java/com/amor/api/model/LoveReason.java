package com.amor.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Representa uma razão pela qual você ama sua namorada.
 * O frontend vai buscar uma aleatória para o "Potinho de Amor" 💝
 */
@Entity
@Table(name = "love_reasons")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoveReason {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String reason;

    /** Casal dono desta razão — garante isolamento de dados entre tenants */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "couple_id", nullable = false)
    private Couple couple;
}

