package com.klef.soa.docker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class WaterPurifierBackendApplication {

	public static void main(String[] args) {
	SpringApplication.run(WaterPurifierBackendApplication.class, args);
	System.out.println("Water Purifier Service is running");
	}

}
