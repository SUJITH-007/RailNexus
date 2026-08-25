const trains = [
    {
        number: "12601",
        name: "RailNexus Express",
        from: "Bangalore",
        departure: "06:30 AM",
        to: "Hubli",
        arrival: "01:45 PM",
        duration: "7h 15m",
        route: [
            {
                station: "Bangalore",
                arrival: "-",
                departure: "06:30 AM"
            },
            {
                station: "Tumkur",
                arrival: "07:35 AM",
                departure: "07:40 AM"
            },
            {
                station: "Chitradurga",
                arrival: "09:20 AM",
                departure: "09:25 AM"
            },
            {
                station: "Davangere",
                arrival: "10:35 AM",
                departure: "10:40 AM"
            },
            {
                station: "Hubli",
                arrival: "01:45 PM",
                departure: "-"
            }
        ],
        classes: [
            { name: "SL", price: "₹450", available: 42 },
            { name: "3A", price: "₹650", available: 18 },
            { name: "2A", price: "₹900", available: 8 },
            { name: "1A", price: "₹1,200", available: 3 }
        ]
    },
    {
        number: "12845",
        name: "Deccan Star",
        from: "Bangalore",
        departure: "08:15 AM",
        to: "Hubli",
        arrival: "03:30 PM",
        duration: "7h 15m",
        route: [
            {
                station: "Bangalore",
                arrival: "-",
                departure: "08:15 AM"
            },
            {
                station: "Tumkur",
                arrival: "09:20 AM",
                departure: "09:25 AM"
            },
            {
                station: "Davangere",
                arrival: "12:15 PM",
                departure: "12:20 PM"
            },
            {
                station: "Hubli",
                arrival: "03:30 PM",
                departure: "-"
            }
        ],
        classes: [
            { name: "SL", price: "₹420", available: 35 },
            { name: "3A", price: "₹620", available: 14 },
            { name: "2A", price: "₹850", available: 6 }
        ]
    },
    {
        number: "16591",
        name: "Southern Explorer",
        from: "Bangalore",
        departure: "10:45 AM",
        to: "Hubli",
        arrival: "06:20 PM",
        duration: "7h 35m",
        route: [
            {
                station: "Bangalore",
                arrival: "-",
                departure: "10:45 AM"
            },
            {
                station: "Tumkur",
                arrival: "11:55 AM",
                departure: "12:00 PM"
            },
            {
                station: "Chitradurga",
                arrival: "01:40 PM",
                departure: "01:45 PM"
            },
            {
                station: "Davangere",
                arrival: "02:55 PM",
                departure: "03:00 PM"
            },
            {
                station: "Hubli",
                arrival: "06:20 PM",
                departure: "-"
            }
        ],
        classes: [
            { name: "SL", price: "₹390", available: 28 },
            { name: "3A", price: "₹590", available: 11 },
            { name: "2A", price: "₹820", available: 5 }
        ]
    },
    {
        number: "17205",
        name: "Karnataka Express",
        from: "Mangalore",
        departure: "07:00 AM",
        to: "Bangalore",
        arrival: "01:30 PM",
        duration: "6h 30m",
        route: [
            {
                station: "Mangalore",
                arrival: "-",
                departure: "07:00 AM"
            },
            {
                station: "Udupi",
                arrival: "08:05 AM",
                departure: "08:10 AM"
            },
            {
                station: "Kundapura",
                arrival: "08:45 AM",
                departure: "08:50 AM"
            },
            {
                station: "Bangalore",
                arrival: "01:30 PM",
                departure: "-"
            }
        ],
        classes: [
            { name: "SL", price: "₹380", available: 31 },
            { name: "3A", price: "₹570", available: 12 },
            { name: "2A", price: "₹800", available: 4 }
        ]
    },
    {
        number: "16526",
        name: "Mysore Intercity",
        from: "Bangalore",
        departure: "09:30 AM",
        to: "Mysore",
        arrival: "12:15 PM",
        duration: "2h 45m",
        route: [
            {
                station: "Bangalore",
                arrival: "-",
                departure: "09:30 AM"
            },
            {
                station: "Mandya",
                arrival: "10:40 AM",
                departure: "10:45 AM"
            },
            {
                station: "Mysore",
                arrival: "12:15 PM",
                departure: "-"
            }
        ],
        classes: [
            { name: "CC", price: "₹350", available: 24 },
            { name: "2S", price: "₹120", available: 68 }
        ]
    }
];

export default trains;