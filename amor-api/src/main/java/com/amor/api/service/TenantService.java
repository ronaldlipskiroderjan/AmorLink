package com.amor.api.service;

import com.amor.api.model.Usuario;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * Serviço que provê o contexto multi-tenant.
 * Extrai o casal (couple) do usuário autenticado no SecurityContext,
 * permitindo que os controllers filtrem dados pelo tenant correto.
 */
@Service
public class TenantService {

    /**
     * Retorna o ID do casal (coupleId) do usuário autenticado.
     * Lança exceção se o usuário não tiver casal associado (ex: SuperAdmin tentando acessar dados de casal).
     */
    public Long getCoupleId() {
        Usuario usuario = getAuthenticatedUser();
        if (usuario.getCouple() == null) {
            throw new IllegalStateException("Super Admin não possui casal associado. Use os endpoints /api/admin.");
        }
        return usuario.getCouple().getId();
    }

    /**
     * Retorna o usuário autenticado no request atual.
     */
    public Usuario getAuthenticatedUser() {
        return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
