package com.amor.api.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entidade central do SaaS multi-tenant.
 * Cada instância representa um casal cadastrado na plataforma.
 * Todos os demais dados (Timeline, Cupons, etc.) são escopo de um Couple.
 */
@Entity
@Table(name = "couples")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Couple {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Nome do primeiro parceiro */
    @Column(nullable = false)
    private String name1;

    /** Nome do segundo parceiro */
    @Column(nullable = false)
    private String name2;

    /** Data do início do relacionamento */
    @Column(nullable = false)
    private LocalDate startDate;

    /**
     * Plano de assinatura atual.
     * FREE: funcionalidades básicas com limites.
     * PREMIUM: acesso completo ilimitado.
     */
    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private Plan plan = Plan.FREE;

    /**
     * Se false, o casal está bloqueado e não pode acessar a plataforma.
     * Controlado pelo Super Admin.
     */
    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

    /** Data de cadastro na plataforma */
    @Builder.Default
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Plan {
        FREE, PREMIUM
    }
}
