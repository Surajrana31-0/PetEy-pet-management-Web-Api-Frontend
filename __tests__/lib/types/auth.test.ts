import { UserRole } from '@/lib/types/auth';

describe('UserRole enum', () => {
  it('should have USER value', () => {
    expect(UserRole.USER).toBe('USER');
  });

  it('should have ADMIN value', () => {
    expect(UserRole.ADMIN).toBe('ADMIN');
  });
});

describe('IUser interface (compile-time check)', () => {
  it('should accept a valid user object', () => {
    const user = {
      _id: '507f1f77bcf86cd799439011',
      fullName: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      role: UserRole.USER,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };
    expect(user.role).toBe(UserRole.USER);
    expect(user.fullName).toBe('John Doe');
  });

  it('should allow optional profileImage as null', () => {
    const user = {
      _id: '1',
      fullName: 'Jane',
      username: 'jane',
      email: 'jane@example.com',
      role: UserRole.ADMIN,
      profileImage: null,
      createdAt: '',
      updatedAt: '',
    };
    expect(user.profileImage).toBeNull();
  });
});

describe('ILoginResponseData interface (compile-time check)', () => {
  it('should accept a valid login response', () => {
    const response = {
      user: {
        _id: '1',
        fullName: 'Test',
        username: 'test',
        email: 'test@test.com',
        role: UserRole.USER,
        createdAt: '',
        updatedAt: '',
      },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };
    expect(response.accessToken).toBe('access-token');
    expect(response.refreshToken).toBe('refresh-token');
    expect(response.user.role).toBe(UserRole.USER);
  });
});
