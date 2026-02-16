from playwright.sync_api import sync_playwright
import time
import sys

def verify_aria_labels():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Navigate to the pendulum experiment page
            print("Navigating to http://localhost:9002/formula/pendulum...")
            page.goto("http://localhost:9002/formula/pendulum")

            # Wait for the table to be visible
            print("Waiting for table...")
            page.wait_for_selector("table", timeout=10000)

            # Add a row to the table
            print("Adding a row...")
            page.click("button:has-text('Aggiungi riga')")

            # Wait for inputs to appear
            print("Waiting for inputs...")
            page.wait_for_selector("input[type='number']", timeout=5000)

            # Check aria-labels
            # Pendulum has "Lunghezza (l)" and "Tempo misurato (t)"

            print("Checking aria-labels...")
            # Verify Lunghezza value input
            length_input = page.locator("input[aria-label='Valore per Lunghezza (l) (riga 1)']")
            if length_input.count() > 0:
                print("SUCCESS: Found input with aria-label 'Valore per Lunghezza (l) (riga 1)'")
            else:
                print("FAILURE: Did not find input with aria-label 'Valore per Lunghezza (l) (riga 1)'")
                # print all inputs aria-labels for debugging
                inputs = page.locator("input").all()
                for i, inp in enumerate(inputs):
                    print(f"Input {i} aria-label: {inp.get_attribute('aria-label')}")

            # Verify Lunghezza uncertainty input
            length_sigma_input = page.locator("input[aria-label='Incertezza per Lunghezza (l) (riga 1)']")
            if length_sigma_input.count() > 0:
                print("SUCCESS: Found input with aria-label 'Incertezza per Lunghezza (l) (riga 1)'")
            else:
                print("FAILURE: Did not find input with aria-label 'Incertezza per Lunghezza (l) (riga 1)'")

            # Take a screenshot
            page.screenshot(path="verification_aria.png")
            print("Screenshot saved to verification_aria.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification_error.png")
            sys.exit(1)
        finally:
            browser.close()

if __name__ == "__main__":
    verify_aria_labels()
