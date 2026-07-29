import type { IApiResponse } from '@/lib/types/api';

describe('IApiResponse', () => {
  it('should accept a success response with data', () => {
    const res: IApiResponse<{ id: string }> = {
      success: true,
      message: 'OK',
      data: { id: '123' },
    };
    expect(res.success).toBe(true);
    expect(res.data).toEqual({ id: '123' });
  });

  it('should accept an error response with null data', () => {
    const res: IApiResponse = {
      success: false,
      message: 'Not found',
      data: null,
    };
    expect(res.success).toBe(false);
    expect(res.data).toBeNull();
  });

  it('should accept meta field for paginated responses', () => {
    const res: IApiResponse<string[]> = {
      success: true,
      message: 'List retrieved',
      data: ['a', 'b'],
      meta: { total: 42, page: 1, limit: 10, totalPages: 5 },
    };
    expect(res.meta?.total).toBe(42);
    expect(res.meta?.totalPages).toBe(5);
  });

  it('should accept unreadCount in meta', () => {
    const res: IApiResponse<number> = {
      success: true,
      message: 'Count',
      data: 5,
      meta: { unreadCount: 3 },
    };
    expect(res.meta?.unreadCount).toBe(3);
  });
});
