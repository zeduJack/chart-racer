// Beispieldaten: Top 10 Tech-Firmen Umsatz 2015–2025 (in Milliarden USD)
// Quelle: Öffentlich verfügbare Jahresberichte (Schätzwerte für Planungszwecke)
// imageUrl: Lokale SVG-Platzhalter in public/logos/
// In Produktion: Ersetze mit echten Logo-URLs (z.B. Clearbit: https://logo.clearbit.com/domain.com)

export interface Participant {
  name: string;
  color: string;
  imageUrl?: string;
  values: number[]; // Umsatz pro Jahr (2015–2025)
}

export interface ChartData {
  title: string;
  subtitle: string;
  timeLabels: string[];
  participants: Participant[];
  valueFormat: {
    prefix?: string;
    suffix?: string;
    abbreviate: boolean;
  };
}

export const sampleData: ChartData = {
  title: "Top Tech Companies by Revenue",
  subtitle: "Annual Revenue in Billion USD (2015–2025)",
  timeLabels: ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"],
  valueFormat: {
    prefix: "$",
    suffix: "B",
    abbreviate: false,
  },
  participants: [
    {
      name: "Apple",
      color: "#6b7280",
      imageUrl: "logos/apple.svg",
      values: [233, 216, 229, 266, 260, 274, 366, 394, 383, 391, 410],
    },
    {
      name: "Microsoft",
      color: "#0078d4",
      imageUrl: "logos/microsoft.svg",
      values: [94, 92, 90, 110, 126, 143, 168, 198, 212, 245, 280],
    },
    {
      name: "Alphabet (Google)",
      color: "#4285f4",
      imageUrl: "logos/google.svg",
      values: [75, 90, 111, 137, 162, 183, 258, 283, 307, 350, 380],
    },
    {
      name: "Amazon",
      color: "#ff9900",
      imageUrl: "logos/amazon.svg",
      values: [107, 136, 178, 233, 281, 386, 470, 514, 575, 638, 700],
    },
    {
      name: "Meta",
      color: "#0866ff",
      imageUrl: "logos/meta.svg",
      values: [18, 28, 41, 56, 71, 86, 118, 117, 135, 165, 185],
    },
    {
      name: "Samsung",
      color: "#1428a0",
      imageUrl: "logos/samsung.svg",
      values: [178, 174, 211, 221, 197, 197, 236, 234, 224, 230, 245],
    },
    {
      name: "Tencent",
      color: "#07c160",
      imageUrl: "logos/tencent.svg",
      values: [15, 22, 36, 47, 54, 69, 87, 83, 86, 95, 105],
    },
    {
      name: "TSMC",
      color: "#e53935",
      imageUrl: "logos/tsmc.svg",
      values: [27, 29, 33, 34, 35, 46, 57, 76, 70, 88, 100],
    },
    {
      name: "NVIDIA",
      color: "#76b900",
      imageUrl: "logos/nvidia.svg",
      values: [5, 6, 10, 12, 11, 11, 17, 27, 44, 61, 130],
    },
    {
      name: "Oracle",
      color: "#f80000",
      imageUrl: "logos/oracle.svg",
      values: [38, 37, 37, 40, 40, 40, 40, 47, 50, 53, 57],
    },
  ],
};
