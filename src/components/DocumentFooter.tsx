import { Calendar, User, Clock } from "lucide-react";
import type { AppConfig } from "../config/app.config";

interface DocumentFooterProps {
  config: AppConfig;
  fileName?: string;
}

export const DocumentFooter = ({ config, fileName }: DocumentFooterProps) => {
  // Get current date for created/updated (in a real app, this would come from file metadata)
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <footer className="document-footer mt-12 pt-6 border-t theme-border">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs theme-text-secondary">
        {/* Created Date */}
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 theme-accent" />
          <span>{currentDate}</span>
        </div>

        {/* Last Updated */}
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 theme-accent" />
          <span>{currentDate}</span>
        </div>

        {/* Author (linked to website if URL exists) */}
        <div className="flex items-center gap-1.5 flex-1">
          <User className="w-3.5 h-3.5 theme-accent" />
          {config.site.url ? (
            <a
              href={config.site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="theme-accent hover:underline transition-colors duration-200">
              {config.site.author}
            </a>
          ) : (
            <span>{config.site.author}</span>
          )}
        </div>

        {/* File Name */}
        {fileName && (
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full theme-accent-bg opacity-60"></div>
            </span>
            <code className="text-[10px] px-1 py-0.5 rounded theme-bg-secondary opacity-60 font-mono">{fileName}</code>
          </div>
        )}

        {/* Powered by QuickDoc */}
      </div>
    </footer>
  );
};
