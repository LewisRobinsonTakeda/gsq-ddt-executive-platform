import { useEffect, useMemo, useState } from "react";

type Geography =
  | "North America"
  | "Latin America"
  | "APAC"
  | "Europe";

type PlantMaturity = {
  site: string;
  geography: Geography;
  capDeploy: number;
  capAdopt: number;
  intDeploy: number;
  intAdopt: number;
  transcription: number;
  overall: number;
};

type DigitalMaturityHeatmapProps = {
  selectedGeography?: string;
};

const TAKEDA_RED = "#8c001f";
const TAKEDA_RED_DARK = "#680017";
const EXECUTIVE_NAVY = "#001b35";
const EXECUTIVE_BLUE = "#173f6b";
const EXECUTIVE_BLUE_LIGHT = "#245484";
const TEXT_PRIMARY = "#102235";
const TEXT_SECONDARY = "#5f7080";
const BORDER = "#d5dfe7";
const SURFACE = "#ffffff";
const SURFACE_MUTED = "#f3f6f8";

const PLANT_COLUMN_WIDTH = "minmax(260px, 1fr)";
const OVERALL_COLUMN_WIDTH = "160px";
const PROFILE_COLUMN_WIDTH = "440px";
const PROFILE_CELL_WIDTH = "88px";
const MINIMUM_CONTENT_WIDTH = 900;

const plants: PlantMaturity[] = [
  {
    site: "Lexington",
    geography: "North America",
    capDeploy: 59,
    capAdopt: 53,
    intDeploy: 66,
    intAdopt: 51,
    transcription: 58,
    overall: 58,
  },
  {
    site: "Brooklyn Park",
    geography: "North America",
    capDeploy: 68,
    capAdopt: 63,
    intDeploy: 41,
    intAdopt: 38,
    transcription: 39,
    overall: 50,
  },
  {
    site: "Naucalpan",
    geography: "Latin America",
    capDeploy: 45,
    capAdopt: 43,
    intDeploy: 93,
    intAdopt: 93,
    transcription: 93,
    overall: 73,
  },
  {
    site: "Thousand Oaks",
    geography: "North America",
    capDeploy: 49,
    capAdopt: 44,
    intDeploy: 31,
    intAdopt: 29,
    transcription: 30,
    overall: 37,
  },
  {
    site: "Grange Castle",
    geography: "Europe",
    capDeploy: 49,
    capAdopt: 49,
    intDeploy: 22,
    intAdopt: 22,
    transcription: 22,
    overall: 33,
  },
  {
    site: "Bray",
    geography: "Europe",
    capDeploy: 53,
    capAdopt: 52,
    intDeploy: 14,
    intAdopt: 14,
    transcription: 14,
    overall: 30,
  },
  {
    site: "Oranienburg",
    geography: "Europe",
    capDeploy: 47,
    capAdopt: 49,
    intDeploy: 22,
    intAdopt: 22,
    transcription: 22,
    overall: 32,
  },
  {
    site: "Linz",
    geography: "Europe",
    capDeploy: 43,
    capAdopt: 43,
    intDeploy: 27,
    intAdopt: 27,
    transcription: 27,
    overall: 34,
  },
  {
    site: "Tianjin",
    geography: "APAC",
    capDeploy: 38,
    capAdopt: 38,
    intDeploy: 12,
    intAdopt: 12,
    transcription: 12,
    overall: 23,
  },
  {
    site: "Bekasi",
    geography: "APAC",
    capDeploy: 35,
    capAdopt: 35,
    intDeploy: 8,
    intAdopt: 8,
    transcription: 8,
    overall: 19,
  },
  {
    site: "Vashi",
    geography: "APAC",
    capDeploy: 34,
    capAdopt: 34,
    intDeploy: 14,
    intAdopt: 14,
    transcription: 14,
    overall: 22,
  },
  {
    site: "Osaka",
    geography: "APAC",
    capDeploy: 47,
    capAdopt: 46,
    intDeploy: 28,
    intAdopt: 28,
    transcription: 28,
    overall: 35,
  },
  {
    site: "Buenos Aires",
    geography: "Latin America",
    capDeploy: 30,
    capAdopt: 30,
    intDeploy: 8,
    intAdopt: 8,
    transcription: 8,
    overall: 16,
  },
  {
    site: "Singen",
    geography: "Europe",
    capDeploy: 30,
    capAdopt: 26,
    intDeploy: 22,
    intAdopt: 22,
    transcription: 22,
    overall: 25,
  },
  {
    site: "Hikari",
    geography: "APAC",
    capDeploy: 30,
    capAdopt: 30,
    intDeploy: 14,
    intAdopt: 14,
    transcription: 14,
    overall: 21,
  },
  {
    site: "Neuchatel",
    geography: "Europe",
    capDeploy: 43,
    capAdopt: 43,
    intDeploy: 13,
    intAdopt: 12,
    transcription: 13,
    overall: 25,
  },
  {
    site: "Singapore",
    geography: "APAC",
    capDeploy: 17,
    capAdopt: 17,
    intDeploy: 11,
    intAdopt: 3,
    transcription: 7,
    overall: 11,
  },
  {
    site: "Yaroslavl",
    geography: "Europe",
    capDeploy: 18,
    capAdopt: 18,
    intDeploy: 8,
    intAdopt: 8,
    transcription: 8,
    overall: 12,
  },
];

const maturityMetrics = [
  {
    key: "capDeploy",
    shortLabel: "Deployed",
    fullLabel: "Business Capability Deployed",
  },
  {
    key: "capAdopt",
    shortLabel: "Adopted",
    fullLabel: "Business Capability Adopted",
  },
  {
    key: "intDeploy",
    shortLabel: "Deployed",
    fullLabel: "Northstar Integration Deployed",
  },
  {
    key: "intAdopt",
    shortLabel: "Adopted",
    fullLabel: "Northstar Integration Adopted",
  },
  {
    key: "transcription",
    shortLabel: "Transcription",
    fullLabel: "Transcription Eliminated",
  },
] as const;

function isAllGeographies(value?: string): boolean {
  if (!value) return true;

  const normalisedValue = value.trim().toLowerCase();

  return [
    "all",
    "all geographies",
    "all geography",
    "all regions",
    "all sites",
  ].includes(normalisedValue);
}

function getHeatmapColour(value: number): string {
  if (value >= 70) return "#4fa879";
  if (value >= 50) return "#bed36e";
  if (value >= 35) return "#f0cd61";
  if (value >= 20) return "#ec9252";

  return "#db6262";
}

function getMaturityLabel(value: number): string {
  if (value >= 70) return "Leading";
  if (value >= 50) return "Advancing";
  if (value >= 35) return "Emerging";
  if (value >= 20) return "Developing";

  return "Priority";
}

function getOverallScoreStyle(value: number) {
  if (value >= 70) {
    return {
      backgroundColor: EXECUTIVE_NAVY,
      color: "#ffffff",
      border: `1px solid ${EXECUTIVE_NAVY}`,
    };
  }

  if (value < 20) {
    return {
      backgroundColor: TAKEDA_RED,
      color: "#ffffff",
      border: `1px solid ${TAKEDA_RED}`,
    };
  }

  return {
    backgroundColor: SURFACE_MUTED,
    color: TEXT_PRIMARY,
    border: `1px solid ${BORDER}`,
  };
}

function MaturityLegend() {
  const legendItems = [
    {
      label: "Leading",
      range: "70–100%",
      colour: "#4fa879",
    },
    {
      label: "Advancing",
      range: "50–69%",
      colour: "#bed36e",
    },
    {
      label: "Emerging",
      range: "35–49%",
      colour: "#f0cd61",
    },
    {
      label: "Developing",
      range: "20–34%",
      colour: "#ec9252",
    },
    {
      label: "Priority",
      range: "0–19%",
      colour: "#db6262",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
        padding: "11px 14px",
        backgroundColor: SURFACE_MUTED,
        border: `1px solid ${BORDER}`,
        borderRadius: 7,
        color: TEXT_SECONDARY,
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      {legendItems.map((item) => (
        <span
          key={item.label}
          title={`${item.label}: ${item.range}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              backgroundColor: item.colour,
              border: "1px solid rgba(0, 27, 53, 0.12)",
            }}
          />

          <span>{item.label}</span>
        </span>
      ))}
    </div>
  );
}

function HeatmapSquares({ plant }: { plant: PlantMaturity }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(5, ${PROFILE_CELL_WIDTH})`,
        alignItems: "center",
        width: PROFILE_COLUMN_WIDTH,
      }}
    >
      {maturityMetrics.map((metric) => {
        const value = plant[metric.key];

        return (
          <div
            key={metric.key}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              title={`${metric.fullLabel}: ${value}%`}
              aria-label={`${metric.fullLabel}: ${value}%`}
              style={{
                width: 24,
                height: 24,
                display: "inline-block",
                borderRadius: 4,
                backgroundColor: getHeatmapColour(value),
                border: "1px solid rgba(0, 27, 53, 0.14)",
                boxShadow: "0 1px 2px rgba(0, 27, 53, 0.08)",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

function PlantRow({
  plant,
  rank,
}: {
  plant: PlantMaturity;
  rank?: number;
}) {
  const maturityLabel = getMaturityLabel(plant.overall);
  const overallStyle = getOverallScoreStyle(plant.overall);

  return (
    <div
      style={{
        minWidth: MINIMUM_CONTENT_WIDTH,
        display: "grid",
        gridTemplateColumns: `${PLANT_COLUMN_WIDTH} ${OVERALL_COLUMN_WIDTH} ${PROFILE_COLUMN_WIDTH}`,
        alignItems: "center",
        minHeight: 72,
        padding: "0 20px",
        borderBottom: `1px solid ${BORDER}`,
        backgroundColor: SURFACE,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          minWidth: 0,
        }}
      >
        {rank !== undefined ? (
          <span
            style={{
              width: 38,
              height: 38,
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              backgroundColor:
                rank === 1 ? TAKEDA_RED : SURFACE_MUTED,
              color: rank === 1 ? "#ffffff" : TEXT_SECONDARY,
              border:
                rank === 1
                  ? `1px solid ${TAKEDA_RED}`
                  : `1px solid ${BORDER}`,
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            {rank}
          </span>
        ) : (
          <span
            aria-hidden="true"
            style={{
              width: 38,
              height: 38,
              flexShrink: 0,
            }}
          />
        )}

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: TEXT_PRIMARY,
              fontSize: 15,
              fontWeight: rank !== undefined ? 750 : 650,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {plant.site}
          </div>

          <div
            style={{
              marginTop: 4,
              color: TEXT_SECONDARY,
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {maturityLabel}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <span
          style={{
            minWidth: 78,
            display: "inline-flex",
            justifyContent: "center",
            padding: "8px 12px",
            borderRadius: 6,
            fontSize: 16,
            fontWeight: 800,
            ...overallStyle,
          }}
        >
          {plant.overall}%
        </span>
      </div>

      <HeatmapSquares plant={plant} />
    </div>
  );
}

function GroupedColumnHeader({
  heading,
}: {
  heading: string;
}) {
  return (
    <div
      style={{
        overflowX: "auto",
        backgroundColor: EXECUTIVE_NAVY,
      }}
    >
      <div
        style={{
          minWidth: MINIMUM_CONTENT_WIDTH,
          display: "grid",
          gridTemplateColumns: `${PLANT_COLUMN_WIDTH} ${OVERALL_COLUMN_WIDTH} ${PROFILE_COLUMN_WIDTH}`,
          padding: "0 20px",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 0",
            fontSize: 11,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {heading}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 0",
            fontSize: 11,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Overall
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(5, ${PROFILE_CELL_WIDTH})`,
            width: PROFILE_COLUMN_WIDTH,
            alignSelf: "end",
          }}
        >
          <div
            style={{
              gridColumn: "span 2",
              padding: "9px 3px",
              textAlign: "center",
              backgroundColor: EXECUTIVE_BLUE,
              borderTop: "1px solid rgba(255,255,255,0.24)",
              borderLeft: "1px solid rgba(255,255,255,0.24)",
              borderRight: "1px solid rgba(255,255,255,0.24)",
              fontSize: 10,
              fontWeight: 800,
              lineHeight: 1.15,
              whiteSpace: "nowrap",
            }}
          >
            Business Capabilities
          </div>

          <div
            style={{
              gridColumn: "span 2",
              padding: "9px 3px",
              textAlign: "center",
              backgroundColor: EXECUTIVE_BLUE,
              borderTop: "1px solid rgba(255,255,255,0.24)",
              borderRight: "1px solid rgba(255,255,255,0.24)",
              fontSize: 10,
              fontWeight: 800,
              lineHeight: 1.15,
              whiteSpace: "nowrap",
            }}
          >
            Northstar Integrations
          </div>

          <div
            style={{
              padding: "9px 3px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              backgroundColor: EXECUTIVE_BLUE,
              borderTop: "1px solid rgba(255,255,255,0.24)",
              borderRight: "1px solid rgba(255,255,255,0.24)",
              fontSize: 9,
              fontWeight: 800,
              lineHeight: 1.15,
            }}
          >
            Manual &amp; Paper
          </div>

          {maturityMetrics.map((metric, index) => (
            <div
              key={metric.key}
              title={metric.fullLabel}
              style={{
                minHeight: 40,
                padding: "7px 3px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                backgroundColor: EXECUTIVE_BLUE_LIGHT,
                borderTop: "1px solid rgba(255,255,255,0.24)",
                borderLeft:
                  index === 0
                    ? "1px solid rgba(255,255,255,0.24)"
                    : "none",
                borderRight: "1px solid rgba(255,255,255,0.24)",
                fontSize: index === 4 ? 8 : 9,
                fontWeight: 700,
                lineHeight: 1.1,
                whiteSpace: index === 4 ? "normal" : "nowrap",
              }}
            >
              {metric.shortLabel}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DigitalMaturityHeatmap({
  selectedGeography = "All geographies",
}: DigitalMaturityHeatmapProps) {
  const [expanded, setExpanded] = useState(false);

  const filteredPlants = useMemo(() => {
    if (isAllGeographies(selectedGeography)) {
      return plants;
    }

    return plants.filter(
      (plant) =>
        plant.geography.toLowerCase() ===
        selectedGeography.trim().toLowerCase()
    );
  }, [selectedGeography]);

  const sortedPlants = useMemo(
    () =>
      [...filteredPlants].sort(
        (plantA, plantB) =>
          plantB.overall - plantA.overall
      ),
    [filteredPlants]
  );

  const topPlants = sortedPlants.slice(0, 3);
  const additionalPlants = sortedPlants.slice(3);

  const geographyLabel = isAllGeographies(
    selectedGeography
  )
    ? "All geographies"
    : selectedGeography;

  const siteLabel =
    filteredPlants.length === 1 ? "plant" : "plants";

  const tableHeading =
    filteredPlants.length <= 3
      ? "Plants"
      : "Top Performing Plants";

  useEffect(() => {
    setExpanded(false);
  }, [selectedGeography]);

  return (
    <section
      style={{
        marginTop: 24,
        backgroundColor: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 3px 12px rgba(0, 27, 53, 0.07)",
      }}
    >
      <div
        style={{
          padding: "24px 24px 22px",
          borderTop: `5px solid ${TAKEDA_RED}`,
          borderBottom: `1px solid ${BORDER}`,
          backgroundColor: SURFACE,
        }}
      >
        <div
          style={{
            color: TAKEDA_RED,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.11em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Digital Maturity Health
        </div>

        <h2
          style={{
            color: TEXT_PRIMARY,
            fontSize: 25,
            lineHeight: 1.2,
            margin: 0,
            fontWeight: 800,
          }}
        >
          Plant Digital Core Maturity
        </h2>

        <p
          style={{
            color: TEXT_SECONDARY,
            fontSize: 13,
            margin: "8px 0 0",
          }}
        >
          Executive view of capability deployment, adoption and
          integration maturity
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 10,
            color: TEXT_SECONDARY,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <span>{geographyLabel}</span>

          <span aria-hidden="true">•</span>

          <span>
            {filteredPlants.length} {siteLabel}
          </span>
        </div>

        <div style={{ marginTop: 24 }}>
          <MaturityLegend />
        </div>
      </div>

      {filteredPlants.length > 0 ? (
        <>
          <GroupedColumnHeader heading={tableHeading} />

          <div style={{ overflowX: "auto" }}>
            <div style={{ minWidth: MINIMUM_CONTENT_WIDTH }}>
              {topPlants.map((plant, index) => (
                <PlantRow
                  key={plant.site}
                  plant={plant}
                  rank={index + 1}
                />
              ))}
            </div>
          </div>

          {expanded && additionalPlants.length > 0 && (
            <div
              style={{
                borderTop: `7px solid ${SURFACE_MUTED}`,
              }}
            >
              <div
                style={{
                  padding: "14px 20px 11px",
                  backgroundColor: "#fafbfc",
                  color: TEXT_SECONDARY,
                  borderBottom: `1px solid ${BORDER}`,
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                }}
              >
                Remaining {additionalPlants.length}{" "}
                {additionalPlants.length === 1
                  ? "Plant"
                  : "Plants"}
              </div>

              <div style={{ overflowX: "auto" }}>
                <div
                  style={{
                    minWidth: MINIMUM_CONTENT_WIDTH,
                  }}
                >
                  {additionalPlants.map((plant) => (
                    <PlantRow
                      key={plant.site}
                      plant={plant}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {additionalPlants.length > 0 && (
            <button
              type="button"
              onClick={() =>
                setExpanded((current) => !current)
              }
              aria-expanded={expanded}
              style={{
                width: "100%",
                border: "none",
                borderTop: `1px solid ${BORDER}`,
                backgroundColor: expanded
                  ? "#ffffff"
                  : SURFACE_MUTED,
                color: TAKEDA_RED,
                padding: "15px 20px",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: 800,
                textAlign: "left",
                transition:
                  "background-color 150ms ease, color 150ms ease",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.backgroundColor =
                  "#e8edf1";

                event.currentTarget.style.color =
                  TAKEDA_RED_DARK;
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.backgroundColor =
                  expanded ? "#ffffff" : SURFACE_MUTED;

                event.currentTarget.style.color =
                  TAKEDA_RED;
              }}
            >
              {expanded
                ? "▲ Hide additional plants"
                : `▼ View all ${filteredPlants.length} plants`}
            </button>
          )}
        </>
      ) : (
        <div
          style={{
            padding: "30px 24px",
            backgroundColor: SURFACE,
          }}
        >
          <div
            style={{
              padding: "18px 20px",
              border: `1px solid ${BORDER}`,
              borderRadius: 8,
              backgroundColor: SURFACE_MUTED,
              color: TEXT_SECONDARY,
              fontSize: 13,
            }}
          >
            No mock digital-maturity data is available for{" "}
            <strong>{geographyLabel}</strong>.
          </div>
        </div>
      )}

      <div
        style={{
          padding: "10px 20px",
          color: "#748491",
          backgroundColor: "#fafbfc",
          borderTop: `1px solid ${BORDER}`,
          fontSize: 10,
        }}
      >
        Illustrative mock data for design evaluation only.
        Hover over a maturity indicator to view the full metric
        name and score.
      </div>
    </section>
  );
}