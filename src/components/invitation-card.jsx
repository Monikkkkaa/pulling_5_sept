"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function InvitationCard({ invitation, onRespond }) {
  const [loading, setLoading] = useState(false);

  const handleResponse = async (action) => {
    setLoading(true);
    try {
      await onRespond(invitation._id, action);
    } catch (error) {
      console.error("Response error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
      case 'declined': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
      default: return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20';
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-700/80 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {invitation.event.title}
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {invitation.event.description}
            </p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invitation.status)}`}>
            {invitation.status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            📅 {new Date(invitation.createdAt).toLocaleDateString()}
          </p>
          {invitation.status === 'pending' && (
            <div className="flex gap-2">
              <Button
                onClick={() => handleResponse('decline')}
                disabled={loading}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400"
              >
                ❌ Decline
              </Button>
              <Button
                onClick={() => handleResponse('accept')}
                disabled={loading}
                size="sm"
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
              >
                ✅ Accept
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}