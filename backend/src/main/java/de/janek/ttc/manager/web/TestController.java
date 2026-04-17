package de.janek.ttc.manager.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Einfacher Test-Controller für die erste Verbindung zwischen
 * Frontend und Backend.
 */
@RestController
public class TestController {

    /**
     * Liefert eine einfache Testnachricht zurück.
     *
     * @return Testtext für das Frontend
     */
    @GetMapping("/api/test")
    public String test() {
        return "Backend-Verbindung funktioniert.";
    }
}