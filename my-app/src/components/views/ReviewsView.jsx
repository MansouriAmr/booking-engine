import React from 'react';
import { Star, Award, MessageSquare, ThumbsUp } from 'lucide-react';

export default function ReviewsView({ appointments, darkMode }) {
  const reviews = appointments.filter((a) => a.review_status === 'Sent');
  const totalReviews = reviews.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#111623] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Score</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black">5.0</div>
        </div>

        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#111623] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Requests Sent</span>
            <MessageSquare className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black">{totalReviews}</div>
        </div>

        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#111623] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Satisfaction Rate</span>
            <ThumbsUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black">100%</div>
        </div>
      </div>
    </div>
  );
}