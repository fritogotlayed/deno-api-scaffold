import { describe, it } from '@std/testing/bdd';
import { expect } from '@std/expect';

import { getAddressHash, standardizeAddress } from './addressUseCases.ts';
import { Address } from './addressTypes.ts';

describe('addressUseCases', () => {
  describe('standardizeAddress', () => {
    it('should capitalize first letter of each word in address parts', () => {
      const address: Omit<Address, 'id' | 'hash'> = {
        street1: '123 main street',
        street2: 'apartment 4b',
        city: 'new york',
        state: 'ny',
        zip: '10001',
      };
      const result = standardizeAddress(address);
      expect(result).toEqual({
        street1: '123 Main St',
        street2: 'Apartment 4b',
        city: 'New York',
        state: 'NY',
        zip: '10001',
      });
    });

    it('should handle empty street2', () => {
      const address: Omit<Address, 'id' | 'hash'> = {
        street1: '123 main street',
        street2: '',
        city: 'new york',
        state: 'ny',
        zip: '10001',
      };

      const result = standardizeAddress(address);

      expect(result.street2).toEqual('');
    });

    it('should handle null street2', () => {
      const address: Omit<Address, 'id' | 'hash'> = {
        street1: '123 main street',
        street2: null,
        city: 'new york',
        state: 'ny',
        zip: '10001',
      };

      const result = standardizeAddress(address);

      expect(result.street2).toEqual(null);
    });

    it('should abbreviate common street suffixes', () => {
      const address: Omit<Address, 'id' | 'hash'> = {
        street1: '123 maple avenue',
        street2: 'building 3 boulevard',
        city: 'new york',
        state: 'ny',
        zip: '10001',
      };

      const result = standardizeAddress(address);

      expect(result).toEqual({
        street1: '123 Maple Ave',
        street2: 'Building 3 Blvd',
        city: 'New York',
        state: 'NY',
        zip: '10001',
      });
    });

    it("should standardize state to uppercase if it's a 2-letter code", () => {
      const address: Omit<Address, 'id' | 'hash'> = {
        street1: '123 main street',
        street2: null,
        city: 'new york',
        state: 'ny',
        zip: '10001',
      };

      const result = standardizeAddress(address);

      expect(result.state).toEqual('NY');
    });

    it("should capitalize state if it's not a 2-letter code", () => {
      const address: Omit<Address, 'id' | 'hash'> = {
        street1: '123 main street',
        street2: null,
        city: 'new york',
        state: 'new york',
        zip: '10001',
      };

      const result = standardizeAddress(address);

      expect(result.state).toEqual('New York');
    });
  });

  describe('getAddressHash', () => {
    it('should generate a consistent hash for the same address', async () => {
      const address: Omit<Address, 'id' | 'hash'> = {
        street1: '123 Main St',
        street2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        zip: '10001',
      };

      const hash1 = await getAddressHash(address);
      const hash2 = await getAddressHash(address);

      expect(hash1).toEqual(hash2);
    });

    it('should generate different hashes for different addresses', async () => {
      const address1: Omit<Address, 'id' | 'hash'> = {
        street1: '123 Main St',
        street2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        zip: '10001',
      };

      const address2: Omit<Address, 'id' | 'hash'> = {
        street1: '456 Oak Ave',
        street2: null,
        city: 'Chicago',
        state: 'IL',
        zip: '60601',
      };

      const hash1 = await getAddressHash(address1);
      const hash2 = await getAddressHash(address2);

      expect(hash1).not.toEqual(hash2);
    });

    it('should handle null or empty street2 correctly', async () => {
      const addressWithEmptyStreet2: Omit<Address, 'id' | 'hash'> = {
        street1: '123 Main St',
        street2: '',
        city: 'New York',
        state: 'NY',
        zip: '10001',
      };

      const addressWithNullStreet2: Omit<Address, 'id' | 'hash'> = {
        street1: '123 Main St',
        street2: null,
        city: 'New York',
        state: 'NY',
        zip: '10001',
      };

      const hash1 = await getAddressHash(addressWithEmptyStreet2);
      const hash2 = await getAddressHash(addressWithNullStreet2);

      // Both should be treated the same way
      expect(hash1).toEqual(hash2);
    });

    it('should be case-sensitive', async () => {
      const address1: Omit<Address, 'id' | 'hash'> = {
        street1: '123 Main St',
        street2: null,
        city: 'New York',
        state: 'NY',
        zip: '10001',
      };

      const address2: Omit<Address, 'id' | 'hash'> = {
        street1: '123 main st',
        street2: null,
        city: 'New York',
        state: 'NY',
        zip: '10001',
      };

      const hash1 = await getAddressHash(address1);
      const hash2 = await getAddressHash(address2);

      expect(hash1).not.toEqual(hash2);
    });
  });
});
