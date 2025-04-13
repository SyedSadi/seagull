import { useContext, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faBars } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { user, logoutUser } = useContext(AuthContext);
	const [scrolled, setScrolled] = useState(false);
	const location = useLocation();
	const insLandingPage = location.pathname === "/";

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	useEffect(() => {
		const handleScroll = () => {
			const offset = window.scrollY;
			setScrolled(offset > 50);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [insLandingPage]);

	const navOptions = (
		<ul className="flex flex-col lg:flex-row lg:space-x-20 space-y-4 lg:space-y-0 text-center text-m">
			<li>
				<NavLink
					to={"/courses"}
					className="text-white hover:text-blue-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-300 after:left-1/2 after:bottom-[-4px] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
					onClick={() => setIsMenuOpen(false)}
				>
					Courses
				</NavLink>
			</li>
			<li>
				<NavLink
					to={"/quiz"}
					className="text-white hover:text-blue-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-300 after:left-1/2 after:bottom-[-4px] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
					onClick={() => setIsMenuOpen(false)}
				>
					Quiz
				</NavLink>
			</li>
			<li>
				<NavLink
					to={"/forum"}
					className="text-white hover:text-blue-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-300 after:left-1/2 after:bottom-[-4px] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
					onClick={() => setIsMenuOpen(false)}
				>
					Forum
				</NavLink>
			</li>
			<li>
				<NavLink
					to={"/aboutus"}
					className="text-white hover:text-blue-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-300 after:left-1/2 after:bottom-[-4px] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
					onClick={() => setIsMenuOpen(false)}
				>
					About Us
				</NavLink>
			</li>
			{user?.is_superuser && (
				<li>
					<NavLink
						to={"/admin/dashboard"}
						className="text-white hover:text-blue-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-300 after:left-1/2 after:bottom-[-4px] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
						onClick={() => setIsMenuOpen(false)}
					>
						Dashboard
					</NavLink>
				</li>
			)}
		</ul>
	);

	return (
		<div
			className={`navbar top-0 z-50 w-full sticky transition-all duration-300 ease-in-out ${
				insLandingPage && !scrolled && !isMenuOpen
					? "bg-transparent"
					: "bg-[#323d5e]"
			}`}
		>
			{/* Menu Button- mobile */}
			<div
				className="justify-end absolute right-4 lg:hidden text-white"
				onClick={toggleMenu}
			>
				<div className="text-2xl">
					{isMenuOpen ? (
						<FontAwesomeIcon icon={faX} />
					) : (
						<FontAwesomeIcon icon={faBars} />
					)}
				</div>
			</div>
			{/*Desktop left section- Logo */}
			<div className="navbar-start w-full justify-center lg:w-1/4">
				<NavLink
					to={"/"}
					className="text-white text-3xl font-bold cursor-pointer"
					onClick={() => setIsMenuOpen(false)}
				>
					KUETx
				</NavLink>
			</div>

			{/*Desktop Nav Options - Center */}
			<div className="navbar-center lg:flex hidden lg:w-1/2 justify-center">
				{navOptions}
			</div>

			<div className="navbar-end hidden lg:flex lg:w-1/4 justify-end space-x-3">
				{!user ? (
					<>
						<NavLink
							to={"/login"}
							className="text-white hover:text-blue-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-300 after:left-1/2 after:bottom-[-4px] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
							onClick={() => setIsMenuOpen(false)}
						>
							Log in
						</NavLink>
						<NavLink
							to={"/register"}
							className="btn bg-blue-500 hover:bg-blue-600 border-0 text-white cursor-pointer"
							onClick={() => setIsMenuOpen(false)}
						>
							Sign Up
						</NavLink>
					</>
				) : (
					<>
						<NavLink
							to={"/profile"}
							className="btn bg-blue-500 hover:bg-blue-600 border-0 text-white cursor-pointer"
							onClick={() => setIsMenuOpen(false)}
						>
							Profile
						</NavLink>
						<button
							onClick={logoutUser}
							className="btn bg-blue-500 hover:bg-blue-600 border-0 text-white cursor-pointer"
						>
							Log out
						</button>
					</>
				)}
			</div>

			{/* Mobile Menu */}
			<div
				className={`fixed top-16 left-0 right-0 bg-[#323d5e] transform transition-all duration-300 ease-in-out justify-center ${
					isMenuOpen
						? "opacity-100 translate-y-0"
						: "opacity-0 -translate-y-full pointer-events-none"
				}`}
			>
				<div
					className={`flex flex-col p-8 space-y-4 transform transition-all duration-300 delay-150 ${
						isMenuOpen
							? "opacity-100 translate-x-0"
							: "opacity-0 -translate-x-10"
					}`}
				>
					<div className="w-full px-4">{navOptions}</div>
					<div className="w-full px-4 pt-4 border-t border-gray-600">
						{!user ? (
							<div className="flex flex-col space-y-4">
								<NavLink
									to={"/login"}
									className="text-white hover:text-blue-300 text-center transform transition hover:scale-105"
									onClick={() => setIsMenuOpen(false)}
								>
									Log in
								</NavLink>
								<NavLink
									to={"/register"}
									className="btn bg-blue-500 hover:bg-blue-600 border-0 text-white cursor-pointer w-full transform transition hover:scale-105"
									onClick={() => setIsMenuOpen(false)}
								>
									Sign Up
								</NavLink>
							</div>
						) : (
							<div className="flex flex-col space-y-4">
								<NavLink
									to={"/profile"}
									className="btn bg-blue-500 hover:bg-blue-600 border-0 text-white cursor-pointer w-full transform transition hover:scale-105"
									onClick={() => setIsMenuOpen(false)}
								>
									Profile
								</NavLink>
								<button
									onClick={() => {
										logoutUser();
										setIsMenuOpen(false);
									}}
									className="btn bg-blue-500 hover:bg-blue-600 border-0 text-white cursor-pointer w-full transform transition hover:scale-105"
								>
									Log out
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
