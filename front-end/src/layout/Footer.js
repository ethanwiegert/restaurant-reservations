import React from "react";

import { Link } from "react-router-dom";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Footer() {
  return (
    <div className="fixed-bottom">
        <footer className="d-flex flex-wrap justify-content-between align-items-center p-2 m-3 border-top">
            
                <span className="text-muted">Created by Ethan Wiegert</span>
            
        </footer>
    </div>
  );
}

export default Footer;
