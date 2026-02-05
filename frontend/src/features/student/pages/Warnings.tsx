import React, { useState } from "react";
import { AlertCircle, Calendar, User, CheckCircle, X } from "lucide-react";
import { useStudent } from "../../../context/StudentContext";
import moment from "moment";
import type { Warning, WarningsResponse } from "../../auth/types/warning";

interface ResolveModalState {
  isOpen: boolean;
  warningId: string | null;
  comment: string;
  isSubmitting: boolean;
}

const StudentWarnings: React.FC = () => {
  const { warning, resolveWarningAction } = useStudent();
  const [modalState, setModalState] = useState<ResolveModalState>({
    isOpen: false,
    warningId: null,
    comment: "",
    isSubmitting: false,
  });

  const data = warning as unknown as WarningsResponse;

  const activeWarnings =
    data?.warnings?.filter((w: Warning) => w.status === "ACTIVE") || [];
  const resolvedWarnings =
    data?.warnings?.filter((w: Warning) => w.status === "RESOLVED") || [];

  const handleOpenModal = (warningId: string): void => {
    setModalState({
      isOpen: true,
      warningId,
      comment: "",
      isSubmitting: false,
    });
  };

  const handleCloseModal = (): void => {
    setModalState({
      isOpen: false,
      warningId: null,
      comment: "",
      isSubmitting: false,
    });
  };

  const handleResolveWarning = async (): Promise<void> => {
    if (!modalState.warningId || !modalState.comment.trim()) {
      return;
    }

    setModalState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      await resolveWarningAction(modalState.warningId, modalState.comment);
      handleCloseModal();
    } catch (err) {
      console.error("Failed to resolve warning:", err);
    } finally {
      setModalState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

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
                  <button
                    onClick={() => handleOpenModal(w.id)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    Resolve
                  </button>
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

      {/* Resolve Modal */}
      {modalState.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                Resolve Warning
              </h3>
              <button
                onClick={handleCloseModal}
                disabled={modalState.isSubmitting}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  value={modalState.comment}
                  onChange={(e) =>
                    setModalState((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  disabled={modalState.isSubmitting}
                  placeholder="Please explain how you've addressed this warning..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none disabled:bg-gray-50"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCloseModal}
                  disabled={modalState.isSubmitting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolveWarning}
                  disabled={
                    modalState.isSubmitting || !modalState.comment.trim()
                  }
                  className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {modalState.isSubmitting ? "Resolving..." : "Resolve"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentWarnings;
