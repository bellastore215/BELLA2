import { ImageResponse } from "next/og";

const variants = {
  "192": { size: 192, padding: 0.18 },
  "512": { size: 512, padding: 0.18 },
  // Maskable icons are cropped to a circle on some platforms; keep the mark inside the 80% safe zone.
  maskable: { size: 512, padding: 0.3 },
  apple: { size: 180, padding: 0.18 },
} as const;

type Variant = keyof typeof variants;

function isVariant(value: string): value is Variant {
  return value in variants;
}

export function generateStaticParams() {
  return Object.keys(variants).map((variant) => ({ variant }));
}

export async function GET(_request: Request, { params }: RouteContext<"/pwa-icon/[variant]">) {
  const { variant } = await params;
  if (!isVariant(variant)) return new Response("Not found", { status: 404 });

  const { size, padding } = variants[variant];
  const ring = Math.round(size * (1 - padding * 2));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1e1c19",
        }}
      >
        <div
          style={{
            width: ring,
            height: ring,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            border: `${Math.max(2, Math.round(size / 96))}px solid #c2a46e`,
            color: "#f8f4ed",
            fontSize: Math.round(ring * 0.5),
            fontWeight: 300,
            letterSpacing: "-0.02em",
          }}
        >
          B
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}
