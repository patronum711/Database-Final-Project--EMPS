package com.epms;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * EPMS 应用程序主类
 * Employee Personnel Management System
 */
@SpringBootApplication
@MapperScan("com.epms.mapper")
public class EpmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(EpmsApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("EPMS Backend Started Successfully!");
        System.out.println("API Base URL: http://localhost:8080/api");
        System.out.println("========================================\n");
    }
}

