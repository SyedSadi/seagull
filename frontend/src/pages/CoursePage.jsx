import CourseList from "../components/Courses/CourseList";
import { Helmet } from "react-helmet";

const CoursePage = () => {
	return (
		<div>
			<Helmet>
		        <title>Courses | KUETx</title>
    		</Helmet>	
			<CourseList />
		</div>
	);
};

export default CoursePage;
