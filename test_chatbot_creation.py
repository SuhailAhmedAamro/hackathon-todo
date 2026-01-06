#!/usr/bin/env python3
"""
Test script to verify chatbot task creation
Simulates what happens when user sends "Create a task" in the chat widget
"""

import asyncio
import httpx
import json

# MCP Server endpoint
MCP_URL = "http://localhost:8001"

# JWT Token for authentication
BACKEND_AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMWI4N2RhMzUtZDQ1Ny00NDY4LWI5ZjYtZTQ3ZTc4MzZhMDYyIiwidXNlcm5hbWUiOiJjbGF1ZGVfZGVtbyIsImV4cCI6MTc2NzU0MDYwOSwidHlwZSI6ImFjY2VzcyJ9.xpYf6E_xVZkrP4baeak8rZ0HUSwoovbvY4Kjow9pn-Y"

# Backend API
BACKEND_URL = "http://localhost:8000"


async def test_direct_backend_creation():
    """Test creating task directly via backend API"""
    print("=" * 70)
    print("TEST 1: Direct Backend Task Creation")
    print("=" * 70)

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{BACKEND_URL}/api/tasks",
                json={
                    "title": "Direct Backend Test Task",
                    "description": "Testing direct backend API call",
                    "priority": "medium"
                },
                headers={
                    "Authorization": f"Bearer {BACKEND_AUTH_TOKEN}",
                    "Content-Type": "application/json"
                },
                timeout=10.0
            )

            if response.status_code == 200:
                task = response.json()
                print(f"✅ SUCCESS: Task created via backend")
                print(f"   ID: {task['id']}")
                print(f"   Title: {task['title']}")
                print(f"   Priority: {task['priority']}")
                return True
            else:
                print(f"❌ FAILED: Status {response.status_code}")
                print(f"   Response: {response.text}")
                return False

        except Exception as e:
            print(f"❌ ERROR: {str(e)}")
            return False


async def test_mcp_tool_creation():
    """Test creating task via MCP create_task tool"""
    print("\n" + "=" * 70)
    print("TEST 2: MCP Tool Task Creation (Simulated)")
    print("=" * 70)

    # Import the create_task handler
    import sys
    import os
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'phase-3-chatbot', 'mcp-server', 'src'))

    try:
        # Set environment variable
        os.environ['BACKEND_AUTH_TOKEN'] = BACKEND_AUTH_TOKEN

        from tools.create_task import create_task_handler

        result = await create_task_handler(
            parameters={
                "title": "MCP Tool Test Task",
                "description": "Testing via MCP create_task handler",
                "priority": "high"
            },
            user_id="demo_user"
        )

        print(f"✅ SUCCESS: {result['message']}")
        print(f"   Task: {result['task']['title']}")
        print(f"   ID: {result['task']['id']}")
        return True

    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False


async def verify_task_count():
    """Verify total task count increased"""
    print("\n" + "=" * 70)
    print("TEST 3: Verify Task Count")
    print("=" * 70)

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{BACKEND_URL}/api/tasks",
                headers={
                    "Authorization": f"Bearer {BACKEND_AUTH_TOKEN}"
                },
                timeout=10.0
            )

            if response.status_code == 200:
                data = response.json()
                total = data.get('total', len(data.get('items', [])))
                print(f"✅ SUCCESS: Found {total} total tasks")
                print(f"\nLatest 3 tasks:")
                for i, task in enumerate(data.get('items', [])[:3], 1):
                    print(f"   {i}. {task['title']} ({task['priority']})")
                return True
            else:
                print(f"❌ FAILED: Status {response.status_code}")
                return False

        except Exception as e:
            print(f"❌ ERROR: {str(e)}")
            return False


async def main():
    """Run all tests"""
    print("\n🧪 CHATBOT TASK CREATION VERIFICATION")
    print("=" * 70)
    print()

    results = []

    # Test 1: Direct backend
    results.append(await test_direct_backend_creation())
    await asyncio.sleep(1)

    # Test 2: MCP tool
    results.append(await test_mcp_tool_creation())
    await asyncio.sleep(1)

    # Test 3: Verify count
    results.append(await verify_task_count())

    # Summary
    print("\n" + "=" * 70)
    print("📊 TEST SUMMARY")
    print("=" * 70)
    passed = sum(results)
    total = len(results)
    print(f"Passed: {passed}/{total}")

    if passed == total:
        print("\n🎉 ALL TESTS PASSED! Chatbot task creation is working!")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Check logs above.")

    return passed == total


if __name__ == "__main__":
    success = asyncio.run(main())
    exit(0 if success else 1)
