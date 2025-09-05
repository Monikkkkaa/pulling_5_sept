"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EventCard({
  event,
  actionLabel = "View",
  hrefBase = "/events",
}) {
  const firstDate = event?.dateOptions?.[0];
  const dateText = firstDate
    ? (firstDate.label || new Date(firstDate).toLocaleString())
    : "No dates";
  return (
    <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-700/80 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:scale-[1.02] group">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
          {event.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p className="text-slate-600 dark:text-slate-300 line-clamp-2">{event.description}</p>
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            📅 {event.dateOptions?.length || 0} options
          </span>
          <span className="flex items-center gap-1">
            🕰️ {dateText}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-3">
        <Link href={`${hrefBase}/${event.id}`} className="w-full">
          <Button 
            size="sm" 
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            {actionLabel}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
