from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def setup_chrome_driver():
    # Chrome options
    options = Options()
    #options.add_argument('--headless')  # Run Chrome in headless mode (no GUI)
    options.add_argument('--no-sandbox')  # Bypass OS security model
    options.add_argument('--disable-dev-shm-usage')  # Overcome limited resource problems

    # Automatically install Chrome WebDriver using ChromeDriverManager
    service = Service(ChromeDriverManager().install())
    
    # Return the driver
    driver = webdriver.Chrome(service=service, options=options)
    return driver

def test_login():    
    try:
        # Navigate to the Login page
        driver.get("http://localhost:3000/login")  # Update the path if necessary

        # Wait for email input to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "exampleInputEmail1"))
        )

        # Input email
        email_input = driver.find_element(By.ID, "exampleInputEmail1")
        email_input.send_keys("lala@neon.com")
        
        # Input password
        password_input = driver.find_element(By.ID, "exampleInputPassword1")
        password_input.send_keys("Lala1")

        submit_button = driver.find_element(By.ID, "submit")
        time.sleep(1)
        submit_button.click()


        WebDriverWait(driver, 10).until(
            lambda driver: driver.current_url != "http://localhost:3000/login"
        )

        time.sleep(1)
        # Print the final URL after redirection
        print(f"Final Current URL: {driver.current_url}")
        # Verify the redirection
        assert driver.current_url == "http://localhost:3000/", "Redirection to localhost:3000 failed."
        driver.refresh()
        time.sleep(2)
        print("Login and redirection test passed.")

        print("redirection verified.")
    except Exception as e:
        print(f"Test fallido: {e}")
    
def test_first_product_click():    
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
        assert "/product" in driver.current_url, f"No se pudo acceder a . URL: {driver.current_url}"

        print("Test ok: Se clickeó y accedió al primer producto")
    except Exception as e:
        print(f"Test fallido: {e}")




if __name__ == "__main__":
    driver = setup_chrome_driver()
    driver.maximize_window()

    test_login()

    #test_first_product_click()
    #driver.quit()