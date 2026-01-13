import React from "react";
import { AlertCircle, Calendar, User, CheckCircle } from "lucide-react";
import { useStudent } from "../../../context/StudentContext";
import moment from "moment";
import type { Warning, WarningsResponse } from "../../auth/types/warning";

const StudentWarnings: React.FC = () => {
  const { warning } = useStudent();
  const data = warning as unknown as WarningsResponse;

  const activeWarnings =
    data?.warnings?.filter((w: Warning) => w.status === "ACTIVE") || [];
  const resolvedWarnings =
    data?.warnings?.filter((w: Warning) => w.status === "RESOLVED") || [];

  return (
    <div className="bg-gray-50 p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Student Warnings
            </h1>
            <p className="text-gray-600 mt-1">
              Review active and past warnings issued by your mentor. ok.
            </p>
          </div>

          {activeWarnings.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-red-600">
                {activeWarnings.length} Active Warnings
              </span>
            </div>
          )}
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h2 className="text-sm font-semibold text-gray-600 uppercase">
              Active Warnings
            </h2>
          </div>

          {activeWarnings.length > 0 ? (
            activeWarnings.map((w: Warning) => (
              <div
                key={w.id}
                className="bg-white border-l-4 border-red-500 rounded-xl p-6 shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {w.title}
                        </h3>
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase rounded-full">
                          {w.level}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 text-sm">{w.remark}</p>
                      <div className="flex flex-wrap gap-6 text-xs text-gray-500">
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {moment(w.createdAt).format("DD MMM YYYY")}
                        </span>
                        <span className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          By: {w.mentor?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-dashed rounded-xl p-10 text-center text-gray-500">
              No active warnings. ok.
            </div>
          )}
        </section>

        {resolvedWarnings.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-600 uppercase mb-4">
              Resolved Warnings
            </h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
              <table className="min-w-full divide-y">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">
                      Issue
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">
                      Level
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {resolvedWarnings.map((w: Warning) => (
                    <tr key={w.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {w.title}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {w.level}
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                          <CheckCircle className="w-3 h-3" /> RESOLVED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default StudentWarnings;
