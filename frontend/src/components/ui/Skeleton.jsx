import { motion } from "framer-motion";

export const Skeleton = ({ className, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1,
        ease: "easeInOut",
      }}
      className={`bg-gray-200 dark:bg-slate-800 rounded-md ${className}`}
      {...props}
    />
  );
};

export const TableSkeleton = ({ rows = 5, columns = 5 }) => {
  return (
    <div className="w-full">
      <div className="flex border-b border-gray-200 dark:border-gray-800 pb-3 mb-3">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="flex-1 px-4">
            <Skeleton className="h-6 w-3/4" />
          </div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex border-b border-gray-100 dark:border-gray-800/50 py-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="flex-1 px-4 flex items-center">
              {colIndex === 0 ? (
                <div className="flex items-center gap-3 w-full">
                  <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                  <Skeleton className="h-5 w-full max-w-[150px]" />
                </div>
              ) : (
                <Skeleton className={`h-5 w-full ${colIndex === columns - 1 ? 'max-w-[80px]' : 'max-w-[120px]'}`} />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <Skeleton className="h-40 w-full rounded-xl mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
    </div>
  );
};
