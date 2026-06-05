import { test, expect } from '@playwright/test';

test.describe('ReqRes REST API Testing Suite', { tag: ['@api'] }, () => {
  const apiBaseUrl = 'https://reqres.in';

  test('GET - Retrieve list of users and validate response structure', async ({ request }) => {
    const response = await request.get(`${apiBaseUrl}/api/users?page=2`);
    
    // Assert status code is 200 OK
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    
    // Validate response headers
    expect(response.headers()['content-type']).toContain('application/json');

    // Assert schema structure
    expect(body).toHaveProperty('page', 2);
    expect(body).toHaveProperty('per_page');
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('total_pages');
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBeGreaterThan(0);

    // Validate structure of the first user in the array
    const user = body.data[0];
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('first_name');
    expect(user).toHaveProperty('last_name');
    expect(user).toHaveProperty('avatar');
    expect(user.email).toContain('@');
  });

  test('POST - Create a new user and verify creation details', async ({ request }) => {
    const payload = {
      name: 'John Doe',
      job: 'Senior Automation Engineer'
    };

    const response = await request.post(`${apiBaseUrl}/api/users`, {
      data: payload
    });

    // Assert status code is 201 Created
    expect(response.status()).toBe(201);

    const body = await response.json();
    
    // Assert response contains user details and auto-generated fields
    expect(body.name).toBe(payload.name);
    expect(body.job).toBe(payload.job);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('createdAt');
  });

  test('PUT - Update existing user details', async ({ request }) => {
    const payload = {
      name: 'John Doe Updated',
      job: 'Lead QA Architect'
    };

    // Update user with ID 2
    const response = await request.put(`${apiBaseUrl}/api/users/2`, {
      data: payload
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.name).toBe(payload.name);
    expect(body.job).toBe(payload.job);
    expect(body).toHaveProperty('updatedAt');
  });

  test('DELETE - Delete a user and confirm deletion', async ({ request }) => {
    // Delete user with ID 2
    const response = await request.delete(`${apiBaseUrl}/api/users/2`);

    // Assert status code is 204 No Content
    expect(response.status()).toBe(204);
  });
});
