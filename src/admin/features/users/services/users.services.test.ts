import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockApi } = vi.hoisted(() => ({
	mockApi: {
		get: vi.fn(),
		post: vi.fn(),
		patch: vi.fn(),
		delete: vi.fn(),
	},
}));

vi.mock("@/admin/core/config/apiConfig", () => ({
	default: mockApi,
	API_BASE_URL: "https://api-main.virtual-edu.lat/",
	API_ENDPOINTS: {
		USERS: "api/v1/users/",
	},
}));

import { usersService } from "./users.service";

describe("usersService", () => {
	const rawUser = {
		username: "jordan",
		email: "jordan@example.com",
		name: "Jordan",
		surnames: "Doe",
		rol: "admin",
		status: true,
		img: null,
		id: 1,
		verification: true,
		created_at: "2026-02-20T10:00:00.000Z",
		updated_at: "2026-02-21T10:00:00.000Z",
		last_used_at: "2026-02-22T10:00:00.000Z",
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("getUsers obtiene y parsea una lista de usuarios", async () => {
		mockApi.get.mockResolvedValueOnce({ data: [rawUser] });

		const result = await usersService.getUsers();

		expect(mockApi.get).toHaveBeenCalledWith("https://api-main.virtual-edu.lat/api/v1/users/");
		expect(result).toHaveLength(1);
		expect(result[0].username).toBe("jordan");
		expect(result[0].created_at).toBeInstanceOf(Date);
	});

	it("getUsers falla cuando la respuesta no cumple el schema", async () => {
		mockApi.get.mockResolvedValueOnce({ data: [{ ...rawUser, email: "correo-invalido" }] });

		await expect(usersService.getUsers()).rejects.toThrow();
	});

	it("getUserById obtiene un usuario por id", async () => {
		mockApi.get.mockResolvedValueOnce({ data: rawUser });

		const result = await usersService.getUserById("1");

		expect(mockApi.get).toHaveBeenCalledWith("https://api-main.virtual-edu.lat/api/v1/users/1");
		expect(result.id).toBe(1);
		expect(result.updated_at).toBeInstanceOf(Date);
	});

	it("postUser envía el payload y parsea la respuesta", async () => {
		const payload = {
			username: "newuser",
			email: "newuser@example.com",
			password: "Password1",
			name: "New",
			surnames: "User",
			rol: "teacher",
			status: true,
			img: null,
		};

		mockApi.post.mockResolvedValueOnce({ data: { ...rawUser, username: "newuser", email: payload.email } });

		const result = await usersService.postUser(payload);

		expect(mockApi.post).toHaveBeenCalledWith("https://api-main.virtual-edu.lat/api/v1/users/", payload);
		expect(result.username).toBe("newuser");
	});

	it("patchUser envía datos parciales y parsea la respuesta", async () => {
		const payload = { name: "Jordan Updated", status: false };
		mockApi.patch.mockResolvedValueOnce({
			data: { ...rawUser, name: "Jordan Updated", status: false },
		});

		const result = await usersService.patchUser("1", payload);

		expect(mockApi.patch).toHaveBeenCalledWith("https://api-main.virtual-edu.lat/api/v1/users/1", payload);
		expect(result.name).toBe("Jordan Updated");
		expect(result.status).toBe(false);
	});

	it("deleteUser llama al endpoint correcto", async () => {
		mockApi.delete.mockResolvedValueOnce({});

		await expect(usersService.deleteUser("1")).resolves.toBeUndefined();
		expect(mockApi.delete).toHaveBeenCalledWith("https://api-main.virtual-edu.lat/api/v1/users/1");
	});
});
