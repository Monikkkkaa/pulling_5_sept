"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditEventForm({ isOpen, onClose, onSubmit, event }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dateOptions: ["", ""]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event && isOpen) {
      setForm({
        title: event.title || "",
        description: event.description || "",
        dateOptions: event.dateOptions?.map(d => d.label || d) || ["", ""]
      });
    }
  }, [event, isOpen]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (index, value) => {
    setForm(prev => ({
      ...prev,
      dateOptions: prev.dateOptions.map((item, i) => i === index ? value : item)
    }));
  };

  const addOption = () => {
    setForm(prev => ({
      ...prev,
      dateOptions: [...prev.dateOptions, ""]
    }));
  };

  const removeOption = (index) => {
    if (form.dateOptions.length > 2) {
      setForm(prev => ({
        ...prev,
        dateOptions: prev.dateOptions.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const eventData = {
      title: form.title,
      description: form.description,
      dateOptions: form.dateOptions.filter(d => d.trim()).map(d => ({ label: d }))
    };

    try {
      await onSubmit(eventData);
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/95 backdrop-blur-md dark:bg-slate-800/95 animate-slide-in">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
            <span className="text-2xl">✏️</span>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edit Event
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                📝 Event Title
              </Label>
              <Input
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter event title"
                className="h-12 border-2 border-slate-300 dark:border-slate-600 focus:border-blue-500 rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                📄 Description
              </Label>
              <Input
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter event description"
                className="h-12 border-2 border-slate-300 dark:border-slate-600 focus:border-blue-500 rounded-xl"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  📅 Date Options
                </Label>
                <Button
                  type="button"
                  onClick={addOption}
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-300"
                >
                  + Add Date
                </Button>
              </div>
              {form.dateOptions.map((date, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={date}
                    onChange={(e) => handleArrayChange(index, e.target.value)}
                    placeholder="e.g., 2025-01-15 19:00"
                    className="h-10 border-2 border-slate-300 dark:border-slate-600 focus:border-blue-500 rounded-lg"
                  />
                  {form.dateOptions.length > 2 && (
                    <Button
                      type="button"
                      onClick={() => removeOption(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300"
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
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
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl"
              >
                {loading ? "Updating..." : "Update Event"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}