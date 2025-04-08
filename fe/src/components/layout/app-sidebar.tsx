// path: fe/src/components/layout/app-sidebar.tsx
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { TeamSwitcher } from '@/components/layout/team-switcher'
import { filterSidebarData } from './sidebar/sidebar-data'
import { useRolePermissions } from '@/hooks/use-role-permissions'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const permissions = useRolePermissions()
  
  // Get filtered sidebar data based on user permissions
  const filteredSidebarData = filterSidebarData(permissions)
  
  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={filteredSidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {filteredSidebarData.navGroups.map((navGroup) => (
          <NavGroup key={navGroup.title} {...navGroup} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
