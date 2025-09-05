"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Navbar from "@/components/navbar";
import EditEventForm from "@/components/edit-event-form";
import InviteMembersForm from "@/components/invite-members-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";

export default function EventPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useSelector((state) => state.auth);
  const { id } = params || {};
  const [selected, setSelected] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("pp_token");
    if (!token) router.replace("/login");
    setMounted(true);
  }, [router]);

  const fetcher = async (url) => {
    const token = localStorage.getItem("pp_token");
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch");
    return response.json();
  };

  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/events/${id}` : null,
    fetcher
  );
  const { data: resultsData, mutate: mutateResults } = useSWR(
    id ? `/api/events/${id}/results` : null,
    fetcher
  );

  const canVote = useMemo(() => {
    if (!data?.event || !user) return false;
    const isCreator = data.event.creator === user.id;
    const isParticipant = data.event.participants?.includes(user.id);
    return !isCreator && isParticipant;
  }, [data, user]);

  const isCreator = useMemo(() => {
    if (!data?.event || !user) return false;
    return data.event.creator === user.id;
  }, [data, user]);

  const submitVote = async () => {
    if (selected == null) return;
    try {
      const selectedOption = pollOptions[Number(selected)];
      if (!selectedOption) throw new Error("Invalid option selected");
      
      const token = localStorage.getItem("pp_token");
      const response = await fetch(`/api/events/${id}/votes`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ optionId: selectedOption._id }),
      });
      if (!response.ok) throw new Error("Failed to vote");
      await mutate();
      await mutateResults();
      setSelected(null);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleEdit = async (eventData) => {
    try {
      const token = localStorage.getItem("pp_token");
      const response = await fetch(`/api/events/${id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) throw new Error("Failed to update event");
      await mutate();
    } catch (e) {
      alert(e.message);
      throw e;
    }
  };

  const handleInvite = async (userIds) => {
    try {
      const token = localStorage.getItem("pp_token");
      const response = await fetch(`/api/events/${id}/invitations`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIds }),
      });
      if (!response.ok) throw new Error("Failed to send invitations");
      alert(`Invitations sent to ${userIds.length} user${userIds.length !== 1 ? 's' : ''}!`);
    } catch (e) {
      alert(e.message);
      throw e;
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const token = localStorage.getItem("pp_token");
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to delete event");
      
      // Clear SWR cache and redirect
      window.location.href = "/dashboard";
    } catch (e) {
      alert(e.message);
    }
  };

  const refresh = () => {
    mutate();
    mutateResults();
  };

  if (!mounted) return null;

  if (isLoading)
    return (
      <main className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-blue-400/20 animate-pulse-glow"></div>
        <Navbar />
        <section className="relative mx-auto max-w-3xl p-6 flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <span className="ml-3 text-slate-600 dark:text-slate-300">Loading event...</span>
        </section>
      </main>
    );
  if (error)
    return (
      <main className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-blue-400/20 animate-pulse-glow"></div>
        <Navbar />
        <section className="relative mx-auto max-w-3xl p-6">
          <div className="p-4 text-red-600 bg-red-50/80 dark:bg-red-900/30 dark:text-red-300 rounded-xl border-l-4 border-red-500 backdrop-blur-sm">
            ⚠️ {error.message}
          </div>
        </section>
      </main>
    );

  const event = data?.event;
  const pollOptions = event?.poll?.options || [];
  const results = resultsData?.results;
  const totalVotes = results?.totalVotes || 0;

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-blue-400/20 animate-pulse-glow"></div>
      <Navbar />
      <section className="relative mx-auto max-w-4xl p-4 sm:p-6 lg:p-8 grid gap-6 animate-fade-in">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-md dark:bg-slate-800/90">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {event.title}
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-300">{event.description}</p>
              </div>
              {isCreator && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowInviteForm(true)}
                    variant="outline"
                    size="sm"
                    className="border-green-300 text-green-600 hover:bg-green-50 dark:border-green-600 dark:text-green-400"
                  >
                    👥 Invite
                  </Button>
                  <Button
                    onClick={() => setShowEditForm(true)}
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400"
                  >
                    ✏️ Edit
                  </Button>
                  <Button
                    onClick={handleDelete}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400"
                  >
                    🗑️ Delete
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="grid gap-6">

            {canVote && (
              <div className="grid gap-3">
                <Label className="font-medium text-slate-700 dark:text-slate-200">
                  🗳️ {event.poll?.question || "Vote for your choice"}
                </Label>
                <RadioGroup
                  value={String(selected ?? "")}
                  onValueChange={(v) => setSelected(v)}
                  className="grid gap-2"
                >
                  {pollOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <RadioGroupItem id={`opt-${idx}`} value={String(idx)} />
                      <Label htmlFor={`opt-${idx}`} className="text-slate-600 dark:text-slate-300">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <Button 
                  onClick={submitVote} 
                  disabled={selected == null}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  🗳️ Submit Vote
                </Button>
              </div>
            )}

            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label className="font-medium">Poll results</Label>
                <Button variant="outline" size="sm" onClick={refresh}>
                  Refresh
                </Button>
              </div>
              <div className="grid gap-3">
                {results?.totals?.map((result, idx) => {
                  const pct = totalVotes ? Math.round((result.votes / totalVotes) * 100) : 0;
                  return (
                    <div key={idx} className="grid gap-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{result.label}</span>
                        <span className="text-slate-500 dark:text-slate-400">
                          {result.votes} vote{result.votes !== 1 ? "s" : ""} ({pct}%)
                        </span>
                      </div>
                      <Progress value={pct} className="h-2" />
                    </div>
                  );
                }) || (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No poll results available.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      <EditEventForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSubmit={handleEdit}
        event={event}
      />
      
      <InviteMembersForm
        isOpen={showInviteForm}
        onClose={() => setShowInviteForm(false)}
        onSubmit={handleInvite}
        eventId={id}
        creatorId={user?.id}
      />
    </main>
  );
}
