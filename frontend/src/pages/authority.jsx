import React, { useState } from "react";
import Navbar from "../components/navauth";
import "./authority.css";

const initialIssues = [
  {
    id: 1,
    title: "Water Leakage",
    category: "Water",
    status: "pending",
     description: "Garbage pile near market area.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952"
  },
  {
    id: 2,
    title: "Road Damage",
    category: "Roads",
    status: "pending",
    description: "A big pothole in the middle of the road. Needs urgent repair.",
    image: "https://images.unsplash.com/photo-1606220838315-056192d5e927"
  },
  {
    id: 3,
    title: "Garbage Not Collected",
    category: "Sanitation",
    status: "pending",
     description: "Garbage pile near market area.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952"
  },
  {
    id: 4,
    title: "Street Light Not Working",
    category: "Electricity",
    status: "inprogress",
    description: "Street light not working for two days.",
    image: "https://images.unsplash.com/photo-1509395176047-4a66953fd231"
  },
  {
    id: 5,
    title: "Drainage Block",
    category: "Water",
    status: "solved",
     description: "Garbage pile near market area.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952"
  },
];

function Authority() {
  
  const [issues, setIssues] = useState(initialIssues);
  const [filter, setFilter] = useState("all");
  const [openUpdate, setOpenUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [proof, setProof] = useState(null);


  const filteredIssues =
  filter === "all"
    ? issues
    : issues.filter((issue) => issue.status === filter);


    /* UPDATE STATUS FUNCTION */
  const handleUpdate = (id) => {
    if (openUpdate === id) {
        setOpenUpdate(null); // close if clicked again
    } else {
        setOpenUpdate(id); // open dropdown
    }
    };

  const submitUpdate = (id) => {

     if (!newStatus || !proof) {
    alert("Please select status and upload proof image.");
    return;
  }

    const updated = issues.map((issue) =>
      issue.id === id ? { ...issue, status: newStatus,proofImage: proof } : issue
    );

    setIssues(updated);
    
    setOpenUpdate(null);
    setNewStatus("");
    setProof(null);
  };

  
  return (
    <div className="dashboard-container">

      {/* NAVBAR */}

<Navbar/>

      <div className="dashboard-body">

        {/* SIDEBAR */}


        <div className="sidebar">

        <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
        >
            All Issues
        </button>

        <button
            className={filter === "pending" ? "active" : ""}
            onClick={() => setFilter("pending")}
        >
            Pending Issues
        </button>

        <button
            className={filter === "inprogress" ? "active" : ""}
            onClick={() => setFilter("inprogress")}
        >
            In Progress Issues
        </button>

        <button
            className={filter === "solved" ? "active" : ""}
            onClick={() => setFilter("solved")}
        >
            Solved Issues
        </button>

        </div>



        {/* RIGHT PANEL */}

        <div className="contentt">

            <h2>
            {filter === "all"
                ? "All Issues"
                : filter === "pending"
                ? "Pending Issues"
                : filter === "inprogress"
                ? "In Progress Issues"
                : "Solved Issues"}
            </h2>

          {/* Issues Grid */}

          <div className="issues-grid">

            {filteredIssues.map(issue => (

              <div className="card" key={issue.id}>

                <img src={issue.image} alt={issue.title} />

                <div className="card-body">

                  <span
                    className={
                      issue.status === "pending"
                        ? "status pending"
                        : issue.status === "inprogress"
                        ? "status progress"
                        : "status solved"
                    }
                  >
                    {issue.status}
                  </span>

                  <h3>{issue.title}</h3>

                  <p>{issue.description}</p>

                   {/* UPDATE SECTION */}
                <div className="card-buttons">
                  
                  <button className="buttonau">
                  {/*onClick={() => navigate(`/issue-details/${issue.id}`)}*/}
                    View Details
                  </button>
                  <button
                        className="buttonau"
                        onClick={() => handleUpdate(issue.id)}
                        >
                        Update
                  </button>

                  {issue.proofImage && (
                    <button
                        className="buttonau"
                        onClick={() =>
                        window.open(URL.createObjectURL(issue.proofImage))
                        }
                    >
                        View Proof
                    </button>

                    
                    

                )}

                </div>

                    {/* UPDATE PANEL */}

                  {openUpdate === issue.id && (
                    

                    <div className="update-panel">

                         <label>
                            Select Status <span className="required">*</span>
                        </label>

                      <select
                        value={newStatus}
                        onChange={(e) =>
                          setNewStatus(e.target.value)
                        }
                      >
                        <option value="">Select Status</option>
                        <option value="pending">Pending</option>
                        <option value="inprogress">In Progress</option>
                        <option value="solved">Solved</option>
                      </select>

                       <label>
                            Upload Proof Image <span className="required">*</span>
                        </label>


                      <input
                        type="file"
                        onChange={(e) =>
                          setProof(e.target.files[0])
                        }
                      />

                      <button
                        className="submit-btn"
                        onClick={() => submitUpdate(issue.id)}
                      >
                        Submit
                      </button>
                    </div>
                        )}

                </div>
               

              </div>

            ))}

          </div>

        </div>
          
      </div>

    </div>
  );
}

export default Authority;