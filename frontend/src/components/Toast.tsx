type ToastProps = {
    visible: boolean;
    message: string | null;
  };
  
  export default function Toast({ visible, message }: ToastProps) {
    if (!visible || !message) return null;
  
    return (
      <div
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          background: "#111827",
          color: "#ffffff",
          padding: "10px 14px",
          borderRadius: 8,
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          zIndex: 9999,
          maxWidth: 320,
          fontSize: 14,
        }}
      >
        {message}
      </div>
    );
  }