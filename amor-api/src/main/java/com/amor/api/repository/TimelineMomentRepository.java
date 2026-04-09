package com.amor.api.repository;

import com.amor.api.model.TimelineMoment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TimelineMomentRepository extends JpaRepository<TimelineMoment, Long> {
    List<TimelineMoment> findAllByCoupleIdOrderByDateAsc(Long coupleId);
    Optional<TimelineMoment> findByIdAndCoupleId(Long id, Long coupleId);
}

