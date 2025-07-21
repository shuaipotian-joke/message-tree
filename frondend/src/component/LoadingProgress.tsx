interface LoadingProgressProps {
  progress: number;
  message?: string;
}

export default function LoadingProgress({ progress, message = 'Loading...' }: LoadingProgressProps) {
  return (
    <div className="mb-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-200 px-4 py-3 rounded animate-pulse">
      <div className="flex items-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
        <span>{message} {progress}%</span>
      </div>
      <div className="mt-2 w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-1 text-xs text-blue-600 dark:text-blue-300">
        {progress < 30 && "Fetching messages..."}
        {progress >= 30 && progress < 60 && "Processing replies..."}
        {progress >= 60 && progress < 90 && "Building message tree..."}
        {progress >= 90 && "Almost done..."}
      </div>
    </div>
  );
}
