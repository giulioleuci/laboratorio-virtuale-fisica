
from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            print("Navigating to homepage...")
            # Retry logic for server startup
            for i in range(10):
                try:
                    page.goto("http://localhost:9002", timeout=10000)
                    break
                except Exception as e:
                    print(f"Attempt {i+1} failed: {e}")
                    time.sleep(5)

            print("Waiting for headings...")
            # Wait for at least one category header to be visible
            page.wait_for_selector("h2.font-headline", timeout=60000)

            # Get all category headings
            headings = page.locator("h2.font-headline").all_inner_texts()
            print(f"Found headings: {headings}")

            # Check if Strumenti is last
            if headings and "Strumenti" in headings[-1]:
                print("SUCCESS: 'Strumenti' is the last category.")
            else:
                print(f"FAILURE: 'Strumenti' is not the last category. Last is '{headings[-1] if headings else 'None'}'")

            page.screenshot(path="verification.png", full_page=True)
            print("Screenshot saved to verification.png")

        except Exception as e:
            print(f"Error: {e}")
            try:
                page.screenshot(path="error.png")
            except:
                pass
        finally:
            browser.close()

if __name__ == "__main__":
    run()
