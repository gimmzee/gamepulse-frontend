import { useState } from "react";
import { registerAlert } from "../api/gameApi";
import { formatPrice } from "../utils/formatters";

export default function AlertForm({ appId, currentPrice }) {
  const [email, setEmail] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !targetPrice) return;

    setStatus("loading");
    setErrMsg("");
    try {
      await registerAlert(appId, Number(targetPrice), email);
      setStatus("success");
      setEmail("");
      setTargetPrice("");
    } catch (err) {
      setStatus("error");
      setErrMsg(err?.response?.data?.message || "알림 등록에 실패했습니다.");
    }
  };

  return (
    <div className="bg-gaming-card border border-gaming-border rounded-xl p-5">
      <h3 className="font-bold text-gaming-text mb-1 flex items-center gap-2">
        <span>🔔</span> 최저가 알림 등록
      </h3>
      <p className="text-gaming-muted text-sm mb-4">
        목표 가격 이하로 내려가면 이메일로 알려드립니다.
      </p>

      {status === "success" ? (
        <div className="flex items-center gap-2 text-gaming-green font-semibold py-3">
          <span>✅</span> 알림이 등록되었습니다!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gaming-muted block mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="input-gaming text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gaming-muted block mb-1">
              목표 가격{" "}
              {currentPrice && (
                <span className="text-gaming-accent ml-1">
                  (현재: {formatPrice(currentPrice)})
                </span>
              )}
            </label>
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="예: 15000"
              required
              min={0}
              className="input-gaming text-sm"
            />
          </div>
          {status === "error" && (
            <p className="text-gaming-red text-sm">{errMsg}</p>
          )}
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "등록 중..." : "알림 등록"}
          </button>
        </form>
      )}
    </div>
  );
}
