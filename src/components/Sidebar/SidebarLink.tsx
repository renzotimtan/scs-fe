interface SidebarLinkProps {
  Icon: any;
  label: string;
}

const SidebarLink = ({ Icon, label }: SidebarLinkProps): JSX.Element => {
  return (
    <div className="flex items-center ml-7">
      <Icon className="text-sidebar-light" />
      <p className="ml-2 text-sm text-sidebar-light hover:text-sidebar-white my-2 cursor-pointer">
        {label}
      </p>
    </div>
  );
};

export default SidebarLink;
