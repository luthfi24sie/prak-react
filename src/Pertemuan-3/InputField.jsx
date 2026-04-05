export default function InputField({
  label,
  value = "",
  onChange,
  error,
  type = "text",
  placeholder = ""
}) {
  return (
    <div style={{ marginBottom: "18px" }}>
      
      {/* LABEL */}
      <label
        style={{
          display: "block",
          marginBottom: "6px",
          fontWeight: "500",
          color: "#333"
        }}
      >
        {label}
      </label>

      {/* INPUT */}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "6px",
          border: error ? "1px solid #e53935" : "1px solid #ccc",
          outline: "none",
          boxSizing: "border-box"
        }}
      />

      {/* ERROR ALERT */}
      {error && (
        <div
          style={{
            background: "#ffe5e5",
            color: "#b71c1c",
            padding: "8px",
            borderRadius: "6px",
            marginTop: "6px",
            fontSize: "13px"
          }}
        >
          ⚠ {error}
        </div>
      )}
    </div>
  );
}