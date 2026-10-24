
package com.klef.soa.docker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WaterPurifierResponse {

    private Long id;
    private String brand;
    private String modelName;
    private Double price;
    private Boolean installed;
}
