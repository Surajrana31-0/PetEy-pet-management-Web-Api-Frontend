import { API_BASE_URL, ENDPOINTS } from '@/lib/api/endpoints';

describe('API endpoints', () => {
  describe('API_BASE_URL', () => {
    it('should fall back to localhost when env var is not set', () => {
      delete process.env.NEXT_PUBLIC_API_BASE_URL;
      expect(API_BASE_URL).toBe('http://localhost:8088/api/v1');
    });
  });

  describe('AUTH endpoints', () => {
    it('should expose all auth routes', () => {
      expect(ENDPOINTS.AUTH.REGISTER).toBe('/auth/register');
      expect(ENDPOINTS.AUTH.LOGIN).toBe('/auth/login');
      expect(ENDPOINTS.AUTH.LOGOUT).toBe('/auth/logout');
      expect(ENDPOINTS.AUTH.ME).toBe('/auth/me');
      expect(ENDPOINTS.AUTH.UPDATE).toBe('/auth/update');
      expect(ENDPOINTS.AUTH.PASSWORD).toBe('/auth/password');
      expect(ENDPOINTS.AUTH.REFRESH_TOKEN).toBe('/auth/refresh-token');
      expect(ENDPOINTS.AUTH.FORGOT_PASSWORD).toBe('/auth/forgot-password');
      expect(ENDPOINTS.AUTH.RESET_PASSWORD).toBe('/auth/reset-password');
      expect(ENDPOINTS.AUTH.VERIFY_EMAIL).toBe('/auth/verify-email');
    });
  });

  describe('PETS endpoints', () => {
    it('should expose base and search routes', () => {
      expect(ENDPOINTS.PETS.BASE).toBe('/pets');
      expect(ENDPOINTS.PETS.SEARCH).toBe('/pets/search');
      expect(ENDPOINTS.PETS.CATEGORIES).toBe('/pets/categories');
    });

    it('should build dynamic routes with the given id', () => {
      expect(ENDPOINTS.PETS.BY_ID('123')).toBe('/pets/123');
      expect(ENDPOINTS.PETS.BY_STATUS('available')).toBe('/pets/status/available');
      expect(ENDPOINTS.PETS.BY_SPECIES('DOG')).toBe('/pets/species/DOG');
    });

    it('should URL-encode breed names', () => {
      expect(ENDPOINTS.PETS.BY_BREED('Golden Retriever')).toBe(
        '/pets/breed/Golden%20Retriever'
      );
    });
  });

  describe('ADOPTIONS endpoints', () => {
    it('should expose create and my routes', () => {
      expect(ENDPOINTS.ADOPTIONS.CREATE).toBe('/adoptions');
      expect(ENDPOINTS.ADOPTIONS.MY).toBe('/adoptions/my');
      expect(ENDPOINTS.ADOPTIONS.STATISTICS).toBe('/adoptions/statistics');
      expect(ENDPOINTS.ADOPTIONS.PENDING).toBe('/adoptions/pending');
    });

    it('should build dynamic routes with the given id', () => {
      expect(ENDPOINTS.ADOPTIONS.GET_ONE('abc')).toBe('/adoptions/abc');
      expect(ENDPOINTS.ADOPTIONS.CANCEL('abc')).toBe('/adoptions/abc/cancel');
      expect(ENDPOINTS.ADOPTIONS.APPROVE('abc')).toBe('/adoptions/abc/approve');
      expect(ENDPOINTS.ADOPTIONS.REJECT('abc')).toBe('/adoptions/abc/reject');
      expect(ENDPOINTS.ADOPTIONS.COMPLETE('abc')).toBe('/adoptions/abc/complete');
    });

    it('should build routes by user and pet', () => {
      expect(ENDPOINTS.ADOPTIONS.BY_USER('u1')).toBe('/adoptions/user/u1');
      expect(ENDPOINTS.ADOPTIONS.BY_PET('p1')).toBe('/adoptions/pet/p1');
    });
  });

  describe('AI endpoints', () => {
    it('should expose AI routes', () => {
      expect(ENDPOINTS.AI.GENERATE_DESCRIPTION).toBe('/ai/generate-description');
      expect(ENDPOINTS.AI.MATCH).toBe('/ai/match');
      expect(ENDPOINTS.AI.CHAT).toBe('/ai/chat');
      expect(ENDPOINTS.AI.RECOMMENDATIONS).toBe('/ai/recommendations');
      expect(ENDPOINTS.AI.SESSIONS).toBe('/ai/sessions');
    });

    it('should build session-by-id route', () => {
      expect(ENDPOINTS.AI.SESSION_BY_ID('s1')).toBe('/ai/sessions/s1');
    });
  });

  describe('ADMIN endpoints', () => {
    it('should expose dashboard routes', () => {
      expect(ENDPOINTS.ADMIN.DASHBOARD.FULL).toBe('/admin/dashboard');
      expect(ENDPOINTS.ADMIN.DASHBOARD.OVERVIEW).toBe('/admin/dashboard/overview');
    });

    it('should build admin user routes', () => {
      expect(ENDPOINTS.ADMIN.USERS.GET_ONE('u1')).toBe('/admin/users/u1');
      expect(ENDPOINTS.ADMIN.USERS.UPDATE('u1')).toBe('/admin/users/u1');
      expect(ENDPOINTS.ADMIN.USERS.DELETE('u1')).toBe('/admin/users/u1');
      expect(ENDPOINTS.ADMIN.USERS.UPDATE_ROLE('u1')).toBe('/admin/users/u1/role');
    });

    it('should build admin adoption routes', () => {
      expect(ENDPOINTS.ADMIN.ADOPTIONS.BY_STATUS('pending')).toBe(
        '/admin/adoptions/status/pending'
      );
      expect(ENDPOINTS.ADMIN.ADOPTIONS.BULK_APPROVE).toBe('/admin/adoptions/bulk-approve');
    });

    it('should build admin pet routes', () => {
      expect(ENDPOINTS.ADMIN.PETS.CREATE).toBe('/admin/pets');
      expect(ENDPOINTS.ADMIN.PETS.UPDATE('p1')).toBe('/admin/pets/p1');
      expect(ENDPOINTS.ADMIN.PETS.DELETE('p1')).toBe('/admin/pets/p1');
      expect(ENDPOINTS.ADMIN.PETS.UPDATE_STATUS('p1')).toBe('/admin/pets/p1/status');
    });
  });

  describe('NOTIFICATIONS endpoints', () => {
    it('should expose notification routes', () => {
      expect(ENDPOINTS.NOTIFICATIONS.BASE).toBe('/notifications');
      expect(ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT).toBe('/notifications/unread-count');
      expect(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ).toBe('/notifications/mark-all-read');
    });

    it('should build dynamic notification routes', () => {
      expect(ENDPOINTS.NOTIFICATIONS.MARK_READ('n1')).toBe('/notifications/n1/read');
      expect(ENDPOINTS.NOTIFICATIONS.BY_ID('n1')).toBe('/notifications/n1');
    });
  });
});
