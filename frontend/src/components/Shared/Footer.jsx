import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Footer = () => {
	const handleLogoClick = (e) => {
		// If we're already on home page, prevent navigation
		if (location.pathname === "/") {
			e.preventDefault();
			window.scrollTo({
				top: 0,
				behavior: "smooth",
			});
		}
	};
	return (
		<div>
			<footer className="footer footer-center bg-[#323d5e] text-white p-10 z-50 mt-auto w-full">
				<nav className="grid grid-flow-col gap-4">
					<Link to={"/courses"} className="link link-hover">
						Courses
					</Link>
					<Link to={"/quiz"} className="link link-hover">
						Quiz
					</Link>
					<Link to={"/forum"} className="link link-hover">
						Forum
					</Link>

					<Link to={"/aboutus"} className="link link-hover">
						About us
					</Link>
				</nav>
				<Link to={"/"} className="" onClick={handleLogoClick}>
					<img
						src={logo}
						className="col-span-2 h-7 w-full object-contain transform hover:scale-105 transition-all duration-300 cursor-pointer lg:col-span-1"
						alt="Learning background"
					/>
				</Link>
				<nav className="grid grid-flow-col gap-4">
					<a
						href="https://seagull-production.up.railway.app/api/schema/swagger-ui/"
						className="link inline"
						target="_blank"
					>
						Explore API
					</a>
					<a
						href="https://seagull-production.up.railway.app/"
						className="link inline"
						target="_blank"
					>
						Devlog
					</a>
				</nav>
				
				<nav>
					<div className="grid grid-flow-col gap-4">
						<a
							href="https://linkedin.com"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:scale-110 transition-transform duration-300"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								className="fill-current hover:fill-[#0A66C2] transition-colors duration-300"
							>
								<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
							</svg>
						</a>
						<a
							href="https://youtube.com"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:scale-110 transition-transform duration-300"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								className="fill-current hover:fill-[#FF0000] transition-colors duration-300"
							>
								<path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
							</svg>
						</a>
						<a
							href="https://facebook.com"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:scale-110 transition-transform duration-300"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								className="fill-current hover:fill-[#1877F2] transition-colors duration-300"
							>
								<path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
							</svg>
						</a>
					</div>
				</nav>
				<aside>
					<p>Copyright © {new Date().getFullYear()} - All rights reserved</p>
				</aside>
			</footer>
		</div>
	);
};

export default Footer;
