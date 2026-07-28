import Link from 'next/link';
import { getDashboardPathForRole } from '@/lib/auth/roles';
import type { IUser } from '@/lib/types/auth';
import { UserRole } from '@/lib/types/auth';
import { logoutUser } from '@/lib/actions/auth-action';
import { LogOut, Bell } from 'lucide-react';

interface DashboardHeaderProps {
  user: IUser;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const isAdmin = user.role === UserRole.ADMIN;
  const dashboardPath = getDashboardPathForRole(user.role);

  return (
    <header className="dash-header">
      <div className="dash-header-inner">
        <div className="dash-header-left">
          <span className="dash-header-title">
            {isAdmin ? 'Admin Control Center' : 'Adopter Workspace'}
          </span>
          <span className="dash-header-breadcrumb">
            Dashboard / {isAdmin ? 'Admin' : 'User'}
          </span>
        </div>

        <div className="dash-header-right">
          <button className="dash-header-icon-btn" aria-label="Notifications">
            <Bell className="w-5 h-5" />
            <span className="dash-header-badge" />
          </button>

          <div className="dash-header-user">
            <div className="dash-header-user-avatar">
              {user.profileImage ? (
                <img
                  src={
                    user.profileImage.startsWith('http')
                      ? user.profileImage
                      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088'}${user.profileImage}`
                  }
                  alt={user.fullName}
                  className="dash-header-user-img"
                />
              ) : (
                <span className="dash-header-user-initials">
                  {user.fullName
                    ?.split(' ')
                    .slice(0, 2)
                    .map((p: string) => p[0])
                    .join('')
                    .toUpperCase()}
                </span>
              )}
            </div>
            <div className="dash-header-user-info">
              <span className="dash-header-user-name">{user.fullName}</span>
              <span
                className={
                  isAdmin
                    ? 'dash-header-user-role dash-header-user-role--admin'
                    : 'dash-header-user-role dash-header-user-role--user'
                }
              >
                {user.role}
              </span>
            </div>
          </div>

          <form action={logoutUser} method="POST">
            <button type="submit" className="dash-header-icon-btn dash-header-logout" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
