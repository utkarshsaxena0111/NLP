
import React, { useMemo, useRef, useState } from "react";
import {
  FileSpreadsheet,
  UploadCloud,
  Download,
  Play,
  Search,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { predictBatch } from "../services/api";

const SAMPLE_BATCH_CSV = `example_id,query_text
10001,kal subah 7 baje ka alarm lagao
10002,kitchen ki lights band kar do please
10003,dilli se dehradun train ticket book karo
10004,swiggy food delivery kab tak aayegi
10005,kripaya radio mirchi stream shuru karo
10006,ek cup garma garam coffee bana ke do
10007,reliance stock price kitna chal raha hai
10008,palak paneer me green color kaise bachaye`;

const MAX_ROWS = 5000;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if (
      (char === "\n" || char === "\r") &&
      !inQuotes
    ) {
      if (char === "\r" && next === "\n") i++;

      row.push(cell);
      if (row.some((value) => value.trim() !== "")) {
        rows.push(row);
      }

      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (inQuotes) {
    throw new Error("CSV contains an unclosed quoted field.");
  }

  row.push(cell);

  if (row.some((value) => value.trim() !== "")) {
    rows.push(row);
  }

  if (rows.length < 2) {
    throw new Error(
      "CSV must contain a header and at least one data row."
    );
  }

  const headers = rows[0].map((value) => value.trim());

  if (headers.some((header) => !header)) {
    throw new Error("CSV contains an empty column name.");
  }

  if (new Set(headers).size !== headers.length) {
    throw new Error("CSV contains duplicate column names.");
  }

  const data = rows.slice(1).map((values, index) => {
    const obj = {};

    headers.forEach((header, colIndex) => {
      obj[header] = (values[colIndex] ?? "").trim();
    });

    if (values.length > headers.length) {
      throw new Error(
        `Row ${index + 2} has more columns than the header.`
      );
    }

    return obj;
  });

  return { headers, data };
}

function csvEscape(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function getIntentId(result) {
  return result.intentId ?? result.intent_id ?? "N/A";
}

function getGuardStatus(result) {
  return result.reliability_guard?.status || "NOT_AVAILABLE";
}

function getScriptLabel(script) {
  if (!script) return "Not supplied";

  const normalized = String(script).toLowerCase();

  if (normalized.includes("devanagari")) {
    return "Devanagari";
  }

  if (normalized.includes("latin")) {
    return "Latin";
  }

  return script;
}

function getGuardDescription(guard) {
  if (!guard) return "No E65 assessment returned.";

  if (guard.status === "POTENTIALLY_UNSUPPORTED") {
    return guard.detected_domain
      ? `Potentially unsupported domain: ${guard.detected_domain.replaceAll("_", " ")}`
      : "Potentially unsupported action detected.";
  }

  if (guard.status === "REVIEW_REQUIRED") {
    return "Additional review recommended.";
  }

  if (guard.status === "ACCEPTED") {
    return "No unsupported action-domain pattern detected.";
  }

  return "Guard status unavailable.";
}

export default function BatchPrediction() {
  const fileInputRef = useRef(null);

  const [parsedRows, setParsedRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedCol, setSelectedCol] = useState("");
  const [idCol, setIdCol] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const loadCsv = (text, name = "manual_entry.csv") => {
    try {
      const parsed = parseCsv(text);

      if (parsed.data.length > MAX_ROWS) {
        throw new Error(
          `Maximum supported upload size is ${MAX_ROWS} rows.`
        );
      }

      const detectedQuery =
        parsed.headers.find((header) =>
          /query|text|input|sentence/i.test(header)
        ) || parsed.headers[0];

      const detectedId =
        parsed.headers.find((header) =>
          /example_id|^id$/i.test(header)
        ) || "";

      setColumns(parsed.headers);
      setParsedRows(parsed.data);
      setSelectedCol(detectedQuery);
      setIdCol(detectedId);
      setFileName(name);
      setResults([]);
      setProgress(0);
      setFilterText("");
      setError("");
    } catch (err) {
      setError(err.message || "Unable to parse CSV.");
    }
  };

  const handleFile = (file) => {
    if (!file) return;

    if (!/\.(csv|txt)$/i.test(file.name)) {
      setError("Please upload a CSV or TXT file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      loadCsv(String(event.target.result || ""), file.name);
    };

    reader.onerror = () => {
      setError("Could not read the selected file.");
    };

    reader.readAsText(file, "UTF-8");
  };

  const handleFileUpload = (event) => {
    handleFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleLoadSample = () => {
    loadCsv(
      SAMPLE_BATCH_CSV,
      "sample_competition_queries.csv"
    );
  };

  const handleClear = () => {
    setParsedRows([]);
    setColumns([]);
    setSelectedCol("");
    setIdCol("");
    setResults([]);
    setFileName("");
    setFilterText("");
    setProgress(0);
    setError("");
  };

  const handleRunBatch = async () => {
    if (!parsedRows.length) return;

    if (!selectedCol) {
      setError("Select the query text column first.");
      return;
    }

    const invalidRow = parsedRows.findIndex(
      (row) => !String(row[selectedCol] || "").trim()
    );

    if (invalidRow !== -1) {
      setError(
        `Row ${invalidRow + 2} has an empty query. Please correct it before processing.`
      );
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError("");
    setResults([]);

    const queries = parsedRows.map((row, index) => ({
      example_id:
        idCol && row[idCol] !== ""
          ? row[idCol]
          : index + 1,
      query_text: String(row[selectedCol]).trim(),
    }));

    try {
      const batchResults = await predictBatch(
        queries,
        "e58",
        (value) => setProgress(value)
      );

      if (!Array.isArray(batchResults)) {
        throw new Error("Unexpected batch response from E58 API.");
      }

      if (batchResults.length !== parsedRows.length) {
        throw new Error(
          "The number of returned predictions does not match the uploaded rows."
        );
      }

      setResults(batchResults);
      setProgress(100);
    } catch (err) {
      console.error("Batch prediction failed:", err);
      setError(
        err.message || "E58 batch prediction failed."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadKaggleCsv = () => {
    if (!results.length) return;

    const lines = [
      "example_id,target",
      ...results.map((result, index) => {
        const id =
          result.example_id ??
          parsedRows[index]?.[idCol] ??
          index + 1;

        return `${csvEscape(id)},${csvEscape(getIntentId(result))}`;
      }),
    ];

    const blob = new Blob(
      ["\uFEFF", lines.join("\r\n")],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `bharatintent_e58_predictions_${Date.now()}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const handleDownloadDetailedCsv = () => {
    if (!results.length) return;

    const headers = [
      "example_id",
      "query",
      "intent_id",
      "intent_name",
      "script",
      "out_of_scope",
      "decision_score",
      "decision_margin",
      "expert_agreement",
      "e65_status",
      "e65_detected_domain",
    ];

    const lines = [
      headers.join(","),
      ...results.map((result, index) => {
        const values = [
          result.example_id ??
            parsedRows[index]?.[idCol] ??
            index + 1,
          result.query,
          getIntentId(result),
          result.displayName || result.intentName || "",
          result.script || "",
          result.isOutOfScope ?? result.out_of_scope ?? false,
          result.top5?.[0]?.score ?? "",
          result.margin ?? "",
          result.expertAgreement ?? result.expert_agreement ?? "",
          getGuardStatus(result),
          result.reliability_guard?.detected_domain || "",
        ];

        return values.map(csvEscape).join(",");
      }),
    ];

    const blob = new Blob(
      ["\uFEFF", lines.join("\r\n")],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `bharatintent_e58_detailed_results_${Date.now()}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const filteredResults = useMemo(() => {
    const q = filterText.trim().toLowerCase();

    if (!q) return results;

    return results.filter((result) => {
      const guard = result.reliability_guard;

      return [
        result.query,
        result.displayName,
        result.intentName,
        result.intentId,
        result.script,
        getGuardStatus(result),
        guard?.detected_domain,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(q)
      );
    });
  }, [results, filterText]);

  const summary = useMemo(() => {
    return {
      total: results.length,
      oos: results.filter(
        (result) =>
          result.isOutOfScope === true ||
          result.out_of_scope === true
      ).length,
      potentiallyUnsupported: results.filter(
        (result) =>
          getGuardStatus(result) === "POTENTIALLY_UNSUPPORTED"
      ).length,
      review: results.filter(
        (result) =>
          getGuardStatus(result) === "REVIEW_REQUIRED"
      ).length,
    };
  }, [results]);

  return (
    <div>
      {/* HEADER */}

      <div className="page-header">
        <div>
          <div className="page-eyebrow">
            <span className="pulse-dot"></span>
            BATCH INFERENCE & COMPETITION EXPORT
          </div>

          <h1 className="page-title">
            Batch Prediction Engine
          </h1>

          <p className="page-description">
            Run real E58 inference over CSV queries, inspect
            independent E65 reliability assessments, and export
            the original predicted class IDs.
          </p>
        </div>

        <div className="header-actions">
          <button
            className="action-btn secondary"
            onClick={handleLoadSample}
            disabled={isProcessing}
          >
            <FileSpreadsheet size={14} />
            Load 8 Test Queries
          </button>

          {results.length > 0 && (
            <>
              <button
                className="action-btn secondary"
                onClick={handleDownloadDetailedCsv}
              >
                <Download size={14} />
                Detailed Results
              </button>

              <button
                className="action-btn primary"
                onClick={handleDownloadKaggleCsv}
              >
                <Download size={14} />
                Export Submission
              </button>
            </>
          )}
        </div>
      </div>

      {/* UPLOAD AND COLUMN CONFIGURATION */}

      <div
        className="panel"
        style={{ padding: 24, marginBottom: 24 }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: 24,
          }}
        >
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              handleFile(event.dataTransfer.files?.[0]);
            }}
            style={{
              border: `2px dashed ${
                isDragging ? "#06b6d4" : "var(--border-card)"
              }`,
              borderRadius: "var(--radius-md)",
              padding: "28px 20px",
              textAlign: "center",
              background: isDragging
                ? "rgba(6,182,212,0.08)"
                : "var(--bg-card-subtle)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />

            <UploadCloud
              size={36}
              color="#06b6d4"
              style={{ margin: "0 auto 10px" }}
            />

            <b
              style={{
                fontSize: 14,
                color: "#f8fafc",
                display: "block",
              }}
            >
              {fileName
                ? `Loaded: ${fileName}`
                : "Click or Drag & Drop CSV to Upload"}
            </b>

            <span
              style={{
                fontSize: 11,
                color: "#94a3b8",
              }}
            >
              UTF-8 CSV files · Up to 5,000 rows · Quoted fields supported
            </span>

            {parsedRows.length > 0 && (
              <div
                style={{
                  marginTop: 12,
                  color: "#6ee7b7",
                  fontSize: 11,
                }}
              >
                <CheckCircle2
                  size={13}
                  style={{
                    display: "inline",
                    marginRight: 5,
                  }}
                />
                {parsedRows.length} rows loaded
              </div>
            )}
          </div>

          {/* COLUMN MAPPING */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <label
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                QUERY TEXT COLUMN
              </label>

              <select
                className="model-select-control"
                style={{
                  width: "100%",
                  marginBottom: 14,
                }}
                value={selectedCol}
                onChange={(event) =>
                  setSelectedCol(event.target.value)
                }
                disabled={!columns.length || isProcessing}
              >
                {columns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>

              <label
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                EXAMPLE ID COLUMN (OPTIONAL)
              </label>

              <select
                className="model-select-control"
                style={{ width: "100%" }}
                value={idCol}
                onChange={(event) =>
                  setIdCol(event.target.value)
                }
                disabled={!columns.length || isProcessing}
              >
                <option value="">Generate row numbers</option>

                {columns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 14,
              }}
            >
              <button
                className="action-btn primary"
                style={{
                  height: 42,
                  justifyContent: "center",
                  flex: 1,
                }}
                disabled={
                  parsedRows.length === 0 || isProcessing
                }
                onClick={handleRunBatch}
              >
                <Play size={14} />

                {isProcessing
                  ? `Processing (${progress}%)`
                  : `Run E58 Batch (${parsedRows.length} Rows)`}
              </button>

              <button
                className="action-btn secondary"
                title="Clear batch"
                disabled={isProcessing}
                onClick={handleClear}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 8,
              background: "rgba(244,63,94,0.10)",
              border: "1px solid rgba(244,63,94,0.45)",
              color: "#fda4af",
              fontSize: 12,
            }}
          >
            <AlertTriangle
              size={14}
              style={{
                display: "inline",
                marginRight: 6,
              }}
            />
            {error}
          </div>
        )}

        {/* PROGRESS */}

        {isProcessing && (
          <div style={{ marginTop: 20 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                marginBottom: 6,
              }}
            >
              <span>Live E58 inference progress</span>
              <b style={{ color: "#38bdf8" }}>
                {progress}%
              </b>
            </div>

            <div
              style={{
                height: 6,
                borderRadius: 3,
                background: "var(--bg-input)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background:
                    "linear-gradient(90deg, #6366f1, #06b6d4)",
                  transition: "width 0.2s ease",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* RESULTS */}

      {results.length > 0 && (
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title-area">
              <h3>
                Batch Inference Predictions ({results.length} rows)
              </h3>

              <p>
                Original E58 class predictions and separate E65
                reliability assessments. Scores are not probabilities.
              </p>
            </div>

            <div className="search-box" style={{ width: 260 }}>
              <Search size={14} />

              <input
                type="text"
                placeholder="Filter queries, IDs or guard status..."
                value={filterText}
                onChange={(event) =>
                  setFilterText(event.target.value)
                }
              />
            </div>
          </div>

          {/* SUMMARY */}

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              padding: "0 14px 16px",
            }}
          >
            {[
              ["Total predictions", summary.total],
              ["Native E58 OOS", summary.oos],
              ["Potentially unsupported", summary.potentiallyUnsupported],
              ["Review required", summary.review],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: "var(--bg-card-subtle)",
                  minWidth: 135,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: "#94a3b8",
                  }}
                >
                  {label}
                </div>

                <b
                  style={{
                    display: "block",
                    fontSize: 18,
                    color: "#f8fafc",
                    marginTop: 3,
                  }}
                >
                  {value}
                </b>
              </div>
            ))}
          </div>

          {/* TABLE */}

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 11,
                textAlign: "left",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom:
                      "1px solid var(--border-card)",
                    color: "#94a3b8",
                  }}
                >
                  {[
                    "# ID",
                    "INPUT QUERY",
                    "SCRIPT",
                    "PREDICTED INTENT",
                    "TARGET ID",
                    "DECISION SCORE",
                    "E58 OOS",
                    "E65 ASSESSMENT",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: "10px 14px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredResults.map((result, index) => {
                  const id = getIntentId(result);
                  const guard = result.reliability_guard;
                  const status = getGuardStatus(result);

                  const topScore =
                    result.top5?.[0]?.score;

                  const isOOS =
                    result.isOutOfScope === true ||
                    result.out_of_scope === true;

                  return (
                    <tr
                      key={`${result.example_id ?? index}-${index}`}
                      style={{
                        borderBottom:
                          "1px solid var(--border-subtle)",
                        background:
                          index % 2 === 0
                            ? "transparent"
                            : "rgba(255,255,255,0.01)",
                      }}
                    >
                      <td
                        style={{
                          padding: "10px 14px",
                          color: "#64748b",
                        }}
                      >
                        {result.example_id ?? index + 1}
                      </td>

                      <td
                        style={{
                          padding: "10px 14px",
                          color: "#f8fafc",
                          minWidth: 200,
                          maxWidth: 300,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {result.query}
                      </td>

                      <td style={{ padding: "10px 14px" }}>
                        {getScriptLabel(result.script)}
                      </td>

                      <td
                        style={{
                          padding: "10px 14px",
                          fontWeight: 600,
                          color: "#f8fafc",
                          minWidth: 160,
                        }}
                      >
                        {result.displayName ||
                          result.intentName ||
                          `Intent Class ${id}`}
                      </td>

                      <td style={{ padding: "10px 14px" }}>
                        <code
                          style={{
                            background: "rgba(99,102,241,0.2)",
                            padding: "2px 6px",
                            borderRadius: 4,
                            color: "#c7d2fe",
                          }}
                        >
                          {id}
                        </code>
                      </td>

                      <td
                        style={{
                          padding: "10px 14px",
                          color: "#34d399",
                          fontWeight: 600,
                        }}
                      >
                        {Number.isFinite(Number(topScore))
                          ? Number(topScore).toFixed(4)
                          : "N/A"}
                      </td>

                      <td style={{ padding: "10px 14px" }}>
                        {isOOS ? (
                          <span style={{ color: "#fda4af" }}>
                            Native OOS
                          </span>
                        ) : (
                          <span style={{ color: "#94a3b8" }}>
                            No
                          </span>
                        )}
                      </td>

                      <td
                        style={{
                          padding: "10px 14px",
                          minWidth: 190,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            color:
                              status === "POTENTIALLY_UNSUPPORTED"
                                ? "#fbbf24"
                                : status === "REVIEW_REQUIRED"
                                ? "#f59e0b"
                                : status === "ACCEPTED"
                                ? "#6ee7b7"
                                : "#94a3b8",
                          }}
                        >
                          {status === "POTENTIALLY_UNSUPPORTED" ||
                          status === "REVIEW_REQUIRED" ? (
                            <ShieldAlert size={13} />
                          ) : (
                            <CheckCircle2 size={13} />
                          )}

                          {status.replaceAll("_", " ")}
                        </div>

                        <div
                          style={{
                            fontSize: 9,
                            color: "#64748b",
                            marginTop: 4,
                          }}
                        >
                          {getGuardDescription(guard)}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredResults.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        textAlign: "center",
                        padding: 24,
                        color: "#94a3b8",
                      }}
                    >
                      No matching batch results.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div
            style={{
              padding: 14,
              fontSize: 10,
              color: "#64748b",
            }}
          >
            Intent names are dataset-derived display labels.
            Decision scores are normalized E58 scores, not calibrated
            confidence probabilities. E65 assessments do not modify
            E58 predictions.
          </div>
        </div>
      )}
    </div>
  );
}
