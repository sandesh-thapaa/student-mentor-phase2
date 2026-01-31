import { useState, useEffect, ChangeEvent } from 'react';
import { Search, Users, FileText, UserPlus, Edit, Plus, Loader2 } from 'lucide-react';
import { useMentor } from '../../../context/MentorContext';
import type { Course } from '../types';

const MyCourses = () => {
  const { dashboard } = useMentor();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dashboard?.mentor?.courses) {
      setLoading(false);
    }
  }, [dashboard]);


  const courses: Course[] = dashboard?.mentor?.courses || [];

  const tabs = [
    { id: 'all', label: 'All Courses', count: courses.length },
    { id: 'active', label: 'Active', count: courses.filter(c => !c.url).length },
    { id: 'archived', label: 'Archived', count: courses.filter(c => !!c.url).length },
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || (activeTab === 'active' && !course.url) || (activeTab === 'archived' && !!course.url);
    return matchesSearch && matchesTab;
  });

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  if (loading) {
    return <div className='flex items-center justify-center h-screen'><Loader2 className='animate-spin' /></div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Assigned Courses</h1>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">
                Manage your curriculum, track student progress, and organize your teaching schedule.
              </p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto">
              <Plus size={20} />
              <span className="sm:inline">Create New Course</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative flex-1 max-w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by course title or ID..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md transition-colors text-sm ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span className="hidden sm:inline">{tab.label} </span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]} </span>
                    ({tab.count})
                  </button>
                ))}
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-sm">
                <span>Sort by</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredCourses.map(course => (
            <div key={course.course_id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-40 sm:h-48">
                <div className="absolute top-3 right-3">
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium`}>
                    {course.course_id}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">{course.title}</h3>
                {course.description && <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-4 border-t border-gray-200">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    View Details
                  </button>
                  <div className="flex gap-2">
                    <button className="flex-1 sm:flex-none p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <UserPlus size={18} className="text-gray-600 mx-auto" />
                    </button>
                    <button className="flex-1 sm:flex-none p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Edit size={18} className="text-gray-600 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer min-h-[300px]">
            <div className="h-full flex flex-col items-center justify-center p-6 sm:p-8 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Plus size={24} className="sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Add New Course</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
