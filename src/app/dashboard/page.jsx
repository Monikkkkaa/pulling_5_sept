"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Navbar from "@/components/navbar";
import EventCard from "@/components/event-card";
import CreateEventForm from "@/components/create-event-form";
import InvitationCard from "@/components/invitation-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("pp_token");
    if (!token) router.replace("/login");
    setMounted(true);
  }, [router]);

  const fetcher = async (url) => {
    const token = localStorage.getItem("pp_token");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch");
    return response.json();
  };

  const {
    data: created,
    error: createdErr,
    isLoading: createdLoading,
    mutate: mutCreated,
  } = useSWR("/api/events?scope=created", fetcher);
  const {
    data: invitations,
    error: invitedErr,
    isLoading: invitedLoading,
    mutate: mutInvited,
  } = useSWR("/api/invitations", fetcher);
  const {
    data: invitedEvents,
    error: invitedEventsErr,
    isLoading: invitedEventsLoading,
    mutate: mutInvitedEvents,
  } = useSWR("/api/events?scope=invited", fetcher);

  const handleCreateEvent = async (eventData) => {
    try {
      const token = localStorage.getItem("pp_token");
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create event");
      }

      mutCreated();
    } catch (e) {
      console.error("Create event error:", e);
      alert(e.message);
      throw e;
    }
  };

  const handleInvitationResponse = async (invitationId, action) => {
    try {
      const token = localStorage.getItem("pp_token");
      const response = await fetch(`/api/invitations/${invitationId}/respond`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to respond to invitation");
      }

      mutInvited();
    } catch (e) {
      console.error("Invitation response error:", e);
      alert(e.message);
      throw e;
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-blue-400/20 animate-pulse-glow"></div>
      <div className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-float"></div>
      <div
        className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full opacity-15 animate-float"
        style={{ animationDelay: "4s" }}
      ></div>
      <div
        className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-gradient-to-r from-blue-400 to-pink-400 rounded-full opacity-10 animate-float"
        style={{ animationDelay: "1s" }}
      ></div>

      <Navbar />
      <section
        className={`relative mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 grid gap-6 lg:gap-8 ${
          mounted ? "animate-fade-in" : "opacity-0"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-slide-in">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Welcome{user ? `, ${user.name}` : ""} 👋
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Manage your polls and participate in community decisions
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center gap-2"
          >
            ✨ Create New Event
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <Card
            className="shadow-2xl border-0 bg-white/90 backdrop-blur-md dark:bg-slate-800/90 transition-all duration-500 hover:shadow-purple-500/25 hover:scale-[1.02] animate-slide-in"
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                🗳️ Your Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              {createdLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                  <span className="ml-3 text-slate-600 dark:text-slate-300">
                    Loading your events...
                  </span>
                </div>
              ) : createdErr ? (
                <div className="p-4 text-red-600 bg-red-50/80 dark:bg-red-900/30 dark:text-red-300 rounded-xl border-l-4 border-red-500 backdrop-blur-sm">
                  ⚠️ {createdErr.message}
                </div>
              ) : (
                <div className="grid gap-4">
                  {created?.events?.length ? (
                    created.events.map((e, index) => (
                      <div
                        key={e._id}
                        className="animate-slide-in"
                        style={{ animationDelay: `${0.1 * index}s` }}
                      >
                        <EventCard
                          event={{ ...e, id: e._id }}
                          actionLabel="📊 View Results"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 space-y-3">
                      <div className="text-6xl opacity-50">📝</div>
                      <p className="text-slate-600 dark:text-slate-400">
                        No events yet. Create your first poll!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card
            className="shadow-2xl border-0 bg-white/90 backdrop-blur-md dark:bg-slate-800/90 transition-all duration-500 hover:shadow-purple-500/25 hover:scale-[1.02] animate-slide-in"
            style={{ animationDelay: "0.4s" }}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                📬 Invitations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {invitedLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <span className="ml-3 text-slate-600 dark:text-slate-300">
                    Loading invitations...
                  </span>
                </div>
              ) : invitedErr ? (
                <div className="p-4 text-red-600 bg-red-50/80 dark:bg-red-900/30 dark:text-red-300 rounded-xl border-l-4 border-red-500 backdrop-blur-sm">
                  ⚠️ {invitedErr.message}
                </div>
              ) : (
                <div className="grid gap-4">
                  {invitations?.invitations?.length ? (
                    invitations.invitations.map((invitation, index) => (
                      <div
                        key={invitation._id}
                        className="animate-slide-in"
                        style={{ animationDelay: `${0.1 * index}s` }}
                      >
                        <InvitationCard
                          invitation={invitation}
                          onRespond={handleInvitationResponse}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 space-y-3">
                      <div className="text-6xl opacity-50">📭</div>
                      <p className="text-slate-600 dark:text-slate-400">
                        No invitations yet. Check back later!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card
            className="shadow-2xl border-0 bg-white/90 backdrop-blur-md dark:bg-slate-800/90 transition-all duration-500 hover:shadow-purple-500/25 hover:scale-[1.02] animate-slide-in"
            style={{ animationDelay: "0.6s" }}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
                🗳️ Invited Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              {invitedEventsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                  <span className="ml-3 text-slate-600 dark:text-slate-300">
                    Loading events...
                  </span>
                </div>
              ) : invitedEventsErr ? (
                <div className="p-4 text-red-600 bg-red-50/80 dark:bg-red-900/30 dark:text-red-300 rounded-xl border-l-4 border-red-500 backdrop-blur-sm">
                  ⚠️ {invitedEventsErr.message}
                </div>
              ) : (
                <div className="grid gap-4">
                  {invitedEvents?.events?.length ? (
                    invitedEvents.events.map((e, index) => (
                      <div
                        key={e._id}
                        className="animate-slide-in"
                        style={{ animationDelay: `${0.1 * index}s` }}
                      >
                        <EventCard
                          event={{ ...e, id: e._id }}
                          actionLabel="🗳️ Vote Now"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 space-y-3">
                      <div className="text-6xl opacity-50">📋</div>
                      <p className="text-slate-600 dark:text-slate-400">
                        No events to vote on yet!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <CreateEventForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateEvent}
      />
    </main>
  );
}
