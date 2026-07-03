import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Search, Calendar, Download, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import Alert from '../components/ui/Alert';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// ---------------- API ----------------
const pyqService = {
  getPYQs: (params) => API.get('/pyqs', { params }),
  deletePYQ: (id) => API.delete(`/pyqs/${id}`),
};

// ---------------- MAIN PAGE ----------------
const PYQRepository = () => {
  const { user } = useAuth();

  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // filters (ONLY semester + year + search)
  const [search, setSearch] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  
  // ---------------- FETCH ----------------
  const fetchPYQs = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = {};

      if (search) params.search = search;
      if (semester) params.semester = semester;
      if (year) params.year = year;
      console.log("Fetching with params:", params);
      const res = await pyqService.getPYQs(params);
      console.log("API Response:", res.data);
console.log("PYQs:", res.data.data.pyqs);

      // FIXED SAFE PARSING (your backend returns data.data)
      const list =
        res?.data?.data?.pyqs ||
        res?.data?.data ||
        [];
        // Automatically switch semester only if all results belong to the same semester
if (search && list.length > 0) {
  const semesters = [...new Set(list.map(p => p.semester))];

  if (semesters.length === 1 && semester !== semesters[0]) {
    setSemester(semesters[0]);
  }
}
console.log("First paper:", list[0]);
      setPyqs(list);
      console.log("List length:", list.length);
    } catch (err) {
  console.error("FULL ERROR:", err);
  console.error(err.response);
  console.error(err.message);

  setError(err?.response?.data?.message || err.message);
}finally {
      setLoading(false);
    }
  }, [search, semester, year]);

  useEffect(() => {
    const t = setTimeout(fetchPYQs, 300);
    return () => clearTimeout(t);
  }, [fetchPYQs]);

  // ---------------- ACTIONS ----------------
const handleDownload = (pyq) => {
  window.open(
    `${API.defaults.baseURL}/pyqs/${pyq._id}/file`,
    '_blank'
  );
};
  const clearFilters = () => {
    setSearch('');
    setSemester('');
    setYear('');
  };

  // ---------------- UI ----------------
  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">PYQ Repository</h1>
        <p className="text-sm text-gray-500">
          Semester-wise AKTU Previous Year Papers
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="flex items-center gap-2 border rounded-lg p-2">
        <Search size={16} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search subject or title..."
          className="flex-1 outline-none"
        />
        {(search || semester || year) && (
          <button onClick={clearFilters}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* FILTERS (NO BRANCH ANYMORE) */}
      <div className="flex gap-3 flex-wrap">

        <select
  value={semester}
  onChange={(e) => setSemester(e.target.value)}
  className="px-3 py-2 border rounded-lg bg-slate-800 text-white border-slate-600"
>
          <option value="">All Semesters</option>
          {[1,2,3,4,5,6,7,8].map((s) => (
            <option key={s} value={s}>Semester {s}</option>
          ))}
        </select>

        <select
  value={year}
  onChange={(e) => setYear(e.target.value)}
  className="px-3 py-2 border rounded-lg bg-slate-800 text-white border-slate-600"
>
  <option value="">All Years</option>
  {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017].map((y) => (
    <option key={y} value={y}>
      {y}
    </option>
  ))}
</select>

      </div>

      {/* ERROR */}
      {error && <Alert type="error" message={error} />}

      {/* LOADING */}
      {loading && <LoadingSpinner label="Loading PYQs..." />}

      {/* EMPTY */}
      {!loading && pyqs.length === 0 && (
        <div className="text-center text-gray-500">
          No PYQs found
        </div>
      )}

      {/* GRID */}
      <p>Total papers: {pyqs.length}</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

        {pyqs.map((pyq) => (
          <div
            key={pyq._id}
            className="border rounded-lg p-4 space-y-2"
          >

            {/* TITLE */}
            <h3 className="font-semibold text-sm">
              {pyq.title}
            </h3>

            {/* SUBJECT */}
            <p className="text-xs text-gray-500">
              {typeof pyq.subject === 'object'
                ? pyq.subject.name
                : pyq.subject}
            </p>

            {/* META */}
            <div className="flex gap-2 text-xs text-gray-600">
              <span>Sem {pyq.semester}</span>
              <span>•</span>
              <span>{pyq.year}</span>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-between items-center pt-2">

              <span className="text-xs text-gray-500">
                {pyq.uploadedBy?.name || 'Admin'}
              </span>

              <button
                onClick={() => handleDownload(pyq)}
                className="flex items-center gap-1 text-blue-600"
              >
                <Download size={14} />
                Download
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default PYQRepository;