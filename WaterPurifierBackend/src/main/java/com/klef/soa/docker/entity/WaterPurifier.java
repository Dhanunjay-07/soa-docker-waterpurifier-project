package com.klef.soa.docker.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="water_purifier")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WaterPurifier
{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	
	@Column(nullable = false)
    private String  brand ;

    @Column(nullable = false, unique = true)
    private String modelName;

    @Column(nullable = false)
    private Double price ;

    private Boolean installed;


}

