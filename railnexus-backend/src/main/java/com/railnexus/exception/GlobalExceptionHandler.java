package com.railnexus.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.railnexus.exception.BlockedUserException;
import com.railnexus.exception.InvalidCredentialsException;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleEmailAlreadyExists(
            EmailAlreadyExistsException exception
    ) {
        return new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                exception.getMessage(),
                LocalDateTime.now()
        );
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorResponse handleInvalidCredentials(
            InvalidCredentialsException exception
    ) {
        return new ErrorResponse(
                HttpStatus.UNAUTHORIZED.value(),
                exception.getMessage(),
                LocalDateTime.now()
        );
    }

    @ExceptionHandler(BlockedUserException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse handleBlockedUser(
            BlockedUserException exception
    ) {
        return new ErrorResponse(
                HttpStatus.FORBIDDEN.value(),
                exception.getMessage(),
                LocalDateTime.now()
        );
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleResourceNotFound(
            ResourceNotFoundException exception
    ) {
        return new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                exception.getMessage(),
                LocalDateTime.now()
        );
    }

    public record ErrorResponse(
            int status,
            String message,
            LocalDateTime timestamp
    ) {
    }
}