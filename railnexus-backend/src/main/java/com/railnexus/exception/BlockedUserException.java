package com.railnexus.exception;

public class BlockedUserException extends RuntimeException {

    public BlockedUserException(String message) {
        super(message);
    }
}