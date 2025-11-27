// At the very top of your return in CPUScheduling.jsx
<div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
  <div className="w-full max-w-4xl">
    {/* your entire existing content */}
    ...
  </div>
</div>

// src/components/CPUScheduling.jsx
import { useState } from "react";

export default function CPUScheduling() {
  const [processes, setProcesses] = useState([]);
  const [name, setName] = useState("");
  const [arrival, setArrival] = useState("");
  const [burst, setBurst] = useState("");
  const [results, setResults] = useState(null);

  const addProcess = () => {
    if (!name || arrival === "" || burst === "") return;
    setProcesses([...processes, { name: name.toUpperCase(), arrival: Number(arrival), burst: Number(burst) }]);
    setName(""); setArrival(""); setBurst("");
  };

  const removeProcess = (index) => {
    setProcesses(processes.filter((_, i) => i !== index));
  };

  const calculateFCFS = () => {
    const sorted = [...processes].sort((a, b) => a.arrival - b.arrival);
    let currentTime = 0;
    const result = sorted.map(p => {
      if (currentTime < p.arrival) currentTime = p.arrival;
      const start = currentTime;
      const completion = currentTime + p.burst;
      const turnaround = completion - p.arrival;
      const waiting = turnaround - p.burst;
      currentTime = completion;
      return { ...p, start, completion, turnaround, waiting };
    });
    setResults(result);
  };

  const reset = () => {
    setProcesses([]);
    setResults(null);
    setName(""); setArrival(""); setBurst("");
  };

  return (
    <>
      <style>{`
        body, html { margin: 20; padding: 10; }
        .page-container {
          min-height: 60vh;
          background: #d3d3d3; /* Ash gray background */
          display: flex;
          justify-content: center;
          padding: 40px 20px;
          font-family: Arial, sans-serif;
        }
        .main-card {
          width: 100%;
          max-width: 1100px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.2);
          padding: 50px;
          margin: 0 auto;
        }
        .title { text-align: center; font-size: 2.8em; font-weight: bold; color: #222; margin-bottom: 10px; }
        .subtitle { text-align: center; font-size: 1.3em; color: #555; margin-bottom: 30px; }
        .alert { background: #e3f2fd; border-left: 6px solid #1976d2; padding: 20px; border-radius: 0 10px 10px 0; margin-bottom: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .alert p { margin: 0; color: #0d47a1; font-weight: 600; font-size: 1.1em; }
        .section-title { font-size: 2.1em; font-weight: bold; margin: 40px 0 25px; color: #333; }
        .input-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        .input-field label { display: block; margin-bottom: 10px; font-weight: 600; color: #444; font-size: 1.1em; }
        .input-field input {
          width: 100%; padding: 16px; border: 2px solid #ccc; border-radius: 10px; font-size: 16px;
          transition: all 0.3s;
        }
        .input-field input:focus { outline: none; border-color: #1976d2; box-shadow: 0 0 12px rgba(25,118,210,0.3); }
        .buttons { display: flex; gap: 25px; justify-content: center; margin-bottom: 50px; flex-wrap: wrap; }
        .btn {
          padding: 16px 40px; font-weight: bold; font-size: 18px; border: none; border-radius: 10px;
          cursor: pointer; transition: all 0.3s; box-shadow: 0 6px 15px rgba(0,0,0,0.2);
        }
        .btn-green { background: #4caf50; color: white; }
        .btn-green:hover { background: #388e3c; transform: translateY(-3px); }
        .btn-blue { background: #1976d2; color: white; }
        .btn-blue:hover { background: #1565c0; transform: translateY(-3px); }
        .btn-blue:disabled { background: #999; cursor: not-allowed; transform: none; }
        .btn-red { background: #f44336; color: white; }
        .btn-red:hover { background: #d32f2f; transform: translateY(-3px); }
        .process-item {
          display: flex; align-items: center; justify-content: space-between;
          background: #f8f9fa; padding: 20px; border-radius: 14px; border: 1px solid #e0e0e0;
          margin-bottom: 18px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .process-info { display: flex; gap: 60px; font-size: 19px; font-weight: 500; }
        .process-bar { height: 56px; background: #f44336; border-radius: 10px; margin: 0 25px; min-width: 320px; }
        .remove-btn { padding: 12px 28px; background: #f44336; color: white; font-weight: bold; border: none; border-radius: 10px; cursor: pointer; }
        .remove-btn:hover { background: #c62828; }
        .table-container { overflow-x: auto; border-radius: 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin: 50px 0; }
        table { width: 100%; border-collapse: collapse; background: white; }
        th { background: linear-gradient(135deg, #b71c1c, #d32f2f); color: white; padding: 20px; text-align: center; font-size: 18px; }
        th:first-child { border-top-left-radius: 14px; }
        th:last-child { border-top-right-radius: 14px; }
        td { padding: 18px; text-align: center; font-size: 17px; }
        tr:nth-child(even) { background: #f9f9f9; }
        .process-name { font-weight: bold; color: #1976d2; }
        .completion { color: #2e7d32; font-weight: bold; }
        .turnaround { color: #7b1fa2; font-weight: bold; }
        .waiting { color: #ff6f00; font-weight: bold; }
        .gantt-container { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 15px 40px rgba(0,0,0,0.1); margin-top: 50px; }
        .gantt-title { font-size: 2.5em; font-weight: bold; text-align: center; margin-bottom: 40px; color: #333; }
        .gantt-chart { display: flex; align-items: flex-end; gap: 8px; justify-content: center; min-height: 140px; padding: 30px 0; }
        .gantt-block {
          background: #f44336; color: white; font-weight: bold; font-size: 2em;
          text-align: center; padding: 25px 15px; border-radius: 12px; min-width: 130px;
          box-shadow: 0 8px 20px rgba(244,67,54,0.4); transition: transform 0.3s;
        }
        .gantt-block:hover { transform: translateY(-10px); }
        .gantt-timeline { display: flex; justify-content: center; gap: 80px; margin-top: 30px; font-size: 1.6em; font-weight: bold; color: #444; }
        .timeline-line { height: 5px; background: #999; flex: 1; margin: 25px 0; }
        @media (max-width: 768px) {
          .input-grid { grid-template-columns: 1fr; }
          .process-info { gap: 20px; flex-direction: column; align-items: flex-start; }
          .gantt-chart { gap: 15px; flex-wrap: wrap; }
        }
      `}</style>

      <div className="page-container">
        <div className="main-card">
          <h1 className="title">First Come First Served (FCFS) Scheduling Algorithm</h1>
          <p className="subtitle">Calculate scheduling metrics for CPU process scheduling</p>

          <div className="alert">
            <p>Enter process information (minimum 3, maximum 10 processes) and click "Add Process" to add them to the queue.</p>
          </div>

          <h2 className="section-title">Process Input</h2>

          <div className="input-grid">
            <div className="input-field">
              <label>Process Name</label>
              <input type="text" placeholder="e.g., P1" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="input-field">
              <label>Arrival Time</label>
              <input type="number" placeholder="e.g., 0" value={arrival} onChange={(e) => setArrival(e.target.value)} />
            </div>
            <div className="input-field">
              <label>Burst Time</label>
              <input type="number" placeholder="e.g., 5" value={burst} onChange={(e) => setBurst(e.target.value)} />
            </div>
          </div>

          <div className="buttons">
            <button className="btn btn-green" onClick={addProcess}>Add Process</button>
            <button className="btn btn-blue" disabled={processes.length < 3} onClick={calculateFCFS}>Calculate</button>
            <button className="btn btn-red" onClick={reset}>Reset</button>
          </div>

          {processes.length > 0 && (
            <div>
              {processes.map((p, i) => (
                <div key={i} className="process-item">
                  <div className="process-info">
                    <span className="process-name">{p.name}</span>
                    <span>AT: {p.arrival}</span>
                    <span>BT: {p.burst}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                    <div className="process-bar" style={{ width: `${Math.max(p.burst * 70, 250)}px` }}></div>
                    <button className="remove-btn" onClick={() => removeProcess(i)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {results && (
            <>
              <h2 className="section-title">Scheduling Results</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Process</th>
                      <th>Arrival Time</th>
                      <th>Burst Time</th>
                      <th>Completion Time</th>
                      <th>Turn Around Time</th>
                      <th>Waiting Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i}>
                        <td className="process-name">{r.name}</td>
                        <td>{r.arrival}</td>
                        <td>{r.burst}</td>
                        <td className="completion">{r.completion}</td>
                        <td className="turnaround">{r.turnaround}</td>
                        <td className="waiting">{r.waiting}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="gantt-container">
                <h2 className="gantt-title">Gantt Chart</h2>
                <div className="gantt-chart">
                  {results.map((p, i) => (
                    <div key={i} className="gantt-block" style={{ width: `${p.burst * 80}px`, minWidth: '140px' }}>
                      {p.name}
                    </div>
                  ))}
                </div>
                <div className="gantt-timeline">
                  {[...new Set([0, ...results.flatMap(p => [p.start, p.completion])])].sort((a,b)=>a-b).map((time, i, arr) => (
                    <div key={time}>
                      {i > 0 && <div className="timeline-line"></div>}
                      <div style={{ marginTop: '15px' }}>{time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}