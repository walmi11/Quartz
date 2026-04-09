import { BookOpen, FlaskConical, Calculator, Code2, Globe2, Palette } from "lucide-react";

export const ICON_OPTIONS = [
  { id: "book", label: "Livre" },
  { id: "science", label: "Science" },
  { id: "math", label: "Maths" },
  { id: "code", label: "Code" },
  { id: "globe", label: "Web/Langues" },
  { id: "art", label: "Art" },
];

export default function MatiereIcon({ iconId, className = "w-6 h-6", size = 24 }: { iconId: string, className?: string, size?: number | string }) {
  switch (iconId) {
    case "book":
      return <BookOpen className={className} size={size} />;
    case "science":
      return <FlaskConical className={className} size={size} />;
    case "math":
      return <Calculator className={className} size={size} />;
    case "code":
      return <Code2 className={className} size={size} />;
    case "globe":
      return <Globe2 className={className} size={size} />;
    case "art":
      return <Palette className={className} size={size} />;
    default:
      // Fallback pour les vieilles string emojis ou par défaut
      if (iconId && typeof iconId === "string" && ["📚", "💻", "🔬", "📐", "🌍", "🎨"].includes(iconId)) {
        return (
          <span className={`inline-flex items-center justify-center ${className}`} style={{ fontSize: size }}>
            {iconId}
          </span>
        );
      }
      return <BookOpen className={className} size={size} />;
  }
}
