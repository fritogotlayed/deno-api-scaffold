import { Context } from 'hono';
import { createUser, getUser, UserExistsError } from '../core/userUseCases.ts';
import { getUserRepoDrizzle } from '../infrastructure/userRepoDrizzle.ts';
import { getDb } from '../../../middlewares/use-drizzle-postgres.ts';
import { mapUserToResponseDto } from './mapper.ts';
import { CreateUserRequestSchema, UserResponseSchema } from './schema.ts';
import { validateResponseAgainstSchema } from '../../../shared/schema-validation/validate-response-against-schema.ts';
import { ErrorResponseSchema } from '../../../shared/schema/error-response.ts';

export const handleCreateUser = async (c: Context) => {
  const body = await c.req.json();
  const parsed = await CreateUserRequestSchema.safeParseAsync(body);
  if (!parsed.success) {
    return c.json(
      validateResponseAgainstSchema(ErrorResponseSchema, parsed.error),
      400,
    );
  }
  const db = getDb(c);
  try {
    const createdUser = await createUser(getUserRepoDrizzle(db))(parsed.data);
    const userDto = await mapUserToResponseDto({ user: createdUser });
    return c.json(
      validateResponseAgainstSchema(UserResponseSchema, userDto),
      201,
    );
  } catch (error) {
    if (error instanceof UserExistsError) {
      return c.json(
        validateResponseAgainstSchema(ErrorResponseSchema, {
          message: 'User with matching email already exists',
        }),
        400,
      );
    }
    throw error;
  }
};

export const handleGetUser = async (c: Context) => {
  const id = c.req.param('userId');
  const db = getDb(c);
  const user = await getUser(getUserRepoDrizzle(db))(id);
  if (!user) {
    return c.json(
      validateResponseAgainstSchema(
        ErrorResponseSchema,
        { message: 'User not found' },
      ),
      404,
    );
  }

  const userDto = await mapUserToResponseDto({ user: user });
  return c.json(
    validateResponseAgainstSchema(UserResponseSchema, userDto),
    200,
  );
};
