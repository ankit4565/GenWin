import { Link, useLocation } from 'react-router-dom'
import { Bell, Globe, Search,CircleUserRound } from 'lucide-react'

const isLoggedIn =
	localStorage.getItem('genwin_access_token') ||
	sessionStorage.getItem('genwin_access_token')



export default function NavBar() {
	const location = useLocation()
	const isActive = (path) => location.pathname === path

	return (
		<header className="sticky top-0 z-50 w-full border-b border-[#c0c9bb]/35 bg-white/75 text-[#00450d] shadow-[0_8px_24px_rgba(19,44,64,0.06)] backdrop-blur-xl">
			<div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 md:px-16">
				<div className="flex items-center gap-3 font-bold text-[28px] leading-10 font-[Hanken Grotesk]">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00450d] text-[16px] text-white shadow-sm">
						B
					</div>
					<div className="hidden sm:block whitespace-nowrap text-[#00450d]">GenWin</div>
				</div>

				<nav className="hidden items-center gap-6 md:flex">
					<Link
						to="/"
						className={`py-1 text-[12px] font-semibold uppercase tracking-[0.05em] transition-colors hover:text-[#00450d] ${isActive('/') ? 'border-b-2 border-[#00450d] text-[#00450d]' : 'text-[#41493e]'}`}
					>
						Home
					</Link>
					<Link
						to="/map"
						className={`py-1 text-[12px] font-semibold uppercase tracking-[0.05em] transition-colors hover:text-[#00450d] ${isActive('/map') ? 'border-b-2 border-[#00450d] text-[#00450d]' : 'text-[#41493e]'}`}
					>
						Map
					</Link>
					<Link
						to="/traffic"
						className={`py-1 text-[12px] font-semibold uppercase tracking-[0.05em] transition-colors hover:text-[#00450d] ${isActive('/traffic') ? 'border-b-2 border-[#00450d] text-[#00450d]' : 'text-[#41493e]'}`}
					>
						Traffic
					</Link>
					<Link
						to="/alerts"
						className={`py-1 text-[12px] font-semibold uppercase tracking-[0.05em] transition-colors hover:text-[#00450d] ${isActive('/alerts') ? 'border-b-2 border-[#00450d] text-[#00450d]' : 'text-[#41493e]'}`}
					>
						Alerts
					</Link>
					<Link
						to="/drainage"
						className={`py-1 text-[12px] font-semibold uppercase tracking-[0.05em] transition-colors hover:text-[#00450d] ${isActive('/drainage') ? 'border-b-2 border-[#00450d] text-[#00450d]' : 'text-[#41493e]'}`}
					>
						Drainage
					</Link>
				</nav>

				<div className="flex items-center gap-4">
					{/* Search moved here to sit next to the globe button */}
						<div className="hidden lg:flex items-center gap-3 bg-[#dbf1fe]/90 border border-[#707a6d]/20 rounded-full px-3 py-1">
							<Search size={16} className="text-[#717a6d]" />
						<input
							placeholder="Search data points..."
							className="bg-transparent border-none outline-none text-[13px] text-[#071e27] w-56"
						/>
					</div>
					<button type="button" aria-label="Language" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#c0c9bb]/50 bg-white/70 text-[#41493e] transition-colors hover:bg-[#f3faff]">
						<Globe size={16} />
					</button>
					<button type="button" aria-label="Notifications" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#c0c9bb]/50 bg-white/70 text-[#41493e] transition-colors hover:bg-[#f3faff]">
						<Bell size={16} />
					</button>

					{isLoggedIn ? (
	<>
		{/* <Link
  to="/profile"
  className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#00450d] hover:scale-105 transition-all"
>
  <img
   // src={user?.profileImage || "/default-avatar.png"}
   src="luicide-profile-placeholder.png"
    alt="Profile"
    className="w-full h-full object-cover"
  />
</Link> */}
<Link
  to="/profile"
  className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#00450d] hover:bg-[#00450d]/10 transition-all"
>
  <CircleUserRound size={24} className="text-[#00450d]" />
</Link>

		<button
			onClick={() => {
				localStorage.removeItem('genwin_access_token')
				localStorage.removeItem('genwin_refresh_token')
				sessionStorage.removeItem('genwin_access_token')
				sessionStorage.removeItem('genwin_refresh_token')
				window.location.href = '/login'
			}}
			className="rounded-full bg-red-600 px-5 py-2 text-[12px] font-semibold uppercase text-white"
		>
			Logout
		</button>
	</>
) : (
	<Link
		to="/login"
		className="rounded-full bg-[#00450d] px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-white transition-transform hover:scale-95"
	>
		Login
	</Link>
)}
				</div>
			</div>
		</header>
	)
}
