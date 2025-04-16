import { afterAll, afterEach, beforeAll, describe, it } from '@std/testing/bdd';
import { expect } from '@std/expect';
import { OpenAPIHono } from '@hono/zod-openapi';
import { integrationTestSetup } from '../../utilities/index.ts';
import {
  createDrizzleDbConnection,
  usingDbClient,
} from '../../../../src/config/db.ts';
import { users } from '../../../../src/db/schema.ts';

describe('user', () => {
  let app: OpenAPIHono;
  let cleanupCallback: () => Promise<void>;

  beforeAll(async () => {
    const {
      app: configuredApp,
      cleanupCallback: testTeardown,
    } = await integrationTestSetup();
    app = configuredApp;
    cleanupCallback = testTeardown;
  });

  afterEach(async () => {
    // Lazy way to prevent test pollution in these tests. Each test suite
    // utilizes a different database, so we only need to worry about tables
    // affected by this test suite.
    await usingDbClient(async (client) => {
      await client.query('TRUNCATE TABLE users, membership, teams');
    });
  });

  afterAll(async () => {
    await cleanupCallback();
  });

  it('Should create a user', async () => {
    // Act
    const response = await app.request('http://localhost/users', {
      method: 'POST',
      body: JSON.stringify({
        id: 'bacon',
        name: 'Test User',
        password: 'password',
        email: 'test@example.com',
      }),
    });

    // Assert
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.id).toBeDefined();
    expect(body.id).not.toBe('bacon');
    expect(body.password).not.toBeDefined();
    expect(body).toEqual(expect.objectContaining({
      name: 'Test User',
      email: 'test@example.com',
    }));
  });

  it('Should not create a user when user with email exists', async () => {
    // Arrange
    const testUser = {
      id: crypto.randomUUID(),
      name: 'Test User',
      email: 'test@example.com',
    };
    const db = createDrizzleDbConnection();
    await db.insert(users).values({ ...testUser, password: 'password' });

    // Act
    const response = await app.request('http://localhost/users', {
      method: 'POST',
      body: JSON.stringify({
        id: 'bacon',
        name: 'Test User',
        password: 'password',
        email: 'test@example.com',
      }),
    });

    // Assert
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toEqual({
      message: 'User with matching email already exists',
    });
  });

  it('Should get a user', async () => {
    // Arrange
    const testUser = {
      id: crypto.randomUUID(),
      name: 'Test User',
      email: 'test@example.com',
    };
    const db = createDrizzleDbConnection();
    await db.insert(users).values({ ...testUser, password: 'password' });

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
    expect(body.password).not.toBeDefined();
    expect(body).toEqual(expect.objectContaining(testUser));
  });
});
