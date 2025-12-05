"use client";

export default function HighlightText({ text, query }) {
  if (!query || !text) return text;

  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            style={{
              backgroundColor: "rgba(0, 237, 100, 0.3)",
              color: "#001E2B",
              fontWeight: 600,
              padding: "0 2px",
              borderRadius: "2px",
            }}
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

