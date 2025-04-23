import { Address } from './addressTypes.ts';
import { AddressRepository } from './addressRepo.ts';

export class InvalidAddressError extends Error {
  constructor(address: string) {
    super(`Address ${address} is invalid`);
    this.name = 'InvalidAddressError';
    Object.setPrototypeOf(this, InvalidAddressError.prototype);
  }
}

export const standardizeAddress = (
  address: Omit<Address, 'id' | 'hash'>,
): Omit<Address, 'id' | 'hash'> => {
  // Capitalize the first letter of each word in each part of the address
  // also replace any common suffix words with their common abbreviation

  // Common street suffix abbreviations
  const suffixMap: Record<string, string> = {
    'avenue': 'Ave',
    'boulevard': 'Blvd',
    'circle': 'Cir',
    'court': 'Ct',
    'drive': 'Dr',
    'highway': 'Hwy',
    'lane': 'Ln',
    'parkway': 'Pkwy',
    'place': 'Pl',
    'road': 'Rd',
    'square': 'Sq',
    'street': 'St',
    'terrace': 'Ter',
    'way': 'Way',
  };

  // Helper function to capitalize first letter of each word
  const capitalizeWords = (text: string): string => {
    return text.trim().replace(/\b\w+/g, (word) => {
      const lowerWord = word.toLowerCase();
      // Check if the word is a suffix that should be abbreviated
      if (suffixMap[lowerWord]) {
        return suffixMap[lowerWord];
      }
      // Otherwise capitalize the first letter
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  };

  const standardizeState = (state: string): string => {
    state = state.trim();
    // If it's already a 2-letter abbreviation, make it uppercase
    if (state.length === 2) {
      return state.toUpperCase();
    }
    // Otherwise capitalize it
    return capitalizeWords(state);
  };

  // Standardize ZIP code format
  const standardizeZip = (zip: string): string => {
    return zip.trim();
  };

  return {
    ...address,
    street1: capitalizeWords(address.street1),
    street2: address.street2
      ? capitalizeWords(address.street2)
      : address.street2,
    city: capitalizeWords(address.city),
    state: standardizeState(address.state),
    zip: standardizeZip(address.zip),
  };
};

export const getAddressHash = async (
  address: Omit<Address, 'id' | 'hash'>,
): Promise<string> => {
  const { street1, street2, city, state, zip } = address;
  const token = `${street1} ${street2 || ''} ${city} ${state} ${zip}`.trim();

  const encoder = new TextEncoder();
  const data = encoder.encode(token);

  const hashBuffer = await crypto.subtle.digest('SHA-512', data);

  // Convert the hash buffer to a base64 string
  // First, create a binary string from the buffer
  const hashArray = new Uint8Array(hashBuffer);
  const binaryString = Array.from(hashArray)
    .map((byte) => String.fromCharCode(byte))
    .join('');

  // Then encode as base64
  return btoa(binaryString);
};

export const getAddressById =
  (repo: AddressRepository) => async (id: string) => {
    return await repo.findById(id);
  };

export const getAddressByHash =
  (repo: AddressRepository) => async (hash: string) => {
    return await repo.findByHash(hash);
  };

export const createAddress =
  (repo: AddressRepository) =>
  async (address: Omit<Address, 'id' | 'hash'>): Promise<Address> => {
    const standardizedAddress = standardizeAddress(address);

    // Ensure that the standardized address is valid
    if (
      !standardizedAddress.street1 || !standardizedAddress.city ||
      !standardizedAddress.state || !standardizedAddress.zip
    ) {
      return Promise.reject(
        new InvalidAddressError(JSON.stringify(standardizedAddress)),
      );
      // throw new InvalidAddressError(JSON.stringify(standardizedAddress));
    }

    const hash = await getAddressHash(standardizedAddress);

    return repo.create({
      ...standardizedAddress,
      hash,
    });
  };
