/**
 * @file auth.test.js
 * Tests for authentication utilities
 */

import fetchMock from "jest-fetch-mock";
import { jwtDecode } from "jwt-decode";



// Enable fetch mocks
fetchMock.enableMocks();

// Import after mocks are set up
import {
  authenticateUser,
  registerUser,
  getToken,
  removeToken,
  readToken,
  isAuthenticated,
} from "../src/auth.js"; // adjust the path if needed

// Mock jwt-decode implementation
jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

// Define test environment variable before any tests run
beforeAll(() => {
  process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000";
});

// Reset between tests
beforeEach(() => {
  fetch.resetMocks();
  localStorage.clear();
  jest.clearAllMocks();
});

describe("authenticateUser", () => {
  test("stores token and returns true on success", async () => {
    const fakeToken = "abc123";
    fetch.mockResponseOnce(JSON.stringify({ token: fakeToken }), {
      status: 200,
    });

    const result = await authenticateUser("alice", "password");
    expect(result).toBe(true);

    // Ensure correct fetch call
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/login",
      expect.objectContaining({
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userName: "alice", password: "password" }),
      })
    );

    // Token is stored in localStorage
    expect(localStorage.getItem("access_token")).toBe(fakeToken);
  });

  test("throws an error if API returns failure", async () => {
    fetch.mockResponseOnce(JSON.stringify({ message: "Invalid credentials" }), {
      status: 401,
    });

    await expect(authenticateUser("bob", "wrong")).rejects.toThrow(
      "Invalid credentials"
    );
  });
});

describe("registerUser", () => {
  test("returns true on successful registration", async () => {
    fetch.mockResponseOnce(JSON.stringify({ message: "ok" }), { status: 200 });

    const result = await registerUser("john", "123", "123");
    expect(result).toBe(true);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/register",
      expect.objectContaining({
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          userName: "john",
          password: "123",
          password2: "123",
        }),
      })
    );
  });

  test("throws error on failed registration", async () => {
    fetch.mockResponseOnce(JSON.stringify({ message: "User exists" }), {
      status: 400,
    });

    await expect(registerUser("john", "123", "123")).rejects.toThrow(
      "User exists"
    );
  });
});

describe("token management", () => {
  test("getToken returns stored token", () => {
    localStorage.setItem("access_token", "token123");
    expect(getToken()).toBe("token123");
  });

  test("removeToken deletes stored token", () => {
    localStorage.setItem("access_token", "token123");
    removeToken();
    expect(localStorage.getItem("access_token")).toBeNull();
  });

  test("readToken decodes a valid token", () => {
    const fakeDecoded = { user: "alice" };
    jwtDecode.mockReturnValue(fakeDecoded);
    localStorage.setItem("access_token", "validToken");

    const result = readToken();
    expect(result).toEqual(fakeDecoded);
    expect(jwtDecode).toHaveBeenCalledWith("validToken");
  });

  test("readToken returns null on invalid token", () => {
    jwtDecode.mockImplementation(() => {
      throw new Error("Invalid token");
    });
    localStorage.setItem("access_token", "badToken");

    const result = readToken();
    expect(result).toBeNull();
  });

  test("isAuthenticated returns true when token is valid", () => {
    jwtDecode.mockReturnValue({ user: "alice" });
    localStorage.setItem("access_token", "validToken");

    expect(isAuthenticated()).toBe(true);
  });

  test("isAuthenticated returns false when no token", () => {
    localStorage.clear();
    expect(isAuthenticated()).toBe(false);
  });
});
