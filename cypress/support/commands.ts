Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/login");
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.contains("Sign In").click();
  cy.url().should("include", "/chat");
});

Cypress.Commands.add("logout", () => {
  cy.contains("Logout").click();
  cy.url().should("equal", "http://localhost:3000/");
});

Cypress.Commands.add("searchEvent", (query: string) => {
  cy.visit("/events");
  cy.get('input[placeholder*="Search"]').type(query);
  cy.wait(1000);
});

Cypress.Commands.add("bookEvent", (slug: string, tickets: { [key: string]: number }) => {
  cy.visit(`/events/${slug}`);
  Object.entries(tickets).forEach(([ticketType, qty]) => {
    cy.get(`input[value="${ticketType}"]`).parent().find("input[type=number]").clear().type(String(qty));
  });
  cy.contains("Proceed to Payment").click();
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      logout(): Chainable<void>;
      searchEvent(query: string): Chainable<void>;
      bookEvent(slug: string, tickets: { [key: string]: number }): Chainable<void>;
    }
  }
}
