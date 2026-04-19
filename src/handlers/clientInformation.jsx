/*
// CLIENT INFORMATION HANDLER
// This module provides functions to retrieve client information such as browser, operating system, and a unique device identifier. It uses the User-Agent string and the User-Agent Client Hints API to gather this information. The device identifier is stored in localStorage to persist across sessions.
*/

// Get client information including browser, operating system, and user agent
export const getClientInfo = () => {
    const ua = navigator.userAgent;

    let browser = "Unknown";
    let os = "Unknown";

    if (navigator.userAgentData) {
        browser = navigator.userAgentData.brands?.map(b => b.brand).join(", ") || "Unknown";
        os = navigator.userAgentData.platform || "Unknown";
    } else {
        if (ua.includes("Edg")) browser = "Edge";
        else if (ua.includes("Chrome")) browser = "Chrome";
        else if (ua.includes("Firefox")) browser = "Firefox";
        else if (ua.includes("Safari")) browser = "Safari";

        if (ua.includes("Windows")) os = "Windows";
        else if (ua.includes("Mac")) os = "macOS";
        else if (ua.includes("Linux")) os = "Linux";
        else if (ua.includes("Android")) os = "Android";
        else if (ua.includes("iPhone")) os = "iOS";
    }

    return { browser, os, userAgent: ua };
};

// Get or generate a unique device identifier and store it in localStorage
export const getDeviceId = () => {
    let id = localStorage.getItem("device_id");

    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem("device_id", id);
    }

    return id;
};