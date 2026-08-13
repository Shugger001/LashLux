import { expect, test } from "@playwright/test";

test.describe("Lash Lux critical paths", () => {
  test("home loads and primary CTA reaches booking", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.getByRole("link", { name: /book/i }).first().click();
    await expect(page).toHaveURL(/\/book/);
    await expect(page.getByText(/step 1 of 6/i)).toBeVisible();
  });

  test("guest can complete a booking request", async ({ page }) => {
    await page.route("**/api/availability**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ slots: ["10:00", "11:30", "13:00"], demo: true }),
      });
    });
    await page.route("**/api/bookings", async (route) => {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          id: "demo-e2e-booking",
          emailSent: false,
          depositRequired: false,
        }),
      });
    });

    await page.goto("/book");
    await page.getByRole("button", { name: /classic lashes/i }).first().click();
    await page.getByRole("button", { name: /choose a date/i }).click();

    const dayButton = page.locator("button.rdp-day_button:not([disabled])").first();
    await expect(dayButton).toBeVisible();
    await dayButton.click();
    await page.getByRole("button", { name: /choose a time/i }).click();

    await page.getByRole("button", { name: /10:00\s?AM/i }).click();
    await page.getByRole("button", { name: /add your details/i }).click();

    await page.getByLabel(/full name/i).fill("Demo Client");
    await page.getByLabel(/phone|whatsapp/i).fill("0547986899");
    await page.getByRole("button", { name: /add notes/i }).click();
    await page.getByRole("button", { name: /request appointment|pay/i }).click();

    await expect(
      page.getByRole("heading", { name: /your request is in|you're confirmed/i })
    ).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/demo-e2e-booking/i)).toBeVisible();
  });

  test("admin routes stay gated without a session", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.getByRole("heading").first()).toBeVisible();
    await page.goto("/admin");
    await expect(page).not.toHaveURL(/\/admin$/);
  });
});
