// This component is used to render card of applied jobs by the user.
import "./index.css";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBusinessTime,
  faFileAlt,
  faMapMarkerAlt,
  faRupeeSign,
} from "@fortawesome/free-solid-svg-icons";
import { Component } from "react/cjs/react.production.min";

class AppliedJobItem extends Component {
  //This function is called when apply btn is clicked
  onClickApplyBtn = async () => {
    const { user, jobDetails } = this.props;
    const { id } = jobDetails;
    const apiUrl = `http://localhost:3004/applicants?post_id=${id}`;
    const response = await fetch(apiUrl);
    const fetchedData = await response.json();
    // If the user is first applicant for the job.
    if (fetchedData.length === 0) {
      const ApplicantObject = {
        post_id: id,
        applicant_ids: [user.uid],
      };

      const options = {
        method: "POST",
        body: JSON.stringify(ApplicantObject),
        headers: {
          "Content-type": "application/json",
        },
      };

      const response = await fetch("http://localhost:3004/applicants", options);
      if (response.ok === true) {
        alert("Applied Successfully");
      }
    } else {
      const applied_list = fetchedData[0].applicant_ids;
      // if the user already applied for the job then the application will be discarded.
      if (applied_list.includes(user.uid)) {
        const index = applied_list.indexOf(user.uid);
        applied_list.splice(index, 1);

        const applicantObject = {
          id: fetchedData.id,
          post_id: id,
          applicant_ids: applied_list,
        };

        const options = {
          method: "PUT",
          body: JSON.stringify(applicantObject),
          headers: {
            "Content-type": "application/json",
          },
        };

        const response = await fetch(
          `http://localhost:3004/applicants/${fetchedData[0].id}`,
          options
        );
        if (response.ok === true) {
          alert("Application Removed Successfully...");
        }
      } else {
        //If the user did not apply for the job before
        applied_list.push(user.uid);

        const applicantObject = {
          id: fetchedData.id,
          post_id: id,
          applicant_ids: applied_list,
        };

        const options = {
          method: "PUT",
          body: JSON.stringify(applicantObject),
          headers: {
            "Content-type": "application/json",
          },
        };

        const response = await fetch(
          `http://localhost:3004/applicants/${fetchedData[0].id}`,
          options
        );
        if (response.ok === true) {
          alert("Applied Successfully...");
        }
      }
    }

    // The below code is used to update the application ids of the user
    const apiUrl1 = `http://localhost:3004/user_applications?user_id=${user.uid}`;
    const response1 = await fetch(apiUrl1);
    const fetchedData1 = await response1.json();
    // If the user is first user to apply for the job
    if (fetchedData1.length === 0) {
      const userApplicationObject = {
        user_id: user.uid,
        post_ids: [id],
      };

      const options = {
        method: "POST",
        body: JSON.stringify(userApplicationObject),
        headers: {
          "Content-type": "application/json",
        },
      };

      const response = await fetch(
        "http://localhost:3004/user_applications",
        options
      );
    } else {
      // If the user already applied for the job then the application will be discarded
      const userApplications = fetchedData1[0].post_ids;
      if (userApplications.includes(id)) {
        const index = userApplications.indexOf(id);
        userApplications.splice(index, 1);

        const userApplicationObject = {
          id: fetchedData1[0].id,
          user_id: user.uid,
          post_ids: userApplications,
        };

        const options = {
          method: "PUT",
          body: JSON.stringify(userApplicationObject),
          headers: {
            "Content-type": "application/json",
          },
        };

        const response = await fetch(
          `http://localhost:3004/user_applications/${fetchedData1[0].id}`,
          options
        );
      } else {
        // if the user did not apply for the job before.
        userApplications.push(id);

        const userApplicationObject = {
          id: fetchedData1[0].id,
          user_id: user.uid,
          post_ids: userApplications,
        };

        const options = {
          method: "PUT",
          body: JSON.stringify(userApplicationObject),
          headers: {
            "Content-type": "application/json",
          },
        };

        const response = await fetch(
          `http://localhost:3004/user_applications/${fetchedData1[0].id}`,
          options
        );
      }
    }
    // This will fetch the data again and re-render the component
    const { getAppliedJobs } = this.props;
    getAppliedJobs();
  };

  render() {
    const { jobDetails } = this.props;
    const {
      id,
      jobTitle,
      companyName,
      reviews = 7999,
      salary,
      jobDescription,
      companyLocation,
      jobType,
      posted = "2 days ago",
    } = jobDetails;

    const contractIcon = <FontAwesomeIcon icon={faBusinessTime} />;
    const rupeeIcon = <FontAwesomeIcon icon={faRupeeSign} />;
    const locationIcon = <FontAwesomeIcon icon={faMapMarkerAlt} />;
    const descriptionIcon = <FontAwesomeIcon icon={faFileAlt} />;

    const { user } = this.props;

    return (
      <>
        <div className="job-card-container">
          <div className="job-card-container-header">
            <h1 className="job-card-role">{jobTitle}</h1>
          </div>
          <div className="job-card-company-reviews">
            <p className="job-card-company">{companyName}</p>
            <p className="job-card-reviews">{reviews} Reviews</p>
          </div>
          <div className="job-card-features-container">
            <div className="job-card-feature">
              {contractIcon}
              <p className="job-card-feature-value">{jobType}</p>
            </div>
            <div className="job-card-feature">
              {rupeeIcon}
              <p className="job-card-feature-value">{salary}</p>
            </div>
            <div className="job-card-feature">
              {locationIcon}
              <p className="job-card-feature-value">{companyLocation}</p>
            </div>
          </div>
          <div className="job-card-description-container">
            {descriptionIcon}
            <p className="job-card-description">
              {jobDescription.slice(0, 120)} ...
            </p>
          </div>
          <div className="job-card-footer">
            <p className="job-card-posted">{posted}</p>
            <div>
              <Link to={`jobs/${id}`}>
                <button className="job-card-view-details-btn" type="button">
                  View Details
                </button>
              </Link>
              <button
                className="job-card-apply-btn"
                type="button"
                onClick={this.onClickApplyBtn}
              >
                Discard Application
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default AppliedJobItem;