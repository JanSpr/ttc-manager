package de.janek.ttc.manager.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Globales Exception-Handling für REST-Endpunkte.
 *
 * Ziele: - fachliche Fehler als saubere 4xx-Antworten zurückgeben -
 * Validierungsfehler strukturiert für das Frontend aufbereiten - technische
 * Standardfehler nicht ungefiltert nach außen geben
 */
@RestControllerAdvice
public class GlobalRestExceptionHandler {

	/**
	 * Fachliche Validierungs- oder Konfliktfehler aus dem Service-Layer.
	 *
	 * Beispiele: - doppelte E-Mail-Adresse - andere bewusst geworfene
	 * IllegalArgumentExceptions
	 */
	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
		return buildErrorResponse(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage());
	}

	/**
	 * Nicht gefundene Ressourcen.
	 */
	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<Map<String, Object>> handleResourceNotFound(ResourceNotFoundException ex) {
		return buildErrorResponse(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage());
	}

	/**
	 * Bean-Validation-Fehler aus @Valid Request-Bodies.
	 *
	 * Beispiele: - leere Pflichtfelder - ungültige E-Mail-Adresse - zu lange Werte
	 */
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, Object>> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
		Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
				.collect(Collectors.toMap(FieldError::getField,
						fieldError -> fieldError.getDefaultMessage() != null ? fieldError.getDefaultMessage()
								: "Ungültiger Wert.",
						(existing, replacement) -> existing, LinkedHashMap::new));

		Map<String, Object> body = new LinkedHashMap<>();
		body.put("timestamp", OffsetDateTime.now());
		body.put("status", HttpStatus.BAD_REQUEST.value());
		body.put("error", "Validation Failed");
		body.put("message", "Die Anfrage enthält ungültige Eingabedaten.");
		body.put("fieldErrors", fieldErrors);

		return ResponseEntity.badRequest().body(body);
	}

	/**
	 * Allgemeiner Fallback für unerwartete Fehler.
	 *
	 * Wichtiger Hinweis: - die technische Exception sollte weiterhin im Server-Log
	 * sichtbar sein - nach außen geben wir nur eine generische Fehlermeldung zurück
	 */
	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
		return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error",
				"Es ist ein unerwarteter Fehler aufgetreten.");
	}

	private ResponseEntity<Map<String, Object>> buildErrorResponse(HttpStatus status, String error, String message) {
		Map<String, Object> body = new LinkedHashMap<>();
		body.put("timestamp", OffsetDateTime.now());
		body.put("status", status.value());
		body.put("error", error);
		body.put("message", message);

		return ResponseEntity.status(status).body(body);
	}
}