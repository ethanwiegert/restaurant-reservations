import React from "react";

import { Link } from "react-router-dom";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Footer() {
  return (
    <div className="sticky-bottom">
        <footer className="d-flex flex-wrap justify-content-between align-items-center m-3 p-2 border-top">
            
                <p className="fs-5 text-muted">Created by Ethan Wiegert</p>
            
        </footer>
    </div>
  );
}

export default Footer;
