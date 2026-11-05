package ma.ensa.staylivingluxe.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private ResponseEntity<Map<String, String>> body(HttpStatus s, String m) {
        return ResponseEntity.status(s).body(Map.of("message", m));
    }
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> conflict(IllegalStateException e) { return body(HttpStatus.CONFLICT, e.getMessage()); }
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> bad(IllegalArgumentException e) { return body(HttpStatus.BAD_REQUEST, e.getMessage()); }
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> creds(BadCredentialsException e) { return body(HttpStatus.UNAUTHORIZED, "Identifiants incorrects."); }
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> runtime(RuntimeException e) { return body(HttpStatus.BAD_REQUEST, e.getMessage()); }
}
