package com.skillbridge.skillbridge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.skillbridge")
@EnableJpaRepositories(basePackages = "com.skillbridge.repository")
@EntityScan(basePackages = "com.skillbridge.entity")
public class SkillBridgeApplication {

    public static void main(String[] args) {
        SpringApplication.run(SkillBridgeApplication.class, args);
    }
}
