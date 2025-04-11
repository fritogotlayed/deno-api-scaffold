import { afterAll, beforeAll, describe, it } from '@std/testing/bdd';
import { expect } from '@std/expect';
import { integrationTestSetup } from '../../utilities/index.ts';
import { Hono } from 'hono';
import { createDrizzleDbConnection } from '../../../../src/config/db.ts';
import { teams } from '../../../../src/db/schema.ts';

describe('team', () => {
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

  it('Should create a team', async () => {
    // Act
    const response = await app.request('http://localhost/teams', {
      method: 'POST',
      body: JSON.stringify({
        id: 'bacon',
        name: 'Test Team',
      }),
    });

    // Assert
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.id).toBeDefined();
    expect(body.id).not.toBe('bacon');
    expect(body).toEqual(expect.objectContaining({
      name: 'Test Team',
    }));
  });

  it('Should get a team', async () => {
    // Arrange
    const testUser = {
      id: crypto.randomUUID(),
      name: 'Test Team',
    };
    const db = createDrizzleDbConnection();
    await db.insert(teams).values(testUser);

    // Act
    const response = await app.request(
      `http://localhost/teams/${testUser.id}`,
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
