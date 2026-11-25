
import React, { useMemo, useState } from "react";
import {
  Compass,
  Search,
  Copy,
  Check,
  Tag,
  Filter,
  Layers,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { INTENT_TAXONOMY, CATEGORIES } from "../data/intentTaxonomy";

const SAMPLE_TYPES = [
  { key: "hindi", label: "Hindi", color: "#34d399" },
  { key: "romanized", label: "Romanized Hindi", color: "#38bdf8" },
];

function safeText(value) {
  return typeof value === "string" ? value : "";
}

export default function IntentExplorer({ onSelectQuery }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [copiedId, setCopiedId] = useState(null);
  const [copyError, setCopyError] = useState("");

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        (CATEGORIES || []).filter((category) => category !== "All")
      ),
    ];
  }, []);

  const filteredIntents = useMemo(() => {
    const q = search.trim().toLowerCase();

    return (INTENT_TAXONOMY || []).filter((item) => {
      const matchesCategory =
        selectedCategory === "All" ||
        item.category === selectedCategory;

      const samples = Object.values(item.sampleQueries || {})
        .map(safeText);

      const matchesSearch =
        !q ||
        String(item.id).includes(q) ||
        safeText(item.name).toLowerCase().includes(q) ||
        safeText(item.displayName).toLowerCase().includes(q) ||
        safeText(item.description).toLowerCase().includes(q) ||
        safeText(item.category).toLowerCase().includes(q) ||
        samples.some((sample) => sample.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const handleCopy = async (text, id) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setCopyError("");

      window.setTimeout(() => {
        setCopiedId((current) => current === id ? null : current);
      }, 1500);
    } catch {
      setCopyError(
        "Clipboard access failed. Select and copy the sample text manually."
      );
    }
  };

  const handleSampleClick = (text, id) => {
    if (!text) return;

    if (typeof onSelectQuery === "function") {
      onSelectQuery(text);
    } else {
      handleCopy(text, id);
    }
  };

  const outOfScopeCount = (INTENT_TAXONOMY || []).filter(
    (item) => item.isOutOfScope
  ).length;

  return (
    <div>
      {/* PAGE HEADER */}

      <div className="page-header">
        <div>
          <div className="page-eyebrow">
            <span className="pulse-dot"></span>
            56-CLASS DATASET-DERIVED TAXONOMY
          </div>

          <h1 className="page-title">Intent Explorer</h1>

          <p className="page-description">
            Explore the 56 E58 output classes, their dataset-derived
            display labels, descriptions and representative Hindi
            and Romanized Hindi examples.
          </p>
        </div>

        <div className="header-actions">
          <span style={{ fontSize: 12, color: "#94a3b8" }}>
            Showing <b>{filteredIntents.length}</b> of{" "}
            <b>{INTENT_TAXONOMY.length}</b> classes
          </span>
        </div>
      </div>

      {/* TAXONOMY DISCLAIMER */}

      <div
        className="panel"
        style={{
          padding: "13px 16px",
          marginBottom: 20,
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          border: "1px solid rgba(59,130,246,0.3)",
          background: "rgba(59,130,246,0.06)",
        }}
      >
        <AlertCircle
          size={17}
          color="#60a5fa"
          style={{ flexShrink: 0, marginTop: 1 }}
        />

        <div>
          <b style={{ color: "#bfdbfe", fontSize: 11 }}>
            Taxonomy interpretation note
          </b>

          <p
            style={{
              color: "#94a3b8",
              fontSize: 10,
              lineHeight: 1.6,
              margin: "4px 0 0",
            }}
          >
            Numeric class IDs are the original E58 output classes.
            Human-readable names, descriptions, categories and sample
            associations are dataset-derived display mappings, not
            an officially verified competition label taxonomy.
            Class 55 represents the native Out-of-Scope class.
          </p>
        </div>
      </div>

      {/* SUMMARY */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          {
            label: "Total output classes",
            value: INTENT_TAXONOMY.length,
            color: "#38bdf8",
          },
          {
            label: "Displayed categories",
            value: new Set(
              INTENT_TAXONOMY.map((item) => item.category)
            ).size,
            color: "#a78bfa",
          },
          {
            label: "Native OOS classes",
            value: outOfScopeCount,
            color: "#fb7185",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="panel"
            style={{ padding: 15 }}
          >
            <span
              style={{
                color: "#94a3b8",
                fontSize: 10,
              }}
            >
              {stat.label}
            </span>

            <b
              style={{
                display: "block",
                fontSize: 23,
                color: stat.color,
                marginTop: 5,
              }}
            >
              {stat.value}
            </b>
          </div>
        ))}
      </div>

      {/* SEARCH AND CATEGORY FILTER */}

      <div
        className="panel"
        style={{
          padding: "16px 20px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div className="search-box" style={{ width: 320 }}>
          <Search size={14} />

          <input
            type="text"
            placeholder="Search class ID, name or sample query..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          <Filter size={13} color="#94a3b8" />

          {categories.map((category) => (
            <button
              key={category}
              className={`action-btn ${
                selectedCategory === category
                  ? "primary"
                  : "secondary"
              }`}
              style={{
                height: 30,
                fontSize: 10,
                padding: "0 10px",
              }}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {copyError && (
        <div
          style={{
            color: "#fda4af",
            fontSize: 11,
            marginBottom: 14,
          }}
        >
          {copyError}
        </div>
      )}

      {/* CLASS GRID */}

      {filteredIntents.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {filteredIntents.map((item) => {
            const isOOS = Boolean(item.isOutOfScope);

            return (
              <div
                key={item.id}
                className="panel"
                style={{
                  padding: 18,
                  border: isOOS
                    ? "1px solid rgba(244,63,94,0.4)"
                    : "1px solid var(--border-card)",
                  background: isOOS
                    ? "rgba(244,63,94,0.05)"
                    : "var(--bg-card)",
                }}
              >
                {/* CLASS ID AND NAME */}

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        width: 30,
                        height: 30,
                        flexShrink: 0,
                        borderRadius: 6,
                        background: isOOS
                          ? "#f43f5e20"
                          : "#6366f120",
                        color: isOOS
                          ? "#fda4af"
                          : "#c7d2fe",
                        border: `1px solid ${
                          isOOS ? "#f43f5e" : "#6366f1"
                        }`,
                        display: "grid",
                        placeItems: "center",
                        fontSize: 11,
                        fontWeight: 800,
                      }}
                    >
                      {item.id}
                    </span>

                    <div style={{ minWidth: 0 }}>
                      <b
                        style={{
                          fontSize: 13,
                          color: "#f8fafc",
                          display: "block",
                        }}
                      >
                        {item.displayName || `Intent Class ${item.id}`}
                      </b>

                      <code
                        style={{
                          fontSize: 9,
                          color: "#64748b",
                          display: "block",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {item.name || `class_${item.id}`}
                      </code>
                    </div>
                  </div>

                  <span
                    style={{
                      flexShrink: 0,
                      fontSize: 9,
                      padding: "3px 7px",
                      borderRadius: 10,
                      background: "var(--bg-card-subtle)",
                      color: "#94a3b8",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    {item.category || "Uncategorized"}
                  </span>
                </div>

                {/* DESCRIPTION */}

                <p
                  style={{
                    fontSize: 11,
                    color: "#94a3b8",
                    minHeight: 34,
                    marginBottom: 12,
                    lineHeight: 1.5,
                  }}
                >
                  {item.description || "No description available."}
                </p>

                {isOOS && (
                  <div
                    style={{
                      fontSize: 10,
                      color: "#fda4af",
                      marginBottom: 10,
                    }}
                  >
                    Native E58 Out-of-Scope class
                  </div>
                )}

                {/* SAMPLE QUERIES */}

                <div
                  style={{
                    borderTop: "1px solid var(--border-card)",
                    paddingTop: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: 1,
                      color: "#64748b",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: 7,
                    }}
                  >
                    Representative dataset examples
                  </span>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      fontSize: 11,
                    }}
                  >
                    {SAMPLE_TYPES.map((sampleType) => {
                      const sample = safeText(
                        item.sampleQueries?.[sampleType.key]
                      );

                      if (!sample) return null;

                      const copyKey = `${item.id}-${sampleType.key}`;

                      return (
                        <div
                          key={sampleType.key}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 8,
                            padding: "5px 8px",
                            background: "var(--bg-card-subtle)",
                            borderRadius: 6,
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleSampleClick(sample, copyKey)
                            }
                            title={
                              onSelectQuery
                                ? "Send sample to live inference"
                                : "Copy sample query"
                            }
                            style={{
                              flex: 1,
                              minWidth: 0,
                              textAlign: "left",
                              background: "transparent",
                              border: 0,
                              padding: 0,
                              cursor: "pointer",
                              color: sampleType.color,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: 11,
                            }}
                          >
                            <span
                              style={{
                                color: "#64748b",
                                fontSize: 9,
                                marginRight: 6,
                              }}
                            >
                              {sampleType.label}:
                            </span>
                            {sample}
                          </button>

                          <button
                            type="button"
                            className="icon-button"
                            style={{
                              width: 24,
                              height: 24,
                              flexShrink: 0,
                            }}
                            onClick={() =>
                              handleCopy(sample, copyKey)
                            }
                            title="Copy sample"
                          >
                            {copiedId === copyKey ? (
                              <Check size={11} color="#10b981" />
                            ) : (
                              <Copy size={11} />
                            )}
                          </button>
                        </div>
                      );
                    })}

                    {!SAMPLE_TYPES.some((sampleType) =>
                      safeText(
                        item.sampleQueries?.[sampleType.key]
                      )
                    ) && (
                      <span
                        style={{
                          color: "#64748b",
                          fontSize: 10,
                        }}
                      >
                        No representative examples available.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="panel"
          style={{
            padding: 40,
            textAlign: "center",
          }}
        >
          <Search
            size={28}
            color="#64748b"
            style={{ marginBottom: 12 }}
          />

          <h3 style={{ color: "#f8fafc", fontSize: 14 }}>
            No matching intent classes
          </h3>

          <p
            style={{
              color: "#94a3b8",
              fontSize: 11,
              marginTop: 6,
            }}
          >
            Try another search term or select a different category.
          </p>

          <button
            className="action-btn secondary"
            style={{ marginTop: 14 }}
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      {/* FOOTER NOTE */}

      <div
        style={{
          marginTop: 20,
          padding: 12,
          color: "#64748b",
          fontSize: 10,
          lineHeight: 1.6,
        }}
      >
        The intent explorer describes the output class inventory.
        Display names and sample associations are for interpretation
        and exploration; they do not change E58 inference, class IDs,
        or the original Out-of-Scope decision.
      </div>
    </div>
  );
}
