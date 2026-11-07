import { Card, CardContent } from "@/components/ui/card";
import { Orb, type OrbColor } from "@/components/aero/Orb";
import { Tilt } from "@/components/aero/Tilt";

export function StatCard({
  label,
  value,
  hint,
  orb,
  delay = 0,
}: {
  label: string;
  value: string | number;
  hint: string;
  orb: OrbColor;
  delay?: number;
}) {
  return (
    <Tilt>
      <Card className="aero-stat">
        <CardContent className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-muted-foreground">{label}</p>
          <p className="aero-stat__value font-mono">{value}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </CardContent>
      </Card>
      <Orb color={orb} size={84} delay={delay} className="aero-stat__orb" />
    </Tilt>
  );
}
