package com.amor.api.config;

import com.amor.api.model.Usuario;
import com.amor.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * DataLoader responsável por garantir que o Super Admin exista na base.
 *
 * No modelo SaaS multi-tenant, NÃO existe mais seeding de casais/cupons/timeline.
 * Cada casal cria seus próprios dados via /api/auth/signup.
 */
@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataLoader.class);

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.superadmin.username}")
    private String superAdminUsername;

    @Value("${app.superadmin.password}")
    private String superAdminPassword;

    @Override
    public void run(String... args) {
        seedSuperAdmin();
    }

    /**
     * Cria o Super Admin global se ainda não existir.
     * O usuário e senha são lidos de application.properties (variáveis de ambiente em produção).
     */
    private void seedSuperAdmin() {
        if (usuarioRepository.findByUsername(superAdminUsername).isEmpty()) {
            Usuario superAdmin = Usuario.builder()
                .username(superAdminUsername)
                .email(superAdminUsername + "@system.local")
                .password(passwordEncoder.encode(superAdminPassword))
                .role("ROLE_SUPER_ADMIN")
                .couple(null) // Super Admin não pertence a nenhum casal
                .build();
            usuarioRepository.save(superAdmin);
            log.info("✅ Super Admin '{}' criado com sucesso.", superAdminUsername);
        } else {
            log.info("ℹ️ Super Admin '{}' já existe. Nenhuma ação necessária.", superAdminUsername);
        }
    }
}


@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final TimelineMomentRepository timelineRepo;
    private final LoveReasonRepository loveReasonRepo;
    private final CouponRepository couponRepo;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedTimeline();
        seedLoveReasons();
        seedCoupons();
    }

    /**
     * Cria as duas contas do sistema no startup.
     *
     * 💡 IMPORTANTE — altere as senhas antes de usar em produção!
     *    username: "admin"  →  senha: "admin123"   (ROLE_ADMIN — acesso total)
     *    username: "amor"   →  senha: "amor123"    (ROLE_USER — timeline e textos)
     *
     * As senhas são salvas como hash BCrypt (seguro).
     * Não há nenhuma outra forma de criar usuários no sistema.
     */
    private void seedUsers() {
        if (usuarioRepository.count() == 0) {
            usuarioRepository.saveAll(List.of(
                Usuario.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("30102009")) // 💡 Troque a senha!
                    .role("ROLE_ADMIN")
                    .build(),
                Usuario.builder()
                    .username("Princesa")
                    .password(passwordEncoder.encode("30102009")) // 💡 Troque a senha!
                    .role("ROLE_USER")
                    .build()
            ));
        }
    }

    private void seedTimeline() {
        List<TimelineMoment> moments = List.of(
                TimelineMoment.builder()
                    .date(LocalDate.of(2025, 3, 10)) // 💡 Data do primeiro encontro
                    .title("💫")
                    .description("O dia em que tudo começou. Eu soube que era você desde o primeiro olhar.")
                    .photoUrl(null) // 💡 Cole a URL da foto aqui
                    .build(),

                TimelineMoment.builder()
                    .date(LocalDate.of(2025, 2, 15)) // 💡 Data do primeiro beijo — mude aqui!
                    .title("Nosso primeiro beijo 💋")
                    .description("Aquele momento que parou o tempo e ficou guardado no coração.")
                    .photoUrl(null) // 💡 Cole a URL da foto aqui
                    .build(),

                TimelineMoment.builder()
                        .date(LocalDate.of(2025, 2, 15)) // 💡 Data do primeiro beijo — mude aqui!
                        .title("Nosso primeiro beijo 💋")
                        .description("Aquele momento que parou o tempo e ficou guardado no coração.")
                        .photoUrl(null) // 💡 Cole a URL da foto aqui
                        .build(),

                TimelineMoment.builder()
                        .date(LocalDate.of(2025, 2, 15)) // 💡 Data do primeiro beijo — mude aqui!
                        .title("Nosso primeiro beijo 💋")
                        .description("Aquele momento que parou o tempo e ficou guardado no coração.")
                        .photoUrl(null) // 💡 Cole a URL da foto aqui
                        .build(),

                TimelineMoment.builder()
                        .date(LocalDate.of(2025, 2, 15)) // 💡 Data do primeiro beijo — mude aqui!
                        .title("Nosso primeiro beijo 💋")
                        .description("Aquele momento que parou o tempo e ficou guardado no coração.")
                        .photoUrl(null) // 💡 Cole a URL da foto aqui
                        .build()
        );
        timelineRepo.saveAll(moments);
    }

    private void seedLoveReasons() {
        List<LoveReason> reasons = List.of(
            LoveReason.builder().reason("Porque o seu sorriso é literalmente o meu lugar preferido no mundo.").build(),
            LoveReason.builder().reason("Porque você me faz querer ser a melhor versão de mim mesmo todo dia.").build(),
            LoveReason.builder().reason("Porque o seu abraço é o único lugar onde eu me sinto completamente em paz.").build(),
            LoveReason.builder().reason("Porque você ri das minhas piadas ruins e isso me faz te amar ainda mais.").build(),
            LoveReason.builder().reason("Porque você cuida de tudo e de todos com um coração que não tem igual.").build(),
            LoveReason.builder().reason("Porque até nas discussões pequenas, no fundo só quero ficar perto de você.").build(),
            LoveReason.builder().reason("Porque você transforma qualquer lugar comum em algo especial só de estar lá.").build(),
            LoveReason.builder().reason("Porque seus olhos me dizem tudo que as palavras às vezes não conseguem.").build(),
            LoveReason.builder().reason("Porque você me escolhe todo dia, e isso é o presente mais bonito que eu já recebi.").build(),
            LoveReason.builder().reason("Porque a vida ao seu lado é mais colorida, mais leve e infinitamente mais bonita.").build()
        );
        loveReasonRepo.saveAll(reasons);
    }

    private void seedCoupons() {
        List<Coupon> coupons = List.of(
            Coupon.builder()
                .title("Vale-Jantar Romântico")
                .description("Um jantar especial no restaurante da sua escolha, sem desculpas!")
                .emoji("🍽️")
                .build(),

            Coupon.builder()
                .title("Vale-Massagem")
                .description("Uma massagem relaxante de 30 minutos, quando e onde quiser.")
                .emoji("💆")
                .build(),

            Coupon.builder()
                .title("Vale-Dia de Série")
                .description("Um dia inteiro de série na sua escolha, com pipoca e tudo mais!")
                .emoji("🎬")
                .build(),

            Coupon.builder()
                .title("Vale-Café da Manhã na Cama")
                .description("Café da manhã preparado com amor e servido na cama. ☕ + 🥐")
                .emoji("☕")
                .build(),

            Coupon.builder()
                .title("Vale-Abraço Infinito")
                .description("Um abraço que dura o tempo que você precisar. Sem prazo de validade.")
                .emoji("🤗")
                .build(),

            Coupon.builder()
                .title("Vale-Surpresa")
                .description("Uma surpresa especial planejada só para você. Use quando sentir que precisa.")
                .emoji("🎁")
                .build()
        );
        couponRepo.saveAll(coupons);
    }
}
