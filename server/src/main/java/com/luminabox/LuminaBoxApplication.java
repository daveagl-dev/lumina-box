package com.luminabox;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class LuminaBoxApplication {
    public static void main(String[] args) {
        SpringApplication.run(LuminaBoxApplication.class, args);
    }
}
