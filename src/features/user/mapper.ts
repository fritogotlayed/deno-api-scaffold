import { User } from '../../core/user/userTypes.ts';

// Define the shape of your DTO
export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
}

/**
 * Maps a User domain entity to a UserResponseDto
 */
export function mapUserToResponseDto(user: User): UserResponseDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    // Password is intentionally omitted for security
  };
}
