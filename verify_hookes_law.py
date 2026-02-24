
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            print("Navigating to hookes-law...")
            page.goto("http://localhost:9002/formula/hookes-law")
            page.wait_for_load_state("networkidle")

            print("Taking screenshot...")
            page.screenshot(path="hookes-law.png")
            print("Screenshot saved to hookes-law.png")

            # Check for any console errors (optional but good practice)
            # This is hard to do synchronously in a simple script without event listeners,
            # but if the page loads and screenshot works, it's a good sign.

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
