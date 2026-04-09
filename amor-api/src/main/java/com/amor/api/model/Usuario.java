package com.amor.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Usuário do sistema.
 *
 * Roles disponíveis:
 *   ROLE_SUPER_ADMIN — dono do SaaS (sem couple associado). Acesso ao painel de admin.
 *   ROLE_ADMIN       — primeiro parceiro do casal. Acesso total de gestão do casal.
 *   ROLE_USER        — segundo parceiro do casal. Acesso parcial.
 */
@Entity
@Table(name = "usuarios")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Email do usuário — usado como login (username) */
    @Column(nullable = false, unique = true)
    private String username;

    /** Senha armazenada como hash BCrypt */
    @Column(nullable = false)
    private String password;

    /**
     * Role do usuário.
     * Valores válidos: "ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_USER"
     */
    @Column(nullable = false)
    private String role;

    /**
     * Casal ao qual o usuário pertence.
     * Null APENAS para o Super Admin.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "couple_id")
    private Couple couple;

    // -------- UserDetails interface --------

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override public boolean isAccountNonExpired()    { return true; }
    @Override public boolean isAccountNonLocked()     { return true; }
    @Override public boolean isCredentialsNonExpired(){ return true; }
    @Override public boolean isEnabled()              {
        // Bloqueia login se o casal estiver desativado pelo Super Admin
        return couple == null || couple.isActive();
    }
}

