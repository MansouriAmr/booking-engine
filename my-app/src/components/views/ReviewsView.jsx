import React from 'react';
import { Star, MessageSquare, ThumbsUp, Award } from 'lucide-react';

export default function ReviewsView({ appointments = [], darkMode, t }) {
  // Calculate dynamic values if needed, or keep fallbacks
  const completedCount = appointments.filter(a => a.status === 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Average Score */}
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#111623] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
              {t?.averageScore || "AVERAGE SCORE"}
            </span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold mt-3">5.0</p>
        </div>

        {/* Total Requests Sent */}
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#111623] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
              {t?.totalRequestsSent || "TOTAL REQUESTS SENT"}
            </span>
            <MessageSquare className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-extrabold mt-3">{completedCount}</p>
        </div>

        {/* Satisfaction Rate */}
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#111623] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
              {t?.satisfactionRate || "SATISFACTION RATE"}
            </span>
            <ThumbsUp className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold mt-3">100%</p>
        </div>
      </div>

      {/* Reviews List Section */}
      <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#111623] border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="text-sm font-bold mb-4">{t?.recentReviews || "Recent Reviews"}</h3>
        <p className="text-xs text-slate-400">{t?.noReviewsYet || "No reviews received yet."}</p>
      </div>
    </div>
  );
}