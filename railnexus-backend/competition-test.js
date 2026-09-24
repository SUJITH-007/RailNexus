const token = "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ1c2VydGVzdEByYWlsbmV4dXMuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3ODk5NjgxNTMsImV4cCI6MTc5MDA1NDU1M30.SJJkeglC75Qou231FLPUqwX4le6qfZdqh_2Q9l7Fi6MjD_9asV9eHCA3acy0WJ5D";
const url = "http://localhost:8080/api/bookings/lock";

const seniorRequest = {
    "trainId": 2,
    "fromStation": "SBC",
    "toStation": "KJM",
    "journeyDate": "2026-09-30",
    "classCode": "SL",
    "seatPreference": "NO_PREFERENCE",
    "passengers": [
        {
            "name": "Senior Competitor",
            "age": 74,
            "gender": "MALE",
            "berthPreference": "LOWER"
        }
    ]
};

const regularRequest = {
    "trainId": 2,
    "fromStation": "SBC",
    "toStation": "KJM",
    "journeyDate": "2026-09-30",
    "classCode": "SL",
    "seatPreference": "CONSECUTIVE",
    "passengers": [
        {
            "name": "Regular Competitor",
            "age": 30,
            "gender": "MALE",
            "berthPreference": "LOWER"
        }
    ]
};

async function sendBooking(name, body) {
    const start = new Date();

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const text = await response.text();

    console.log("\n==============================");
    console.log(name);
    console.log("Sent:", start.toISOString());
    console.log("Status:", response.status);
    console.log("Response:", text);
    console.log("==============================");
}

sendBooking("SENIOR", seniorRequest);

setTimeout(() => {
    sendBooking("REGULAR", regularRequest);
}, 500);