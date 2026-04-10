export default function LoadingSpinner({ size = "md", text = "로딩 중..." }) {
  const sizes = { sm: "h-6 w-6", md: "h-10 w-10", lg: "h-16 w-16" };
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div
        className={`${sizes[size]} border-4 border-gaming-border border-t-gaming-accent rounded-full animate-spin`}
      />
      {text && <p className="text-gaming-muted text-sm">{text}</p>}
    </div>
  );
}
