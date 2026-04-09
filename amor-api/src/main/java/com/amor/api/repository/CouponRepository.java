package com.amor.api.repository;

import com.amor.api.model.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    List<Coupon> findAllByCoupleId(Long coupleId);
    Optional<Coupon> findByIdAndCoupleId(Long id, Long coupleId);
    long countByCoupleId(Long coupleId);
}
