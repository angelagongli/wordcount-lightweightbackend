import React from 'react';

function Header() {
    return (
        <div className="header">
            <div className="row no-gutters">
                <div className="col-12">
                    <h1 className="ms-fontSize-42">Word Count</h1>
                </div>
            </div>
            <div className="row no-gutters">
                <div className="col-12 col-lg-6">
                    <h2 className="ms-fontSize-32">
                        <i className="ms-Icon ms-Icon--Upload" aria-hidden="true"></i>
                        <i className="ms-Icon ms-Icon--PDF" aria-hidden="true"></i>
                    </h2>
                </div>
                <div className="col-12 col-lg-6">
                    <h2 className="ms-fontSize-32">
                        <i className="ms-Icon ms-Icon--TextDocument" aria-hidden="true"></i>
                        <i className="ms-Icon ms-Icon--NumberSymbol" aria-hidden="true"></i>
                    </h2>
                </div>
            </div>
        </div>
    );
}

export default Header;
