# SIH26080 — Rainfall Forecast Visualization (Frontend)

Interactive operational meteorological console for rainfall forecasting, ML bias calibration, and monsoon telemetry across India. Built with **Next.js (App Router)**, **React**, **TypeScript**, and **Tailwind CSS**.

---

## 🚀 How to Run

1. **Navigate to the project folder:**
   ```bash
   cd C:\Users\vpran\.gemini\antigravity\scratch\sih26080
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Create a production build and run:**
   ```bash
   npm run build
   npm run start
   ```

---

## 🧩 Person A Components & Props Reference

All components adhere strictly to the SIH26080 Frontend Task Guide specifications:

### 1. `app/page.tsx`
* **Role**: Primary dashboard view assembling the Person A interface in required order:
  1. Date picker
  2. Layer buttons
  3. Monsoon-regime label
  4. Interactive map
  5. Rainfall scale legend
  6. Priority district summary cards
  7. District table near the bottom
* **State Management**: Maintains shared state (`selectedDate`, `selectedLayer`, `selectedDistrictId`) and passes down data via props.

### 2. `components/MapView.tsx`
* **Props**:
  * `districts: DistrictCombinedData[]`: Array of places with geospatial coordinates and rainfall values.
  * `selectedLayer: 'raw' | 'corrected' | 'observed'`: Currently active layer.
  * `selectedDistrictId?: string`: Active selected station ID.
  * `onSelectDistrict?: (id: string) => void`: Callback when a marker or station is clicked.
* **Implementation**: Uses `react-leaflet` with OpenStreetMap raster tiles (EPSG:4326), loaded dynamically with `ssr: false` to ensure SSR compatibility. Clicking markers displays popups with telemetry details and direct links to `/district/[id]`.

### 3. `components/DatePicker.tsx`
* **Props**:
  * `selectedDate: string`: Selected ISO date (`YYYY-MM-DD`).
  * `onDateChange: (date: string) => void`: Callback when user selects a new date.
  * `hasData: boolean`: Indicates if sample data exists for the selected date.
* **Constraints**: Strictly bounded between `2024-06-01` and `2025-09-30`. Displays "No data for this date" when an out-of-sample date is picked.

### 4. `components/LayerToggle.tsx`
* **Props**:
  * `selectedLayer: 'raw' | 'corrected' | 'observed'`: Active visualization layer.
  * `onLayerChange: (layer: RainfallLayer) => void`: Handler for layer switching.
* **Options**: `Raw`, `Corrected`, and `Observed`. Uses keyboard-accessible segmented buttons with `role="group"` and `aria-checked`.

### 5. `components/RegimeBadge.tsx`
* **Props**:
  * `regime: 'Active' | 'Normal' | 'Break'`: The synoptic monsoon condition for the selected day.
* **Styling**:
  * **Active**: Green container (`#ECFDF5`), green text (`#047857`), pulsating status dot (`#059669`).
  * **Normal**: Blue container (`#EFF6FF`), blue text (`#1D4ED8`), solid dot (`#2563EB`).
  * **Break**: Amber container (`#FFFBEB`), amber text (`#B45309`), solid dot (`#D97706`).

### 6. `components/Legend.tsx`
* **Props**: `className?: string`
* **Source of Truth**: Read directly from `lib/rainfallScale.ts`.
* **Thresholds & Radii**:
  * `0 – 2.5 mm`: Very Light (`#BAE6FD`, radius 6px)
  * `2.5 – 15.5 mm`: Light (`#38BDF8`, radius 8px)
  * `15.5 – 64.5 mm`: Moderate (`#2563EB`, radius 10px)
  * `64.5 – 115.5 mm`: Heavy (`#F59E0B`, radius 12px)
  * `115.5 – 204.5 mm`: Very Heavy (`#EA580C`, radius 14px)
  * `> 204.5 mm`: Extremely Heavy (`#7E22CE`, radius 16px)

### 7. `components/DistrictCard.tsx`
* **Props**:
  * `name: string`: Station/district name.
  * `rainfall: number`: Precipitation value in mm/day for selected layer.
  * `layerLabel: string`: Label representing current layer ('Raw', 'Corrected', 'Observed').
  * `onClick?: () => void`: Optional click handler.
  * `state?: string`, `division?: string`, `biasAdjustment?: number`.
* **Behavior**: Dynamically calculates classification pill style and marker color from `lib/rainfallScale.ts`. No hardcoded numbers.

### 8. `components/DistrictTable.tsx`
* **Role**: Integration slot for Person B.
* **Features**: Sortable columns (District name, Raw, Corrected, Observed, Alert probability), layer highlight, and station link to `/district/[id]`.

---

## 🔄 Where to Swap Mock Data for FastAPI

All data access is decoupled into a single wrapper: **`lib/data.ts`**.

* **Current Implementation**: Reads from `lib/mockData.ts`.
* **To Connect to FastAPI**:
  1. Open `lib/data.ts`.
  2. Replace `getDailyForecast(date)` and `getCombinedDistrictData(date)` with `fetch('http://localhost:8000/api/v1/forecast?date=' + date)`.
  3. No changes are required in `app/page.tsx` or any UI component!

---

## 🎨 Design System & Tokens
* **`lib/theme.ts`**: Centralized tokens for colors, typography, borders, and IMD classification brackets extracted from Google Stitch `DESIGN.md`.
* **Shared with Person B**: Both Person A and Person B use `lib/theme.ts` and `lib/rainfallScale.ts` to maintain consistent visual styling.
