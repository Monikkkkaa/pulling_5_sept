"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function InviteMembersForm({ isOpen, onClose, onSubmit, eventId, creatorId }) {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      setFetchingUsers(true);
      const token = localStorage.getItem("pp_token");
      const response = await fetch("/api/users/all-users", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) throw new Error("Failed to fetch users");
      
      const result = await response.json();
      const filteredUsers = result.data.filter(user => user._id !== creatorId);
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to load users");
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleUserToggle = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedUsers.length === 0) {
      alert("Please select at least one user to invite");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(selectedUsers);
      setSelectedUsers([]);
      onClose();
    } catch (error) {
      console.error("Invitation error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/95 backdrop-blur-md dark:bg-slate-800/95 animate-slide-in max-h-[80vh] overflow-hidden">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
            <span className="text-2xl">👥</span>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Invite Members
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                📧 Select Users to Invite
              </Label>
              
              {fetchingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                  <span className="ml-3 text-slate-600 dark:text-slate-300">Loading users...</span>
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto space-y-2 border rounded-lg p-3 bg-slate-50 dark:bg-slate-700/50">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <div key={user._id} className="flex items-center space-x-3 p-2 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-colors">
                        <Checkbox
                          id={user._id}
                          checked={selectedUsers.includes(user._id)}
                          onCheckedChange={() => handleUserToggle(user._id)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={user._id} className="cursor-pointer">
                            <div className="font-medium text-slate-800 dark:text-slate-200">{user.name}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">{user.email}</div>
                          </Label>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-500 dark:text-slate-400 py-4">
                      No users available to invite
                    </p>
                  )}
                </div>
              )}
              
              {selectedUsers.length > 0 && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  ✅ {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-slate-300 text-slate-600 hover:bg-slate-50 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || selectedUsers.length === 0}
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-xl"
              >
                {loading ? "Sending..." : `Send Invitations (${selectedUsers.length})`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}