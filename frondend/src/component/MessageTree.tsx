import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { messageApi } from "../utils/api";
import MessageForm from "./MessageForm";
import LoadingProgress from "./LoadingProgress";
import type { Message } from "../types";

interface MessageItemProps {
  message: Message;
  level: number;
  onRefresh: () => void;
  expandedAll: boolean;
  isExpanding?: boolean;
}

function MessageItem({
  message,
  level,
  onRefresh,
  expandedAll,
  isExpanding,
}: MessageItemProps) {
  const { isAuthenticated } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [children, setChildren] = useState<Message[]>([]);
  const [showChildren, setShowChildren] = useState(false);

  useEffect(() => {
    if (expandedAll && children.length > 0) {
      setShowChildren(true);
    }
  }, [expandedAll, children.length]);

  useEffect(() => {
    if (message.children && message.children.length > 0) {
      setChildren(message.children);
      if (expandedAll) {
        setShowChildren(true);
      }
    } else if (!expandedAll) {
      setChildren([]);
      setShowChildren(false);
    }
  }, [message.children, expandedAll]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleString();
    } catch (error) {
      console.error("Date formatting error:", error, "Input:", dateString);
      return "Invalid date";
    }
  };

  const loadChildren = async () => {
    if (showChildren) {
      setShowChildren(false);
      return;
    }

    if (children.length > 0) {
      setShowChildren(true);
      return;
    }

    const childMessages = await messageApi.getChildren(message.id);
    setChildren(childMessages);
    setShowChildren(true);
  };

  const handleReplySuccess = async () => {
    setShowReplyForm(false);

    try {
      const childMessages = await messageApi.getChildren(message.id);
      setChildren(childMessages);
      setShowChildren(true);

      if (childMessages.length > 0) {
        message.hasChildren = true;
      }
    } catch (error) {
      console.error("Failed to reload children after reply:", error);
    }

    // onRefresh();
  };

  return (
    <div className="border-l-2 border-primary pl-4 animate-slide-in">
      <div className="bg-secondary glass hover-lift shadow-secondary rounded-lg border border-primary p-4 mb-3 transition-all duration-300">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-primary">
              {message.user.username}
            </span>
            <span className="text-sm text-secondary">
              ({message.user.email})
            </span>
          </div>
          <span className="text-sm text-secondary">
            {formatDate(message.createdAt)}
          </span>
        </div>

        <p className="text-primary mb-3 whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>

        <div className="flex gap-2">
          {isAuthenticated && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-accent hover:text-blue-600 dark:hover:text-blue-300 text-sm font-medium transition-colors hover-lift"
            >
              {showReplyForm ? "Cancel" : "Reply"}
            </button>
          )}

          {(message.hasChildren || children.length > 0) && (
            <button
              onClick={loadChildren}
              className="text-secondary hover:text-primary text-sm font-medium transition-colors hover-lift"
            >
              {showChildren ? "Hide Replies" : "Show Replies"}
            </button>
          )}
        </div>
      </div>

      {showReplyForm && (
        <div className="ml-4 mb-4 animate-fade-in">
          <MessageForm
            parentId={message.id}
            onSuccess={handleReplySuccess}
            onCancel={() => setShowReplyForm(false)}
            placeholder="Write your reply..."
          />
        </div>
      )}

      {showChildren && children.length > 0 && (
        <div className="ml-4 animate-slide-down">
          {children.map((child, index) => (
            <div
              key={child.id}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="animate-fade-in"
            >
              <MessageItem
                message={child}
                level={level + 1}
                onRefresh={onRefresh}
                expandedAll={expandedAll}
                isExpanding={isExpanding}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MessageTree() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedAll, setExpandedAll] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [expandProgress, setExpandProgress] = useState(0);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await messageApi.getAllMessages();
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleExpandAll = async () => {
    if (expandedAll) {
      setExpandedAll(false);
      setExpandProgress(0);
      await loadMessages();
      return;
    }

    try {
      setIsExpanding(true);
      setExpandProgress(0);

      const stages = [
        { progress: 10, delay: 100 },
        { progress: 25, delay: 200 },
        { progress: 45, delay: 300 },
        { progress: 65, delay: 400 },
        { progress: 85, delay: 500 },
        { progress: 95, delay: 200 },
      ];

      const dataPromise = messageApi.getAllMessagesWithTree();

      for (const stage of stages) {
        await new Promise((resolve) => setTimeout(resolve, stage.delay));
        setExpandProgress(stage.progress);
      }

      const data = await dataPromise;
      setExpandProgress(100);

      setTimeout(() => {
        setMessages(data);
        setExpandedAll(true);
        setIsExpanding(false);
        setExpandProgress(0);
      }, 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load full tree");
      setIsExpanding(false);
      setExpandProgress(0);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-secondary animate-pulse">Loading messages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4 animate-shake">
        <p>Error: {error}</p>
        <button
          onClick={loadMessages}
          className="mt-2 btn btn-primary hover-lift text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary animate-fade-in">
            Messages
          </h2>
          {!expandedAll && (
            <p className="text-sm text-secondary mt-1">
              Showing first-level messages only. Click "Expand All" to see all
              replies.
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExpandAll}
            disabled={isExpanding}
            className={`btn btn-secondary hover-lift text-sm animate-fade-in ${
              isExpanding ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isExpanding
              ? `Expanding... ${expandProgress}%`
              : expandedAll
              ? "Collapse All"
              : "Expand All"}
          </button>
          <button
            onClick={loadMessages}
            disabled={isExpanding}
            className={`btn btn-primary hover-lift text-sm animate-fade-in ${
              isExpanding ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Refresh
          </button>
        </div>
      </div>

      {isExpanding && (
        <div className="mb-4">
          <LoadingProgress
            progress={expandProgress}
            message="Loading all messages and replies..."
          />
        </div>
      )}

      {messages.length === 0 ? (
        <div className="text-center py-8 text-secondary animate-bounce-in">
          <div className="text-4xl mb-4"></div>
          <p>No messages yet. Be the first to post!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="animate-slide-up"
            >
              <MessageItem
                message={message}
                level={0}
                onRefresh={loadMessages}
                expandedAll={expandedAll}
                isExpanding={isExpanding}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
