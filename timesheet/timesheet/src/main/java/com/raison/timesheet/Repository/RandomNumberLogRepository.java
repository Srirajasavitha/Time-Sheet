package com.raison.timesheet.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.raison.timesheet.Entity.RandomNumberLog;
@Repository
public interface RandomNumberLogRepository extends JpaRepository<RandomNumberLog, Long>{
    Optional<RandomNumberLog> findByUsername(String username);

}
