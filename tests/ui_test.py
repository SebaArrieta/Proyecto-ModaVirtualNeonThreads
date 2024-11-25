from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time

def setup_chrome_driver():
    # Chrome options
    options = Options()
    options.add_argument('--headless')  # Run Chrome in headless mode (no GUI)
    options.add_argument('--no-sandbox')  # Bypass OS security model
    options.add_argument('--disable-dev-shm-usage')  # Overcome limited resource problems

    # Automatically install Chrome WebDriver using ChromeDriverManager
    service = Service(ChromeDriverManager().install())
    
    # Return the driver
    driver = webdriver.Chrome(service=service, options=options)
    return driver
    
def test_first_product_click():
    driver = setup_chrome_driver()
    
    try:
        # Navigate to the Home page
        driver.get("http://localhost:3000")  # Update to the correct local React app URL
        time.sleep(2)  # Wait for the page to load fully (adjust if needed)

        # Locate the first product card by its class
        product_cards = driver.find_elements(By.CLASS_NAME, "card")
        assert product_cards, "No product cards found on the page."

        # Click the first product
        first_product = product_cards[0]
        first_product.click()
        time.sleep(2)  # Wait for the navigation to complete

        # Validate redirection to the product page
        assert "/product" in driver.current_url, f"Did not navigate to product page. URL: {driver.current_url}"

        print("Test passed: First product successfully clicked and navigated.")
    except Exception as e:
        print(f"Test failed: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    test_first_product_click()