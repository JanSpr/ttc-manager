package de.janek.ttc.manager.common.exception;

/**
 * Wird geworfen, wenn eine angeforderte Ressource fachlich nicht gefunden wurde.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}