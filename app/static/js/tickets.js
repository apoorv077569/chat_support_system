// import { apiGet, apiPost } from "./services/api_service.js";

// // DOM elements
// const ticketsContainer = document.getElementById("ticketsContainer");
// const newTicketForm = document.getElementById("newTicketForm");

// // Get token from local storage
// const token = localStorage.getItem("token");
// console.log("Token retrieved: " + (token ? "Yes" : "No"));

// /**
//  * Loads and displays the list of user tickets.
//  */
// async function loadTickets() {
//     if (!token) return; // Should be handled by initTicketsPage, but good defensive programming

//     try {
//         const tickets = await apiGet("/api/tickets/get-tickets", token);
//         ticketsContainer.innerHTML = "";

//         if (!tickets || tickets.error) {
//             console.error(tickets.error || "Failed to load tickets");
//             // Use a custom message/UI element instead of alert
//             ticketsContainer.innerHTML = `<p class="text-red-500">Error: ${tickets.error || "Failed to load tickets"}</p>`;
//             return;
//         }

//         tickets.forEach(t => {
//             const div = document.createElement("div");
//             div.classList.add("ticket", "p-4", "border", "rounded-lg", "shadow-sm", "mb-3");
//             div.innerHTML = `
//                 <h4 class="text-lg font-semibold">${t.title} <span class="text-sm text-gray-500">(${t.status})</span></h4>
//                 <p class="text-gray-700 mt-1">${t.subject}</p>
//                 <div class="text-xs mt-2 space-y-1">
//                     <p><strong>Priority:</strong> <span class="font-medium">${t.priority}</span></p>
//                     <p><strong>Created At:</strong> ${new Date(t.created_at).toLocaleString()}</p>
//                 </div>
//                 <a href="/chat/${t.id}" class="text-blue-600 hover:underline mt-2 inline-block">Open Chat</a>
//             `;
//             ticketsContainer.appendChild(div);
//         });
//     } catch (err) {
//         console.error("Error loading tickets:", err);
//         // Use a custom message/UI element instead of alert
//         ticketsContainer.innerHTML = `<p class="text-red-500">An unexpected error occurred while fetching tickets.</p>`;
//     }
// }

// /**
//  * Handles the submission of the new ticket form.
//  */
// async function handleNewTicketSubmission(e) {
//     e.preventDefault();
//     if (!token) {
//         console.error("Attempted to create ticket without token.");
//         return;
//     }

//     const title = newTicketForm.title.value;
//     const subject = newTicketForm.subject.value;
//     const priority = newTicketForm.priority.value;

//     try {
//         const result = await apiPost("/api/tickets/create-ticket", { title, subject, priority }, token);

//         if (result.message) {
//             console.log("Ticket created successfully:", result.message);
//             // Use custom success notification instead of alert
//             newTicketForm.reset();
//             loadTickets();
//         } else {
//             console.error("Ticket creation failed:", result.error || result.details || "Unknown error");
//             // Use custom error notification instead of alert
//         }
//     } catch (err) {
//         console.error("Something went wrong during ticket creation:", err);
//         // Use custom error notification instead of alert
//     }
// }

// /**
//  * Main initialization function. Checks token and sets up event listeners.
//  */
// function initTicketsPage() {
//     if (!token) {
//         console.log("No authentication token found. Redirecting to login.");
//         // We log the error but still redirect, as the user cannot use this page without auth.
//         window.location.href = "/login";
//         return;
//     }

//     // Load initial data
//     loadTickets();

//     // Attach event listener
//     if (newTicketForm) {
//         newTicketForm.addEventListener("submit", handleNewTicketSubmission);
//     }
// }

// window.addEventListener("DOMContentLoaded", initTicketsPage);

import { apiGet, apiPost } from "./services/api_service.js";

// DOM elements
const ticketsContainer = document.getElementById("ticketsContainer");
const newTicketForm = document.getElementById("newTicketForm");

// Get token from local storage
const token = localStorage.getItem("token");
console.log("Token retrieved: " + (token ? "Yes" : "No"));

/**
 * Loads and displays the list of user tickets.
 */
async function loadTickets() {
  if (!token) return;

  try {
    const tickets = await apiGet("/api/tickets/get-tickets", token);

    if (!ticketsContainer) {
      console.error("ticketsContainer element NOT found in DOM");
      return;
    }

    ticketsContainer.innerHTML = "";

    if (!tickets || tickets.error) {
      console.error(tickets.error || "Failed to load tickets");
      ticketsContainer.innerHTML = `
                <p class="text-red-500">Error: ${
                  tickets.error || "Failed to load tickets"
                }</p>
            `;
      return;
    }

    tickets.forEach((t) => {
      const div = document.createElement("div");
      div.classList.add("ticket-card");
      div.innerHTML = `
        <div class="ticket-title">
            ${t.title}
            <span class="ticket-status">${t.status}</span>
        </div>

        <p class="ticket-description">${t.subject}</p>

            <div class="ticket-meta">
                <strong>Priority:</strong> ${t.priority}<br>
                <strong>Created:</strong> ${new Date(t.created_at).toLocaleString()}
            </div>

        <a href="/api/messages/chat/${t.id}" class="chat-btn">Open Chat</a>
    `;

      ticketsContainer.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading tickets:", err);
    ticketsContainer.innerHTML = `
            <p class="text-red-500">Unexpected error while loading tickets.</p>
        `;
  }
}

/**
 * Handles the submission of the new ticket form.
 */
async function handleNewTicketSubmission(e) {
  e.preventDefault();

  if (!token) {
    console.error("Attempted to create ticket without token.");
    return;
  }

  const title = newTicketForm.title.value;
  const subject = newTicketForm.subject.value;
  const priority = newTicketForm.priority.value;

  try {
    const result = await apiPost(
      "/api/tickets/create-ticket",
      { title, subject, priority },
      token
    );

    console.log("Create Ticket Result:", result);

    if (result.message) {
      newTicketForm.reset();
      loadTickets();
    } else {
      console.error(
        "Ticket creation failed:",
        result.error || result.details || "Unknown error"
      );
    }
  } catch (err) {
    console.error("Something went wrong during ticket creation:", err);
  }
}

/**
 * Initialization of ticket page.
 */
function initTicketsPage() {
  if (!token) {
    console.log("No authentication token found. Redirecting to login.");
    window.location.href = "/login";
    return;
  }

  loadTickets();

  if (newTicketForm) {
    newTicketForm.addEventListener("submit", handleNewTicketSubmission);
  }
}

window.addEventListener("DOMContentLoaded", initTicketsPage);
