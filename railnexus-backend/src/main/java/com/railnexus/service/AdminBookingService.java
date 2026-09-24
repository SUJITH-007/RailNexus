package com.railnexus.service;

import com.railnexus.dto.admin.AdminBookingResponse;

import java.util.List;

public interface AdminBookingService {

    List<AdminBookingResponse> getAllBookings();

    AdminBookingResponse getBookingByPnr(String pnr);
}