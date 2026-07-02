export default function PageLoading() {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center"
      aria-busy="true"
      aria-label="Yükleniyor"
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"
        role="status"
      />
    </div>
  );
}
