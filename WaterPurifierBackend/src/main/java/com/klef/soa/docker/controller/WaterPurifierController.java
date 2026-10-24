
package com.klef.soa.docker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klef.soa.docker.dto.WaterPurifierRequest;
import com.klef.soa.docker.dto.WaterPurifierResponse;
import com.klef.soa.docker.service.WaterPurifierService;

@RestController
@RequestMapping("/waterpurifier")
public class WaterPurifierController {

	@Autowired
	private WaterPurifierService service;

	@PostMapping("/add")
	public WaterPurifierResponse addWaterPurifier(@RequestBody WaterPurifierRequest request) {
		return service.addWaterPurifier(request);
	}

	@GetMapping("/displayall")
	public List<WaterPurifierResponse> displayAllWaterPurifiers() {
		return service.displayAllWaterPurifiers();
	}

	@GetMapping("/displaybyid/{id}")
	public WaterPurifierResponse displayWaterPurifierById(@PathVariable Long id) 
	{
		return service.displayWaterPurifierById(id);
	}

	@PutMapping("/updatebyid/{id}")
	public WaterPurifierResponse updateWaterPurifierById(@PathVariable Long id,@RequestBody WaterPurifierRequest request) 
	{
		return service.updateWaterPurifierById(id, request);
	}

	@DeleteMapping("/deletebyid/{id}")
	public String deleteWaterPurifierById(@PathVariable Long id) 
	{
		return service.deleteWaterPurifierById(id);
	}
}
