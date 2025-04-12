import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  it,
} from '@std/testing/bdd';
import { expect } from '@std/expect';
import { integrationTestSetup } from '../../utilities/index.ts';
import { Hono } from 'hono';
import {
  createDrizzleDbConnection,
  usingDbClient,
} from '../../../../src/config/db.ts';
import { teams, users } from '../../../../src/db/schema.ts';

describe('membership', () => {
  let app: Hono;
  let cleanupCallback: () => Promise<void>;
  let testUser: { id: string; name: string; email: string };
  let testTeam: { id: string; name: string };

  beforeAll(async () => {
    const {
      app: configuredApp,
      cleanupCallback: testTeardown,
    } = await integrationTestSetup();
    app = configuredApp;
    cleanupCallback = testTeardown;
  });

  beforeEach(async () => {
    // Create a test user and team for each test
    testUser = {
      id: crypto.randomUUID(),
      name: 'Test User',
      email: 'test@example.com',
    };

    testTeam = {
      id: crypto.randomUUID(),
      name: 'Test Team',
    };

    const db = createDrizzleDbConnection();
    await db.insert(users).values({ ...testUser, password: 'password' });
    await db.insert(teams).values(testTeam);
  });

  afterEach(async () => {
    // Clean up tables after each test to prevent test pollution
    await usingDbClient(async (client) => {
      await client.query('TRUNCATE TABLE membership, teams, users');
    });
  });

  afterAll(async () => {
    await cleanupCallback();
  });

  it('Should create a membership via users/:userId/teams/:teamId endpoint', async () => {
    // Act
    const response = await app.request(
      `http://localhost/users/${testUser.id}/teams/${testTeam.id}`,
      {
        method: 'POST',
        body: JSON.stringify({}), // Empty body as per schema
      },
    );

    // Assert
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body).toEqual(expect.objectContaining({
      userId: testUser.id,
      teamId: testTeam.id,
    }));
  });

  it('Should create a membership via teams/:teamId/users/:userId endpoint', async () => {
    // Act
    const response = await app.request(
      `http://localhost/teams/${testTeam.id}/users/${testUser.id}`,
      {
        method: 'POST',
        body: JSON.stringify({}), // Empty body as per schema
      },
    );

    // Assert
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body).toEqual(expect.objectContaining({
      userId: testUser.id,
      teamId: testTeam.id,
    }));
  });

  it('Should not create a membership when it already exists', async () => {
    // Arrange - First create the membership
    await app.request(
      `http://localhost/users/${testUser.id}/teams/${testTeam.id}`,
      {
        method: 'POST',
        body: JSON.stringify({}),
      },
    );

    // Act - Try to create it again
    const response = await app.request(
      `http://localhost/users/${testUser.id}/teams/${testTeam.id}`,
      {
        method: 'POST',
        body: JSON.stringify({}),
      },
    );

    // Assert
    expect(response.status).toBe(400);
    const body = await response.text();
    expect(body).toEqual('User with matching email already exists'); // Note: This message should be updated in the controller
  });

  it('Should get a membership via users/:userId/teams/:teamId endpoint', async () => {
    // Arrange - Create the membership first
    await app.request(
      `http://localhost/users/${testUser.id}/teams/${testTeam.id}`,
      {
        method: 'POST',
        body: JSON.stringify({}),
      },
    );

    // Act
    const response = await app.request(
      `http://localhost/users/${testUser.id}/teams/${testTeam.id}`,
      {
        method: 'GET',
      },
    );

    // Assert
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(expect.objectContaining({
      userId: testUser.id,
      teamId: testTeam.id,
    }));
  });

  it('Should get a membership via teams/:teamId/users/:userId endpoint', async () => {
    // Arrange - Create the membership first
    await app.request(
      `http://localhost/teams/${testTeam.id}/users/${testUser.id}`,
      {
        method: 'POST',
        body: JSON.stringify({}),
      },
    );

    // Act
    const response = await app.request(
      `http://localhost/teams/${testTeam.id}/users/${testUser.id}`,
      {
        method: 'GET',
      },
    );

    // Assert
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(expect.objectContaining({
      userId: testUser.id,
      teamId: testTeam.id,
    }));
  });

  it('Should return 404 when getting a non-existent membership', async () => {
    // Act
    const response = await app.request(
      `http://localhost/users/${testUser.id}/teams/${testTeam.id}`,
      {
        method: 'GET',
      },
    );

    // Assert
    expect(response.status).toBe(404);
    const body = await response.text();
    expect(body).toEqual('Membership not found');
  });
});
