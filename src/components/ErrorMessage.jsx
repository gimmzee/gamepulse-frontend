export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="text-5xl">⚠️</div>
      <p className="text-gaming-red font-semibold text-lg">{message || "오류가 발생했습니다."}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-2">
          다시 시도
        </button>
      )}
    </div>
  );
}
