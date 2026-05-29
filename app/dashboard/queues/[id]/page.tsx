"use client";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useRouter, useParams } from "next/navigation";
import { Loader2, AlertTriangle, ArrowLeft, Play, Pause, EllipsisVertical, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { queueApi, Queue, QueueEntry } from "@/features/Queue/services/queue.api";

export default function ManageQueuePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }();
  const queueId = Number(id);

  const [queue, setQueue] = useState<Queue | null>(null);
  const [participants, setParticipants] = useState<QueueEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accepting, setAccepting] = useState<boolean>(false);
  const socketRef = useRef<any>(null);

  // Fetch queue and participants
  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = await queueApi.getById(queueId);
        const p = await queueApi.getParticipants(queueId);
        setQueue(q);
        setParticipants(p);
        setAccepting(q.status === "active");
      } catch (e) {
        console.warn(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (!isNaN(queueId)) fetchData();
  }, [queueId]);

  // Setup socket for real‑time updates
  useEffect(() => {
    if (!queueId) return;
    const socket = io();
    socketRef.current = socket;
    socket.emit("joinQueueRoom", { queueId });
    const refresh = async () => {
      const updated = await queueApi.getById(queueId);
      setQueue(updated);
      const parts = await queueApi.getParticipants(queueId);
      setParticipants(parts);
    };
    socket.on("queueShifted", refresh);
    socket.on("nextServed", refresh);
    socket.on("userPrioritized", refresh);
    socket.on("userJoined", refresh);
    socket.on("userLeft", refresh);
    return () => socket.disconnect();
  }, [queueId]);

  const toggleAccepting = async () => {
    if (!queue) return;
    const newStatus = queue.status === "active" ? "paused" : "active";
    try {
      await queueApi.updateQueueStatus(queue.id, newStatus);
      setQueue({ ...queue, status: newStatus });
      setAccepting(newStatus === "active");
    } catch (e) {
      alert("Failed to update status");
    }
  };

  const serveNext = async () => {
    if (!queue) return;
    try {
      await queueApi.serveNext(queue.id);
      // Participants will be refreshed via socket event
    } catch (e) {
      alert("Failed to serve next");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!queue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <AlertTriangle className="h-12 w-12 text-amber-500" />
        <p className="ml-4 text-lg">Queue not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button onClick={() => router.back()} className="flex items-center text-gray-600 mb-4">
        <ArrowLeft className="h-5 w-5 mr-2" /> Back
      </button>

      <div className="bg-white rounded-3xl shadow p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{queue.name}</h1>
        <p className="text-gray-500">{queue.description}</p>
        <div className="flex items-center mt-4 space-x-4">
          <span className="font-medium">Status:</span>
          <span className={queue.status === "active" ? "text-green-600" : "text-yellow-600"}>{queue.status}</span>
          <button onClick={toggleAccepting} className="ml-4 px-3 py-1 bg-blue-50 text-blue-600 rounded">
            {accepting ? "Pause Queue" : "Resume Queue"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Waiting List</h2>
          <button onClick={serveNext} className="flex items-center bg-primary-600 text-white px-4 py-2 rounded">
            <Play className="h-4 w-4 mr-2" /> Serve Next
          </button>
        </div>
        {participants.length === 0 ? (
          <p className="text-gray-500">No participants waiting.</p>
        ) : (
          <ul className="space-y-3">
            {participants.map((p) => (
              <li key={p.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{p.user?.name || `User #${p.userId}`}</p>
                  <p className="text-sm text-gray-500">Joined {new Date(p.joinedAt).toLocaleTimeString()}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm" onClick={async () => {
                    try {
                      await queueApi.prioritizeUser(queue.id, p.userId, 1);
                    } catch (e) {
                      alert("Failed to prioritize");
                    }
                  }}>
                    <ArrowLeft className="h-3 w-3" /> Move Front
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
