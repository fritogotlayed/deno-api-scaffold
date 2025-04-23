import { Context } from 'hono';
import { validateResponseAgainstSchema } from '../../../shared/schema-validation/validate-response-against-schema.ts';
import { ErrorResponseSchema } from '../../../shared/schema/error-response.ts';
import { AddressResponseSchema, CreateAddressRequestSchema } from './schema.ts';
import { getDb } from '../../../middlewares/use-drizzle-postgres.ts';
import {
  createAddress,
  getAddressById,
  InvalidAddressError,
} from '../core/addressUseCases.ts';
import { getAddressRepoDrizzle } from '../infrastructure/addressRepoDrizzle.ts';
import { mapAddressToResponseDto } from './mapper.ts';

export const handleAddressCreate = async (c: Context) => {
  const body = await c.req.json();
  const parsed = await CreateAddressRequestSchema.safeParseAsync(body);
  if (!parsed.success) {
    return c.json(
      validateResponseAgainstSchema(ErrorResponseSchema, parsed.error),
      400,
    );
  }

  const db = getDb(c);
  try {
    const createdAddress = await createAddress(getAddressRepoDrizzle(db))(
      parsed.data,
    );

    const addressDto = await mapAddressToResponseDto(createdAddress);
    return c.json(
      validateResponseAgainstSchema(
        AddressResponseSchema,
        addressDto,
      ),
      201,
    );
  } catch (error) {
    if (error instanceof InvalidAddressError) {
      return c.json(
        validateResponseAgainstSchema(ErrorResponseSchema, {
          message: 'Address failed validation',
        }),
        400,
      );
    }
    throw error;
  }
};

export const handleAddressGet = async (c: Context) => {
  const id = c.req.param('addressId');
  const db = getDb(c);
  const address = await getAddressById(getAddressRepoDrizzle(db))(id);
  if (!address) {
    return c.json(
      validateResponseAgainstSchema(ErrorResponseSchema, {
        message: 'Address not found',
      }),
      404,
    );
  }
  const addressDto = await mapAddressToResponseDto(address);
  return c.json(
    validateResponseAgainstSchema(
      AddressResponseSchema,
      addressDto,
    ),
    200,
  );
};
