import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const {user, logoutUser} = useContext(AuthContext)

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const navOptions = (
		<ul className="flex flex-col lg:flex-row lg:space-x-20 space-y-4 lg:space-y-0 text-center text-sm">
			<li>
				<NavLink
					to={"/courses"}
					className={({ isActive }) =>
						isActive
							? "text-blue-400 font-bold relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-blue-400 after:left-0 after:bottom-[-4px]"
							: "text-white hover:text-blue-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-300 after:left-1/2 after:bottom-[-4px] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
					}
					onClick={() => setIsMenuOpen(false)}
				>
					Courses
				</NavLink>
			</li>
			<li>
				<NavLink
					to={"/forum"}
					className={({ isActive }) =>
						isActive
							? "text-blue-400 font-bold relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-blue-400 after:left-0 after:bottom-[-4px]"
							: "text-white hover:text-blue-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-300 after:left-1/2 after:bottom-[-4px] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
					}
					onClick={() => setIsMenuOpen(false)}
				>
					Forum
				</NavLink>
			</li>
			<li>
				<NavLink
					to={"/aboutus"}
					className={({ isActive }) =>
						isActive
							? "text-blue-400 font-bold relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-blue-400 after:left-0 after:bottom-[-4px]"
							: "text-white hover:text-blue-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-300 after:left-1/2 after:bottom-[-4px] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
					}
					onClick={() => setIsMenuOpen(false)}
				>
					About Us
				</NavLink>
			</li>
			<li>
				<NavLink
					to={"/career"}
					className={({ isActive }) =>
						isActive
							? "text-blue-400 font-bold relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-blue-400 after:left-0 after:bottom-[-4px]"
							: "text-white hover:text-blue-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-300 after:left-1/2 after:bottom-[-4px] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
					}
					onClick={() => setIsMenuOpen(false)}
				>
					Career
				</NavLink>
			</li>
			{user?.is_superuser && <li>
				<NavLink
					to={"/admin/dashboard"}
					className={({ isActive }) =>
						isActive
							? "text-blue-400 font-bold relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-blue-400 after:left-0 after:bottom-[-4px]"
							: "text-white hover:text-blue-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-300 after:left-1/2 after:bottom-[-4px] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
					}
					onClick={() => setIsMenuOpen(false)}
				>
					Dashboard
				</NavLink>
			</li>}
		</ul>
	);

	return (
		<div className="navbar bg-[#323d5e]">
			{/* Menu Button */}
			<div
				className="absolute left-4 lg:hidden text-white"
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

			{/* Logo */}
			<div className="navbar-start w-full flex justify-center lg:w-1/4">
				<NavLink
					to={"/"}
					className="text-white text-2xl font-bold cursor-pointer"
				>
					KUETx
				</NavLink>
			</div>

			{/* Nav Options - Center */}
			<div className="navbar-center hidden lg:flex lg:w-1/2 justify-center">
				<ul className="flex flex-row space-x-20">{navOptions}</ul>
			</div>

			{/* Right section */}
			<div className="navbar-end hidden lg:flex lg:w-1/4 justify-end space-x-3">
				{!user ? 
				<>
					<NavLink
						to={"/login"}
						className={({ isActive }) =>
							isActive
								? "text-blue-400 font-bold relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-blue-400 after:left-0 after:bottom-[-4px]"
								: "text-white hover:text-blue-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-300 after:left-1/2 after:bottom-[-4px] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
						}
					>
						Log in
					</NavLink>
					<NavLink
						to={"/register"}
						className="btn bg-blue-500 hover:bg-blue-600 border-0 text-white cursor-pointer"
					>
						Sign Up
					</NavLink>
				</> : 
					<>
						<NavLink
						to={"/profile"}
						className="btn bg-blue-500 hover:bg-blue-600 border-0 text-white cursor-pointer">
						Profile</NavLink>
						<button
						onClick={logoutUser}
						className="btn bg-blue-500 hover:bg-blue-600 border-0 text-white cursor-pointer">
						Log out</button>
					</>
				}
			</div>

			{/* Mobile Menu */}
			<div
				className={`absolute top-16 left-0 w-full bg-[#323d5e] text-white shadow-lg transform ${
					isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
				} overflow-hidden transition-all duration-300`}
			>
				<div className="p-6">{navOptions}</div>
				<div className="p-4 flex flex-col items-center space-y-4">
					<NavLink
						to={"/login"}
						className={({ isActive }) =>
							isActive
								? "text-blue-400 font-bold relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-blue-400 after:left-0 after:bottom-[-4px]"
								: "text-white hover:text-blue-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-300 after:left-1/2 after:bottom-[-4px] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
						}
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
				</div>
			</div>
		</div>
	);
};

export default Navbar;
