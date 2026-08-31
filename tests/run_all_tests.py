#!/usr/bin/env python3
"""
UPI ScamGuard Master Automated Test Runner
Executes both Python PyTest (Backend API + ML models) and TypeScript typecheck / frontend unit logic.
"""

import sys
import os
import subprocess

# Ensure project root is in sys.path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if project_root not in sys.path:
    sys.path.insert(0, project_root)


def run_command(cmd, description):
    print(f"\n========================================")
    print(f"RUNNING: {description}")
    print(f"========================================\n")
    print(f"Executing command: {' '.join(cmd)}")
    result = subprocess.run(cmd, cwd=project_root)
    if result.returncode != 0:
        print(f"\nFAILED: {description} (Exit Code: {result.returncode})\n")
        return False
    print(f"\nPASSED: {description}\n")
    return True


def main():
    print("========================================")
    print("UPI SCAMGUARD COMPREHENSIVE TEST SUITE")
    print("========================================")

    all_passed = True

    # 1. Run PyTest for Backend API endpoints & ML Models
    pytest_cmd = [sys.executable, "-m", "pytest", "tests/", "-v"]
    if not run_command(pytest_cmd, "Python Backend API & ML Model Unit Tests"):
        all_passed = False

    # 2. Run TypeScript Type Checker for React Native App
    tsc_cmd = ["node", "node_modules/typescript/bin/tsc", "--noEmit"]
    if not run_command(tsc_cmd, "React Native TypeScript Type Safety Check"):
        all_passed = False

    print("\n----------------------------------------")
    if all_passed:
        print("ALL TEST SUITES PASSED SUCCESSFULLY!")
        print("----------------------------------------\n")
        sys.exit(0)
    else:
        print("SOME TEST SUITES FAILED. PLEASE REVIEW LOGS ABOVE.")
        print("----------------------------------------\n")
        sys.exit(1)


if __name__ == "__main__":
    main()
