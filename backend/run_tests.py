import asyncio
import sys
import os

# Ensure backend directory is on pythonpath
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from tests.test_simulation import test_city_simulation_engine
from tests.test_hospital_ranking import test_hospital_ranking_engine
from tests.test_smart_route import test_smart_route_evaluation

async def main():
    print("==========================================")
    print("RUNNING URBANSYNC BACKEND VERIFICATION TESTS")
    print("==========================================")
    
    print("\n[1/3] Testing AI What-If City Simulation Engine...")
    test_city_simulation_engine()
    print("[OK] City Simulation Engine Test Passed!")

    print("\n[2/3] Testing Hospital Ranking Engine...")
    test_hospital_ranking_engine()
    print("[OK] Hospital Ranking Engine Test Passed!")

    print("\n[3/3] Testing Flagship AI Smart Route Scoring Engine...")
    await test_smart_route_evaluation()
    print("[OK] Smart Route Scoring Engine Test Passed!")

    print("\n==========================================")
    print("ALL BACKEND VERIFICATION TESTS PASSED CLEANLY!")
    print("==========================================")

if __name__ == "__main__":
    asyncio.run(main())
