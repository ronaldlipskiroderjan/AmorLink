package com.amor.api.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Endpoints gerais do casal.
 */
@RestController
@RequestMapping("/api")
public class AppController {

    /**
     * Lê a data de início do namoro definida em application.properties.
     * 💡 Para mudar a data, vá em: src/main/resources/application.properties
     *    e atualize a propriedade: app.couple.start-date
     */
    @Value("${app.couple.start-date}")
    private String startDate;

    @Value("${app.couple.names}")
    private String coupleNames;

    /**
     * GET /api/couple-info
     * Retorna a data de início do namoro e o nome do casal.
     */
    @GetMapping("/couple-info")
    public ResponseEntity<Map<String, String>> getCoupleInfo() {
        return ResponseEntity.ok(Map.of(
            "startDate", startDate,
            "names", coupleNames
        ));
    }
}
