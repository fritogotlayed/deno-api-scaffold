import { afterAll, afterEach, beforeAll, describe, it } from '@std/testing/bdd';
import { expect } from '@std/expect';
import { OpenAPIHono } from '@hono/zod-openapi';
import { integrationTestSetup } from '../../shared/test-utilities/index.ts';
import { createDrizzleDbConnection, usingDbClient } from '../../config/db.ts';
import { address } from '../../db/schema.ts';

describe('address', () => {
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
      await client.query('TRUNCATE TABLE address, teams, membership, users');
    });
  });

  afterAll(async () => {
    await cleanupCallback();
  });

  it('Should create an address', async () => {
    // Act
    const response = await app.request('http://localhost/addresses', {
      method: 'POST',
      body: JSON.stringify({
        street1: '123 main street',
        street2: 'apt 4b',
        city: 'new york',
        state: 'ny',
        zip: '10001',
      }),
    });

    // Assert
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.id).toBeDefined();
    expect(body.hash).not.toBeDefined();
    expect(body).toEqual(expect.objectContaining({
      street1: '123 Main St',
      street2: 'Apt 4b',
      city: 'New York',
      state: 'NY',
      zip: '10001',
    }));
  });

  it('Should not create an address with invalid data', async () => {
    // Act
    const response = await app.request('http://localhost/addresses', {
      method: 'POST',
      body: JSON.stringify({
        street1: '',
        city: 'new york',
        state: 'ny',
        zip: '10001',
      }),
    });

    // Assert
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toEqual({
      issues: [
        {
          code: 'too_small',
          exact: false,
          inclusive: true,
          message: 'String must contain at least 1 character(s)',
          minimum: 1,
          path: [
            'street1',
          ],
          type: 'string',
        },
      ],
      name: 'ZodError',
    });
  });

  it('Should get an address by ID', async () => {
    // Arrange
    const testAddress = {
      street1: '456 Park Ave',
      street2: 'Suite 789',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
    };

    // Create the address first
    const db = createDrizzleDbConnection();
    const result = await db.insert(address).values({
      ...testAddress,
      hash: 'trash-hash',
    }).returning({
      id: address.id,
    });
    const addressId = result[0].id;

    // Act
    const response = await app.request(
      `http://localhost/addresses/${addressId}`,
      {
        method: 'GET',
      },
    );

    // Assert
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(addressId);
    expect(body).toEqual(expect.objectContaining({
      id: addressId,
      street1: '456 Park Ave',
      street2: 'Suite 789',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
    }));
  });

  it('Should return 404 when getting a non-existent address', async () => {
    // Act
    const response = await app.request(
      `http://localhost/addresses/${crypto.randomUUID()}`,
      {
        method: 'GET',
      },
    );

    // Assert
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body).toEqual({
      message: 'Address not found',
    });
  });

  it('Should standardize address format when creating', async () => {
    // Act
    const response = await app.request('http://localhost/addresses', {
      method: 'POST',
      body: JSON.stringify({
        street1: '789 maple boulevard',
        street2: 'building c',
        city: 'san francisco',
        state: 'california',
        zip: '94107',
      }),
    });

    // Assert
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body).toEqual(expect.objectContaining({
      street1: '789 Maple Blvd',
      street2: 'Building C',
      city: 'San Francisco',
      state: 'California',
      zip: '94107',
    }));
  });
});
