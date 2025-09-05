"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateEventForm({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    question: "",
    dateOptions: ["", ""],
    pollOptions: ["", ""]
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addOption = (field) => {
    setForm(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  const removeOption = (field, index) => {
    if (form[field].length > 2) {
      setForm(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Title validation
    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    } else if (form.title.length > 200) {
      newErrors.title = "Title must be 200 characters or less";
    }
    
    // Description validation
    if (form.description.length > 2000) {
      newErrors.description = "Description must be 2000 characters or less";
    }
    
    // Question validation
    if (!form.question.trim()) {
      newErrors.question = "Poll question is required";
    }
    
    // Date options validation
    const validDateOptions = form.dateOptions.filter(d => d.trim());
    if (validDateOptions.length < 1) {
      newErrors.dateOptions = "At least 1 date option is required";
    }
    
    // Poll options validation
    const validPollOptions = form.pollOptions.filter(o => o.trim());
    if (validPollOptions.length < 2) {
      newErrors.pollOptions = "At least 2 poll options are required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    const eventData = {
      title: form.title.trim(),
      description: form.description.trim(),
      dateOptions: form.dateOptions.filter(d => d.trim()).map(d => ({ label: d.trim() })),
      poll: {
        question: form.question.trim(),
        options: form.pollOptions.filter(o => o.trim()).map(o => ({ label: o.trim() }))
      },
      participants: []
    };

    try {
      await onSubmit(eventData);
      setForm({
        title: "",
        description: "",
        question: "",
        dateOptions: ["", ""],
        pollOptions: ["", ""]
      });
      setErrors({});
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
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
            <span className="text-2xl">✨</span>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Create New Event
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
                className={`h-12 border-2 ${errors.title ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} focus:border-purple-500 rounded-xl`}
                required
              />
              {errors.title && (
                <p className="text-sm text-red-600 dark:text-red-400">⚠️ {errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                📄 Description
              </Label>
              <Input
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter event description"
                className={`h-12 border-2 ${errors.description ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} focus:border-purple-500 rounded-xl`}
              />
              {errors.description && (
                <p className="text-sm text-red-600 dark:text-red-400">⚠️ {errors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                ❓ Poll Question
              </Label>
              <Input
                value={form.question}
                onChange={(e) => handleChange("question", e.target.value)}
                placeholder="Enter poll question"
                className={`h-12 border-2 ${errors.question ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} focus:border-purple-500 rounded-xl`}
                required
              />
              {errors.question && (
                <p className="text-sm text-red-600 dark:text-red-400">⚠️ {errors.question}</p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  📅 Date Options
                </Label>
                <Button
                  type="button"
                  onClick={() => addOption("dateOptions")}
                  variant="outline"
                  size="sm"
                  className="text-purple-600 border-purple-300"
                >
                  + Add Date
                </Button>
              </div>
              {form.dateOptions.map((date, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={date}
                    onChange={(e) => handleArrayChange("dateOptions", index, e.target.value)}
                    placeholder="e.g., 2025-01-15 19:00"
                    className="h-10 border-2 border-slate-300 dark:border-slate-600 focus:border-purple-500 rounded-lg"
                  />
                  {form.dateOptions.length > 2 && (
                    <Button
                      type="button"
                      onClick={() => removeOption("dateOptions", index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300"
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
              {errors.dateOptions && (
                <p className="text-sm text-red-600 dark:text-red-400">⚠️ {errors.dateOptions}</p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  🗳️ Poll Options
                </Label>
                <Button
                  type="button"
                  onClick={() => addOption("pollOptions")}
                  variant="outline"
                  size="sm"
                  className="text-purple-600 border-purple-300"
                >
                  + Add Option
                </Button>
              </div>
              {form.pollOptions.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => handleArrayChange("pollOptions", index, e.target.value)}
                    placeholder="Enter poll option"
                    className="h-10 border-2 border-slate-300 dark:border-slate-600 focus:border-purple-500 rounded-lg"
                  />
                  {form.pollOptions.length > 2 && (
                    <Button
                      type="button"
                      onClick={() => removeOption("pollOptions", index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300"
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
              {errors.pollOptions && (
                <p className="text-sm text-red-600 dark:text-red-400">⚠️ {errors.pollOptions}</p>
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
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl"
              >
                {loading ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}