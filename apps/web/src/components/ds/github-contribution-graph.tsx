import type { GitHubContributionDayDto } from "@portfolio/contracts";
import { cn } from "@/lib/utils";

type GitHubContributionGraphProps = {
  className?: string;
  contributions: GitHubContributionDayDto[];
  total: number;
  username: string;
};

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export function GitHubContributionGraph({ className, contributions, total, username }: GitHubContributionGraphProps) {
  if (!contributions.length) return null;

  const year = new Date().getFullYear();
  const cells = buildContributionCells(year, contributions);
  const monthMarkers = buildMonthMarkers(year);

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-card/75 p-4", className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Contribuicoes no GitHub</p>
          <p className="mt-1 text-xs text-muted-foreground">{total.toLocaleString("pt-BR")} contribuicoes em {year}</p>
        </div>
        <a className="text-xs text-primary-accent hover:text-foreground" href={`https://github.com/${username}`} rel="noreferrer" target="_blank">
          @{username}
        </a>
      </div>

      <div className="mt-5 overflow-x-auto pb-2">
        <div className="min-w-[720px]">
          <div className="ml-9 grid h-5 grid-cols-[repeat(53,1fr)] gap-1 text-[10px] text-foreground-subtle">
            {monthMarkers.map((month) => (
              <span className="truncate" key={month.label} style={{ gridColumnStart: month.column }}>
                {month.label}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-[28px_minmax(0,1fr)] gap-2">
            <div className="grid grid-rows-7 gap-1 text-[10px] text-foreground-subtle">
              {weekDays.map((day, index) => (
                <span className={cn(index % 2 === 0 && "opacity-0")} key={day}>{day}</span>
              ))}
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-1">
              {cells.map((cell, index) => (
                <span
                  aria-label={cell ? `${cell.count} contribuicoes em ${formatGraphDate(cell.date)}` : undefined}
                  className={cn("size-3 rounded-[3px]", cell ? contributionLevelClass(cell.level) : "bg-transparent")}
                  key={cell?.date ?? `empty-${index}`}
                  title={cell ? `${cell.count} contribuicoes em ${formatGraphDate(cell.date)}` : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2 text-[11px] text-foreground-subtle">
        <span>Menos</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <span className={cn("size-3 rounded-[3px]", contributionLevelClass(level))} key={level} />
        ))}
        <span>Mais</span>
      </div>
    </div>
  );
}

function buildContributionCells(year: number, contributions: GitHubContributionDayDto[]) {
  const byDate = new Map(contributions.map((day) => [day.date, day]));
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  const firstWeekDay = start.getDay();
  const daysInYear = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
  const totalCells = Math.ceil((firstWeekDay + daysInYear) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    const dayIndex = index - firstWeekDay;
    if (dayIndex < 0 || dayIndex >= daysInYear) return null;

    const date = new Date(year, 0, dayIndex + 1);
    const key = toDateKey(date);

    return byDate.get(key) ?? { count: 0, date: key, level: 0 };
  });
}

function buildMonthMarkers(year: number) {
  const firstWeekDay = new Date(year, 0, 1).getDay();

  return months.map((label, index) => {
    const dayOfYear = Math.round((new Date(year, index, 1).getTime() - new Date(year, 0, 1).getTime()) / 86_400_000);
    return {
      column: Math.floor((firstWeekDay + dayOfYear) / 7) + 1,
      label,
    };
  });
}

function contributionLevelClass(level: number) {
  if (level >= 4) return "bg-emerald-400";
  if (level === 3) return "bg-emerald-500/80";
  if (level === 2) return "bg-emerald-600/65";
  if (level === 1) return "bg-emerald-700/55";

  return "bg-surface-raised";
}

function formatGraphDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function toDateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
}
