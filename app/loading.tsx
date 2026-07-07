export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#0d1f1f]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2d5a5a]" />
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Loading free movies...
        </p>
      </div>
    </main>
  );
}
