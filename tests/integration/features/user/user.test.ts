import { afterAll, beforeAll, describe, it } from '@std/testing/bdd';
import { expect } from '@std/expect';
import { integrationTestSetup } from '../../utilities/index.ts';
import { Hono } from 'hono';
import { createDrizzleDbConnection } from '../../../../src/config/db.ts';
import { users } from '../../../../src/db/schema.ts';

describe('user', () => {
  let app: Hono;
  let cleanupCallback: () => Promise<void>;

  beforeAll(async () => {
    const {
      app: configuredApp,
      cleanupCallback: testTeardown,
    } = await integrationTestSetup();
    app = configuredApp;
    cleanupCallback = testTeardown;
  });

  afterAll(async () => {
    await cleanupCallback();
  });

  it('Should create a user', async () => {
    // Act
    const response = await app.request('http://localhost/users', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
      }),
    });

    // Assert
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.id).toBeDefined();
    expect(body).toEqual(expect.objectContaining({
      name: 'Test User',
      email: 'test@example.com',
    }));
  });

  it('Should get a user', async () => {
    // Arrange
    const testUser = {
      id: crypto.randomUUID(),
      name: 'Test User',
      email: 'test@example.com',
    };
    const db = createDrizzleDbConnection();
    await db.insert(users).values(testUser);

    // Act
    const response = await app.request(
      `http://localhost/users/${testUser.id}`,
      {
        method: 'GET',
      },
    );

    // Assert
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(expect.objectContaining(testUser));
  });
});
