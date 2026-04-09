package com.amor.api.repository;

import com.amor.api.model.LoveReason;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface LoveReasonRepository extends JpaRepository<LoveReason, Long> {

    List<LoveReason> findAllByCoupleId(Long coupleId);

    // RANDOM() é a sintaxe correta para PostgreSQL (H2 usava RAND())
    @Query(value = "SELECT * FROM love_reasons WHERE couple_id = :coupleId ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    Optional<LoveReason> findRandomByCoupleId(Long coupleId);
}

