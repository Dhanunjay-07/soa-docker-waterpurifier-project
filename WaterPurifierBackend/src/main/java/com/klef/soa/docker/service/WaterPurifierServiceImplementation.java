
package com.klef.soa.docker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.klef.soa.docker.dto.WaterPurifierRequest;
import com.klef.soa.docker.dto.WaterPurifierResponse;
import com.klef.soa.docker.entity.WaterPurifier;
import com.klef.soa.docker.repository.WaterPurifierRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WaterPurifierServiceImplementation implements WaterPurifierService {

    private final WaterPurifierRepository repo;

    @Override
    public WaterPurifierResponse addWaterPurifier(WaterPurifierRequest request) {

        WaterPurifier wp = WaterPurifier.builder()
                .brand(request.getBrand())
                .modelName(request.getModelName())
                .price(request.getPrice())
                .installed(request.getInstalled())
                .build();

        return mapToResponse(repo.save(wp));
    }

    @Override
    public List<WaterPurifierResponse> displayAllWaterPurifiers() {

        return repo.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public WaterPurifierResponse displayWaterPurifierById(Long id) {

        return repo.findById(id)
                .map(this::mapToResponse)
                .orElse(null);
    }

    @Override
public WaterPurifierResponse updateWaterPurifierById(Long id, WaterPurifierRequest request) {

        WaterPurifier wp = repo.findById(id).orElse(null);

        if (wp == null) {
            return null;
        }

        wp.setBrand(request.getBrand());
        wp.setModelName(request.getModelName());
        wp.setPrice(request.getPrice());
        wp.setInstalled(request.getInstalled());

        return mapToResponse(repo.save(wp));
    }

    @Override
    public String deleteWaterPurifierById(Long id) {

        WaterPurifier wp = repo.findById(id).orElse(null);

        if (wp == null) {
            return "Water purifier not found with id: " + id;
        }

        repo.delete(wp);

        return "Water purifier deleted successfully with id: " + id;
    }

    private WaterPurifierResponse mapToResponse(WaterPurifier wp) {

        return WaterPurifierResponse.builder()
                .id(wp.getId())
                .brand(wp.getBrand())
                .modelName(wp.getModelName())
                .price(wp.getPrice())
                .installed(wp.getInstalled())
                .build();
    }
}
