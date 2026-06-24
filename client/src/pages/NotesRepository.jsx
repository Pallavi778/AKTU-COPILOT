import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import {
  Search,
  BookOpen,
  FileDown,
  Upload,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
  Layers
} from 'lucide-react';

const NotesRepository = () => {
  const { user } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState(user?.branch || 'All');
  const [semester, setSemester] = useState(user?.semester || '');
  const [subject, setSubject] = useState('All');
  const [chapter, setChapter] = useState('');

  // Upload dialog state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadBranch, setUploadBranch] = useState(user?.branch || 'Computer Science');
  const [uploadSemester, setUploadSemester] = useState(user?.semester || 3);
  const [uploadSubject, setUploadSubject] = useState('');
  const [uploadChapter, setUploadChapter] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const branches = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering'
  ];

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const fetchSubjects = async () => {
    try {
      const { data } = await API.get('/subjects');
      if (data.success) {
        setSubjects(data.data);
        if (data.data.length > 0) {
          setUploadSubject(data.data[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load subjects', err);
    }
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = `?search=${search}`;
      if (branch !== 'All') query += `&branch=${branch}`;
      if (semester !== '') query += `&semester=${semester}`;
      if (subject !== 'All') query += `&subject=${subject}`;
      if (chapter !== '') query += `&chapter=${chapter}`;

      const { data } = await API.get(`/notes${query}`);
      if (data.success) {
        setNotes(data.data);
      }
    } catch (err) {
      setError('Could not retrieve notes database. Please check server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [search, branch, semester, subject, chapter]);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploadError('');
    setUploadSuccess(false);

    if (!uploadTitle || !uploadBranch || !uploadSemester || !uploadSubject || !uploadChapter) {
      setUploadError('Please fill in all notes parameters.');
      return;
    }

    if (!uploadFile) {
      setUploadError('Please select a PDF file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('title', uploadTitle);
    formData.append('branch', uploadBranch);
    formData.append('semester', Number(uploadSemester));
    formData.append('subject', uploadSubject);
    formData.append('chapter', uploadChapter);
    formData.append('file', uploadFile);

    try {
      setUploading(true);
      const { data } = await API.post('/notes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.success) {
        setUploadSuccess(true);
        setUploadTitle('');
        setUploadChapter('');
        setUploadFile(null);
        // Reload list
        fetchNotes();
        setTimeout(() => {
          setUploadOpen(false);
          setUploadSuccess(false);
        }, 1500);
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Error occurred during notes upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (fileUrl, title) => {
    const link = document.createElement('a');
    link.href = fileUrl.startsWith('http') ? fileUrl : `http://localhost:5000${fileUrl}`;
    link.setAttribute('download', `${title}.pdf`);
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-primary-400 font-semibold uppercase tracking-wider">Chapter-wise PDF database</p>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100">Notes Repository</h1>
        </div>
        <button
          onClick={() => setUploadOpen(true)}
          className="glass-button-primary flex items-center justify-center space-x-2 text-xs py-3 self-start cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Notes</span>
        </button>
      </div>

      {/* Filters Panel */}
      <div className="glass-panel rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Search Notes</label>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/40 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-200 placeholder-slate-650"
              placeholder="e.g. Stack traversal..."
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
          </div>
        </div>

        {/* Branch */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Filter Branch</label>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none text-slate-300 cursor-pointer"
          >
            <option value="All">All Branches</option>
            {branches.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Semester */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Filter Semester</label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none text-slate-300 cursor-pointer"
          >
            <option value="">All Semesters</option>
            {semesters.map(s => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Filter Subject</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none text-slate-300 cursor-pointer"
          >
            <option value="All">All Subjects</option>
            {subjects
              .filter(s => (branch === 'All' || s.branch === branch) && (!semester || s.semester === Number(semester)))
              .map(sub => (
                <option key={sub._id} value={sub._id}>{sub.code} - {sub.name}</option>
              ))
            }
          </select>
        </div>

        {/* Chapter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Chapter/Unit</label>
          <input
            type="text"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-200 placeholder-slate-600"
            placeholder="e.g. Unit 1..."
          />
        </div>
      </div>

      {/* Main Notes List */}
      {error && (
        <div className="p-4 bg-red-950/30 border border-red-900/40 rounded-xl flex items-center space-x-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="glass-card p-6 space-y-4 rounded-2xl">
              <div className="h-6 w-3/4 skeleton rounded"></div>
              <div className="h-4 w-1/2 skeleton rounded"></div>
              <div className="h-10 skeleton rounded"></div>
            </div>
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl space-y-3">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h2 className="text-lg font-bold text-slate-400">No study notes found</h2>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">Try checking your filter controls, searching for key terms, or upload your own notes to help your classmates!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div
              key={note._id}
              className="glass-card p-6 flex flex-col justify-between space-y-4 rounded-2xl hover:translate-y-[-2px] hover:shadow-2xl transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-bold text-indigo-400 rounded uppercase">
                    {note.subject?.code || 'GEN'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 flex items-center">
                    <Layers className="w-3.5 h-3.5 mr-1" />
                    <span>{note.chapter}</span>
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-200 text-sm line-clamp-2 hover:text-indigo-400 transition-colors">
                  {note.title}
                </h3>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-[10px] text-slate-500 bg-slate-950/50 px-2 py-0.5 rounded-full">{note.branch}</span>
                  <span className="text-[10px] text-slate-500 bg-slate-950/50 px-2 py-0.5 rounded-full">Sem {note.semester}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-500">By: {note.uploadedBy?.name || 'Academic Seeder'}</span>
                <button
                  onClick={() => handleDownload(note.fileUrl, note.title)}
                  className="flex items-center space-x-1.5 font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD MODAL DIALOG */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 relative animate-slide-up">
            <button
              onClick={() => setUploadOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                <Upload className="w-5 h-5 text-indigo-400" />
                <span>Upload Study Notes</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">Contribute unit summaries or chapter handbooks to the library.</p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {uploadError && (
                <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl flex items-center space-x-2 text-red-300 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {uploadSuccess && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-900/50 rounded-xl flex items-center space-x-2 text-emerald-300 text-xs">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Notes uploaded successfully! Refreshing...</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Notes Title</label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs focus:outline-none text-slate-200"
                  placeholder="e.g. DFS/BFS Traversal Handouts"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Branch</label>
                  <select
                    value={uploadBranch}
                    onChange={(e) => setUploadBranch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs focus:outline-none text-slate-300 cursor-pointer"
                  >
                    {branches.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Semester</label>
                  <select
                    value={uploadSemester}
                    onChange={(e) => setUploadSemester(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs focus:outline-none text-slate-300 cursor-pointer"
                  >
                    {semesters.map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Subject</label>
                  <select
                    value={uploadSubject}
                    onChange={(e) => setUploadSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs focus:outline-none text-slate-300 cursor-pointer"
                  >
                    {subjects
                      .filter(s => s.branch === uploadBranch && s.semester === Number(uploadSemester))
                      .map(sub => (
                        <option key={sub._id} value={sub._id}>{sub.code} - {sub.name}</option>
                      ))
                    }
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Chapter / Unit</label>
                  <input
                    type="text"
                    required
                    value={uploadChapter}
                    onChange={(e) => setUploadChapter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs focus:outline-none text-slate-300"
                    placeholder="e.g. Unit 3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">PDF Document File</label>
                <input
                  type="file"
                  accept="application/pdf"
                  required
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-3 text-xs focus:outline-none text-slate-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-gradient-to-r from-indigo-650 to-primary-600 hover:from-indigo-550 hover:to-primary-500 text-white font-semibold rounded-xl px-4 py-2.5 flex items-center justify-center space-x-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload Notes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesRepository;
