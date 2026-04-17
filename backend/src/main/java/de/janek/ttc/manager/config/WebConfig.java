package de.janek.ttc.manager.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web-Konfiguration für MVC-bezogene Einstellungen.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Erlaubt CORS-Zugriffe vom lokalen Frontend während der Entwicklung.
     *
     * @param registry CORS-Registry von Spring MVC
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS");
    }
}