/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { DashboardNavbar } from '@/components/dashboard/dashboard-navbar';
import { UserRole } from '@/lib/types';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) =>
    React.createElement('a', { href, ...props }, children),
}));

jest.mock('@/lib/actions/auth-action', () => ({
  logoutAction: jest.fn(),
}));

describe('DashboardNavbar', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard/user');
  });

  it('should render the PetEy brand logo', () => {
    render(<DashboardNavbar role={UserRole.USER} userName="John" />);
    expect(screen.getAllByText('PetEy').length).toBeGreaterThan(0);
  });

  it('should render the user name in the sidebar footer', () => {
    render(<DashboardNavbar role={UserRole.USER} userName="Jane Doe" />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('should render Member label for USER role', () => {
    render(<DashboardNavbar role={UserRole.USER} userName="John" />);
    expect(screen.getByText('Member')).toBeInTheDocument();
  });

  it('should render Administrator label for ADMIN role', () => {
    render(<DashboardNavbar role={UserRole.ADMIN} userName="Admin" />);
    expect(screen.getByText('Administrator')).toBeInTheDocument();
  });

  it('should render the user avatar with first letter when no profile image', () => {
    render(<DashboardNavbar role={UserRole.USER} userName="Charlie" />);
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('should render Overview nav item for USER role', () => {
    render(<DashboardNavbar role={UserRole.USER} userName="John" />);
    expect(screen.getByText('Overview')).toBeInTheDocument();
  });

  it('should render Dashboard nav item for ADMIN role', () => {
    render(<DashboardNavbar role={UserRole.ADMIN} userName="Admin" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should render Browse Pets for USER but not ADMIN', () => {
    const { rerender } = render(<DashboardNavbar role={UserRole.USER} userName="U" />);
    expect(screen.getByText('Browse Pets')).toBeInTheDocument();
    rerender(<DashboardNavbar role={UserRole.ADMIN} userName="A" />);
    expect(screen.queryByText('Browse Pets')).not.toBeInTheDocument();
  });

  it('should render Pet Management for ADMIN but not USER', () => {
    const { rerender } = render(<DashboardNavbar role={UserRole.ADMIN} userName="A" />);
    expect(screen.getByText('Pet Management')).toBeInTheDocument();
    rerender(<DashboardNavbar role={UserRole.USER} userName="U" />);
    expect(screen.queryByText('Pet Management')).not.toBeInTheDocument();
  });

  it('should render a sign out button', () => {
    render(<DashboardNavbar role={UserRole.USER} userName="John" />);
    expect(screen.getByText('🚪 Sign out')).toBeInTheDocument();
  });
});
