package com.klef.soa.docker.service;

import java.util.List;

import com.klef.soa.docker.dto.WaterPurifierRequest;
import com.klef.soa.docker.dto.WaterPurifierResponse;

public interface WaterPurifierService 
{
	WaterPurifierResponse addWaterPurifier(WaterPurifierRequest request);

	List<WaterPurifierResponse> displayAllWaterPurifiers();

	WaterPurifierResponse displayWaterPurifierById(Long id);

	WaterPurifierResponse updateWaterPurifierById(
	        Long id, WaterPurifierRequest request);

	String deleteWaterPurifierById(Long id);
}
