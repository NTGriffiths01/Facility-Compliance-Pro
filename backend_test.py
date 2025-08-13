import requests
import sys
import json
from datetime import datetime

class BackendAPITester:
    def __init__(self, base_url="/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)}")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {json.dumps(error_data, indent=2)}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health(self):
        """Test health endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "health",
            200
        )
        return success

    def test_login(self, email="Nolan.Griffiths@doc.state.ma.us", password="Admin123"):
        """Test login and get token"""
        success, response = self.run_test(
            "Login",
            "POST",
            "auth/login",
            200,
            data={"email": email, "password": password}
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_login_invalid(self):
        """Test login with invalid credentials"""
        success, response = self.run_test(
            "Login with Invalid Credentials",
            "POST",
            "auth/login",
            401,
            data={"email": "invalid@example.com", "password": "wrongpassword"}
        )
        return success

    def test_me_endpoint(self):
        """Test /me endpoint (requires authentication)"""
        if not self.token:
            print("❌ No token available for /me test")
            return False
            
        success, response = self.run_test(
            "Get Current User (/me)",
            "GET",
            "me",
            200
        )
        return success

    def test_me_unauthorized(self):
        """Test /me endpoint without token"""
        old_token = self.token
        self.token = None  # Temporarily remove token
        success, response = self.run_test(
            "Get Current User (Unauthorized)",
            "GET",
            "me",
            401
        )
        self.token = old_token  # Restore token
        return success

    def test_preview_endpoint(self):
        """Test /preview endpoint (requires authentication)"""
        if not self.token:
            print("❌ No token available for /preview test")
            return False
            
        success, response = self.run_test(
            "Get Preview Data",
            "GET",
            "preview",
            200
        )
        
        # Validate expected response structure
        if success and response:
            expected_fields = ['title', 'subtitle', 'bullets']
            for field in expected_fields:
                if field not in response:
                    print(f"❌ Missing expected field: {field}")
                    return False
            
            if response.get('title') != 'World-Class Performance':
                print(f"❌ Unexpected title: {response.get('title')}")
                return False
                
            if not isinstance(response.get('bullets'), list):
                print(f"❌ Bullets should be a list")
                return False
                
            print("✅ Preview response structure validated")
        
        return success

    def test_preview_unauthorized(self):
        """Test /preview endpoint without token"""
        old_token = self.token
        self.token = None  # Temporarily remove token
        success, response = self.run_test(
            "Get Preview Data (Unauthorized)",
            "GET",
            "preview",
            401
        )
        self.token = old_token  # Restore token
        return success

def main():
    print("🚀 Starting Backend API Tests")
    print("=" * 50)
    
    # Setup
    tester = BackendAPITester()
    
    # Run tests in order
    tests = [
        ("Health Check", tester.test_health),
        ("Valid Login", tester.test_login),
        ("Invalid Login", tester.test_login_invalid),
        ("Get Current User", tester.test_me_endpoint),
        ("Get Current User (Unauthorized)", tester.test_me_unauthorized),
        ("Get Preview Data", tester.test_preview_endpoint),
        ("Get Preview Data (Unauthorized)", tester.test_preview_unauthorized),
    ]
    
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        try:
            test_func()
        except Exception as e:
            print(f"❌ Test {test_name} failed with exception: {str(e)}")
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All backend tests passed!")
        return 0
    else:
        print("⚠️  Some backend tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())