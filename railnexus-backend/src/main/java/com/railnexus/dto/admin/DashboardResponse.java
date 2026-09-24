package com.railnexus.dto.admin;

import com.railnexus.dto.BookingResponse;

import java.util.List;

public record DashboardResponse(

        long totalUsers,

        long totalTrains,

        long todayBookings,

        double totalRevenue,

        List<BookingResponse> recentBookings

) {
}