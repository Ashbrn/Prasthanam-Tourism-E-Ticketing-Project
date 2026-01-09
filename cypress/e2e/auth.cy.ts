describe("Authentication Flow", () => {
  it("should register a new user", () => {
    cy.visit("/");
    cy.contains("Register").click();
    cy.get('input[type="text"]').first().type("Test User");
    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="tel"]').type("9876543210");
    cy.get('input[type="password"]').type("TestPass123");
    cy.contains("Sign Up").click();
    cy.url().should("include", "/chat");
  });

  it("should login with valid credentials", () => {
    cy.visit("/login");
    cy.get('input[type="email"]').type("admin@prasthanam.com");
    cy.get('input[type="password"]').type("Admin@123");
    cy.contains("Sign In").click();
    cy.url().should("include", "/chat");
  });

  it("should show error on invalid credentials", () => {
    cy.visit("/login");
    cy.get('input[type="email"]').type("invalid@example.com");
    cy.get('input[type="password"]').type("wrongpassword");
    cy.contains("Sign In").click();
    cy.contains("error").should("be.visible");
  });

  it("should logout successfully", () => {
    cy.login("admin@prasthanam.com", "Admin@123");
    cy.contains("Logout").click();
    cy.url().should("equal", "http://localhost:3000/");
  });
});
