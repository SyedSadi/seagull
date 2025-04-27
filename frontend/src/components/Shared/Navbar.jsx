import { useContext, useEffect, useState, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faBars, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

/**
 * Navbar component that provides navigation options for the application.
 * It includes links to various pages, a responsive design for mobile and desktop,
 * and user-specific options such as login, logout, and profile access.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered Navbar component.
 *
 * @example
 * <Navbar />
 *
 * @description
 * - Displays a sticky navigation bar that changes its background color based on scroll position.
 * - Includes a mobile menu toggle for smaller screens.
 * - Dynamically renders navigation options based on user authentication status.
 * - Provides links to "Courses", "Quiz", "Forum", "About Us", and an admin dashboard (if applicable).
 * - Includes login, signup, profile, and logout options for users.
 *
 * @dependencies
 * - React hooks: `useState`, `useEffect`, `useContext`, `useRef`.
 * - React Router: `NavLink`, `useLocation`.
 * - FontAwesome icons: `faBars`, `faX`, `faCircleUser`.
 *
 * @state
 * - `isMenuOpen` (boolean): Tracks whether the mobile menu is open.
 * - `scrolled` (boolean): Tracks whether the user has scrolled down the page.
 *
 * @context
 * - `AuthContext`: Provides `user` (authenticated user data) and `logoutUser` (function to log out the user).
 *
 * @props
 * - None
 */
const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { user, logoutUser } = useContext(AuthContext);
	const [scrolled, setScrolled] = useState(false);
	const location = useLocation();
	const insLandingPage = location.pathname === "/";
	const menuRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target) &&
				isMenuOpen
			) {
				setIsMenuOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isMenuOpen]);

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

	useEffect(() => {
		const handleResize = () => {
			//Close mobile menu if window width os larger than lg breakpoint 1024px
			if (window.innerWidth >= 1024 && isMenuOpen) {
				setIsMenuOpen(false);
			}
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [isMenuOpen]);

	const navOptions = (
		<ul className="flex flex-col lg:flex-row lg:space-x-20 space-y-4 lg:space-y-0 text-center text-m">
			<li>
				<NavLink
					to={"/courses"}
					title="Browse available courses"
					className="text-white hover:text-blue-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-300 after:left-1/2 after:bottom-[-4px] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
					onClick={() => setIsMenuOpen(false)}
				>
					Courses
				</NavLink>
			</li>
			<li>
				<NavLink
					to={"/quiz"}
					title="Test your knowledge with quizzes"
					className="text-white hover:text-blue-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-300 after:left-1/2 after:bottom-[-4px] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
					onClick={() => setIsMenuOpen(false)}
				>
					Quiz
				</NavLink>
			</li>
			<li>
				<NavLink
					to={"/forum"}
					title="Join discussions in our forum"
					className="text-white hover:text-blue-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-300 after:left-1/2 after:bottom-[-4px] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
					onClick={() => setIsMenuOpen(false)}
				>
					Forum
				</NavLink>
			</li>
			<li>
				<NavLink
					to={"/aboutus"}
					title="Learn more about us"
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
						title="Access admin dashboard"
						className="text-white hover:text-blue-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-300 after:left-1/2 after:bottom-[-4px] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
						onClick={() => setIsMenuOpen(false)}
					>
						Dashboard
					</NavLink>
				</li>
			)}
			{user?.role === "instructor" && (
				<li>
					<NavLink
						to={"/add-courses"}
						title="Access admin dashboard"
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
			ref={menuRef}
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
			<div className="w-full justify-center lg:w-1/4">
				<NavLink
					to={"/"}
					title="Go to homepage"
					onClick={() => setIsMenuOpen(false)}
				>
					<img
						src={logo}
						className="col-span-2 h-10 w-full object-contain transform hover:scale-110 transition-all duration-300 cursor-pointer lg:col-span-1"
						alt="Learning background"
					/>
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
							title="Login to your account"
							className="text-white hover:text-blue-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-300 after:left-1/2 after:bottom-[-4px] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
							onClick={() => setIsMenuOpen(false)}
						>
							Log in
						</NavLink>
						<NavLink
							to={"/register"}
							title="Create a new account"
							className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-3 rounded-full hover:transition-colors duration-500"
							onClick={() => setIsMenuOpen(false)}
						>
							Sign Up
						</NavLink>
					</>
				) : (
					<>
						<NavLink
							to={"/profile"}
							title="View your profile"
							className="text-4xl text-gray-200 hover:text-blue-500 hover:transition-colors duration-500"
							onClick={() => setIsMenuOpen(false)}
						>
							<FontAwesomeIcon icon={faCircleUser} />
						</NavLink>
						<button
							onClick={logoutUser}
							className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-3 rounded-full hover:transition-colors duration-500"
							title="Log out"
						>
							Log out
						</button>
					</>
				)}
			</div>

			{/* Mobile Menu */}
			<div
				ref={menuRef}
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
									className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-3 rounded-full hover:transition-colors duration-500"
									onClick={() => setIsMenuOpen(false)}
								>
									Sign Up
								</NavLink>
							</div>
						) : (
							<div className="flex flex-col text-center space-y-4">
								<NavLink
									to={"/profile"}
									className="text-4xl text-gray-200 hover:text-blue-500 hover:transition-colors duration-500"
									onClick={() => setIsMenuOpen(false)}
								>
									<FontAwesomeIcon icon={faCircleUser} />
								</NavLink>
								<button
									onClick={() => {
										logoutUser();
										setIsMenuOpen(false);
									}}
									className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-3 rounded-full hover:transition-colors duration-500"
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
