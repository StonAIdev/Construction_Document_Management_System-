import React from "react";
import "./OrganizationalCharts.css";

function OrganizationalCharts() {
  return (
    <div className="ChartsMain">
      <nav className="nav">
        <ul>
          <li>
            <a href="#">Comapny</a>
            <ul>
              <li>
                <a href="#">Project 1</a>
                <ul>
                  <li>
                    <a href="#">child 1</a>
                    <ul>
                      <li>
                        <a href="#">child 2</a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>

              <li>
                <a href="#">Project 2</a>
                <ul>
                  <li>
                    <a href="#">Departments</a>
                    <ul>
                      <li>
                        <a href="#">child 1</a>
                        <ul>
                          <li>
                            <a href="#">child 2</a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="#">Departments</a>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default OrganizationalCharts;
