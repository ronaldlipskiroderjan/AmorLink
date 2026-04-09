package com.amor.api.repository;

import com.amor.api.model.Texto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TextoRepository extends JpaRepository<Texto, Long> {
    List<Texto> findAllByCoupleIdOrderByCreatedAtDesc(Long coupleId);
}
