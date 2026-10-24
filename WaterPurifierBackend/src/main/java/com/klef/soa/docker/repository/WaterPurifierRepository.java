package com.klef.soa.docker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.klef.soa.docker.entity.WaterPurifier;

public interface WaterPurifierRepository extends JpaRepository<WaterPurifier, Long> 
{

}
