import React from "react";

const Footer = () => {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} MyWebsite. All rights reserved.</p>
      <div>
        <h3>Terms</h3>
        <h3>privacy</h3>
      </div>
    </footer>
  );
};

export default Footer;
