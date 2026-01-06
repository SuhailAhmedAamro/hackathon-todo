"""
Test WebSocket connection to MCP server
"""

import asyncio
import websockets
import json

async def test_chatbot():
    uri = "ws://localhost:8001/ws/chat"

    print(f"[*] Connecting to {uri}...")

    try:
        async with websockets.connect(uri) as websocket:
            print("[+] Connected successfully!")

            # Send a test message
            test_message = {
                "type": "chat",
                "message": "Create a task to test the OpenAI chatbot integration",
                "conversation_id": "test_session",
                "language": "en"
            }

            print(f"\n[>] Sending message: {test_message['message']}")
            await websocket.send(json.dumps(test_message))

            # Wait for response
            print("[*] Waiting for response...")

            try:
                response = await asyncio.wait_for(websocket.recv(), timeout=30.0)
                data = json.loads(response)

                print(f"\n[<] Received response:")
                print(f"Type: {data.get('type')}")
                print(f"Role: {data.get('role')}")
                print(f"Content: {data.get('content')}")

                if data.get('tool_calls'):
                    print(f"\n[!] Tool calls executed:")
                    for tool in data['tool_calls']:
                        print(f"  - {tool['tool']}: {tool['result']}")

                print("\n[+] Test completed successfully!")

            except asyncio.TimeoutError:
                print("[-] Timeout waiting for response")

    except ConnectionRefusedError:
        print("[-] Connection refused - is the MCP server running?")
    except Exception as e:
        print(f"[-] Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_chatbot())
